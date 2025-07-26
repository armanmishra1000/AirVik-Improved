import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import User, { IUserDocument } from '../../models/user.model';

/**
 * Authentication Service for User Registration and Email Verification
 */
class UserAuthService {
  /**
   * Register a new user
   * @param userData User registration data
   * @returns Newly created user object
   */
  async registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<IUserDocument> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        const error = new Error('Email already exists');
        (error as any).code = 'EMAIL_EXISTS';
        (error as any).statusCode = 409;
        throw error;
      }

      // Generate verification token
      const verificationToken = await this.generateVerificationToken();
      
      // Create new user with verification token
      const user = new User({
        ...userData,
        emailVerificationToken: verificationToken.token,
        tokenExpiry: verificationToken.expiry
      });

      // Save user to database (password hashing happens in pre-save hook)
      const savedUser = await user.save();

      // Send verification email
      await this.sendVerificationEmail(
        savedUser.email,
        savedUser.firstName,
        verificationToken.token
      );

      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify user email with token
   * @param token Verification token
   * @returns Updated user document
   */
  async verifyEmail(token: string): Promise<IUserDocument> {
    try {
      // Find user by verification token
      const user = await User.findOne({
        emailVerificationToken: token,
        tokenExpiry: { $gt: new Date() }
      }).select('+emailVerificationToken +tokenExpiry');

      if (!user) {
        const error = new Error('Invalid or expired verification token');
        (error as any).code = 'INVALID_TOKEN';
        (error as any).statusCode = 400;
        throw error;
      }

      // Check if already verified
      if (user.isEmailVerified) {
        const error = new Error('Email is already verified');
        (error as any).code = 'ALREADY_VERIFIED';
        (error as any).statusCode = 400;
        throw error;
      }

      // Update user verification status
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.tokenExpiry = undefined;
      
      // Save updated user
      await user.save();
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resend verification email
   * @param email User email
   * @returns Updated user document
   */
  async resendVerificationEmail(email: string): Promise<IUserDocument> {
    try {
      // Find user by email
      const user = await User.findOne({ email }).select('+emailVerificationToken +tokenExpiry');
      
      if (!user) {
        const error = new Error('Email not found');
        (error as any).code = 'EMAIL_NOT_FOUND';
        (error as any).statusCode = 404;
        throw error;
      }

      // Check if already verified
      if (user.isEmailVerified) {
        const error = new Error('Email is already verified');
        (error as any).code = 'ALREADY_VERIFIED';
        (error as any).statusCode = 400;
        throw error;
      }

      // Generate new verification token
      const verificationToken = await this.generateVerificationToken();
      
      // Update user with new token
      user.emailVerificationToken = verificationToken.token;
      user.tokenExpiry = verificationToken.expiry;
      await user.save();

      // Send verification email
      await this.sendVerificationEmail(
        user.email,
        user.firstName,
        verificationToken.token
      );

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate verification token with 24-hour expiry
   * @returns Object containing token and expiry date
   */
  private async generateVerificationToken(): Promise<{ token: string; expiry: Date }> {
    try {
      // Generate random token
      const token = randomBytes(32).toString('hex');
      
      // Set expiry to 24 hours from now
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      
      return { token, expiry };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send verification email with HTML template
   * @param email Recipient email
   * @param name Recipient name
   * @param token Verification token
   */
  private async sendVerificationEmail(
    email: string,
    name: string,
    token: string
  ): Promise<void> {
    try {
      // Get environment variables
      const { 
        EMAIL_HOST = 'smtp.example.com',
        EMAIL_PORT = '587',
        EMAIL_USER = 'noreply@airvik.com',
        EMAIL_PASS = 'password',
        FRONTEND_URL = 'http://localhost:3000'
      } = process.env;

      // Create transporter
      const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT, 10),
        secure: parseInt(EMAIL_PORT, 10) === 465, // true for 465, false for other ports
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
        }
      });

      // Verification URL
      const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`;

      // Email HTML template
      const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              border: 1px solid #ddd;
              border-radius: 5px;
              padding: 20px;
            }
            .header {
              background-color: #0f172a;
              color: white;
              padding: 10px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
            }
            .button {
              display: inline-block;
              background-color: #0f172a;
              color: white;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              font-size: 12px;
              color: #666;
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Airvik Hotels</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for registering with Airvik Hotels. Please verify your email address by clicking the button below:</p>
              <p><a href="${verificationUrl}" class="button">Verify Email</a></p>
              <p>Or copy and paste this link into your browser:</p>
              <p>${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you did not create an account with us, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Airvik Hotels. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email
      await transporter.sendMail({
        from: `"Airvik Hotels" <${EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: htmlTemplate
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}

export default new UserAuthService();
