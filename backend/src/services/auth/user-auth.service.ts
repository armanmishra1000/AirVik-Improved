import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User, { IUser, IRefreshToken } from '../../models/user.model';

// Types for service functions
interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

interface TokenPayload {
  userId: string;
  type: string;
  timestamp: number;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
  message?: string;
}

interface RegisterResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
  };
  message: string;
}

interface LoginResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Generate verification token with 24-hour expiry
export const generateVerificationToken = (userId: string): string => {
  const payload = {
    userId,
    type: 'email_verification',
    timestamp: Date.now(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '24h',
  });
};

// Generate access token with 15-minute expiry
export const generateAccessToken = (userId: string): string => {
  const payload = {
    userId,
    type: 'access_token',
    timestamp: Date.now(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '15m',
  });
};

// Generate refresh token with 7-day expiry
export const generateRefreshToken = (userId: string): string => {
  const payload = {
    userId,
    type: 'refresh_token',
    timestamp: Date.now(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d',
  });
};

// Verify token and return payload
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
};

// Send verification email with HTML template
export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  token: string
): Promise<ServiceResponse> => {
  try {
    const transporter = createEmailTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - AirVik Hotel System</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9fafb; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>AirVik Hotel System</h1>
                <p>Email Verification Required</p>
            </div>
            <div class="content">
                <h2>Welcome, ${firstName}!</h2>
                <p>Thank you for registering with AirVik Hotel System. To complete your registration, please verify your email address by clicking the button below:</p>
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
                <p><strong>Important:</strong> This verification link will expire in 24 hours.</p>
                <p>If you didn't create an account with AirVik, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 AirVik Hotel System. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const textTemplate = `
    Welcome to AirVik Hotel System, ${firstName}!
    
    Thank you for registering. To complete your registration, please verify your email address by visiting:
    ${verificationUrl}
    
    This verification link will expire in 24 hours.
    
    If you didn't create an account with AirVik, please ignore this email.
    
    © 2025 AirVik Hotel System. All rights reserved.
    `;

    const mailOptions = {
      from: `"AirVik Hotel System" <${process.env.SMTP_FROM || 'noreply@airvik.com'}>`,
      to: email,
      subject: 'Verify Your Email Address - AirVik Hotel System',
      text: textTemplate,
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      data: { message: 'Verification email sent successfully' },
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send verification email',
      code: 'EMAIL_SEND_ERROR',
    };
  }
};

// Register new user with password hashing and email verification
export const registerUser = async (userData: RegisterUserData): Promise<ServiceResponse<RegisterResponse>> => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = userData;

    // Validation
    const validationErrors: string[] = [];

    if (!firstName || firstName.length < 2 || firstName.length > 50) {
      validationErrors.push('First name must be between 2 and 50 characters');
    }

    if (!lastName || lastName.length < 2 || lastName.length > 50) {
      validationErrors.push('Last name must be between 2 and 50 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      validationErrors.push('Email format is invalid');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      validationErrors.push('Password must be at least 8 characters long with 1 uppercase, 1 lowercase, and 1 number');
    }

    if (password !== confirmPassword) {
      validationErrors.push('Passwords do not match');
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validationErrors,
      };
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        error: 'Email already exists',
        code: 'EMAIL_EXISTS',
      };
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const tempUserId = new Date().getTime().toString(); // Temporary ID for token generation
    const verificationToken = generateVerificationToken(tempUserId);
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      tokenExpiry,
    });

    const savedUser = await newUser.save();

    // Update token with actual user ID
    const actualToken = generateVerificationToken(String(savedUser._id));
    savedUser.emailVerificationToken = actualToken;
    await savedUser.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(savedUser.email, savedUser.firstName, actualToken);
    
    if (!emailResult.success) {
      // If email fails, we still return success for user creation but log the error
      console.error('Failed to send verification email:', emailResult.error);
    }

    // Prepare response
    const userResponse = {
      id: String(savedUser._id),
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      isEmailVerified: savedUser.isEmailVerified,
      createdAt: savedUser.createdAt.toISOString(),
    };

    return {
      success: true,
      data: {
        user: userResponse,
        message: 'Registration successful. Please check your email for verification.',
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  }
};

// Verify email using verification token
export const verifyEmail = async (token: string): Promise<ServiceResponse> => {
  try {
    if (!token) {
      return {
        success: false,
        error: 'Verification token is required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Verify and decode token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (jwtError) {
      return {
        success: false,
        error: 'Invalid or expired verification token',
        code: 'INVALID_TOKEN',
      };
    }

    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return {
        success: false,
        error: 'Email is already verified',
        code: 'ALREADY_VERIFIED',
      };
    }

    // Check token expiry
    if (user.tokenExpiry && user.tokenExpiry < new Date()) {
      return {
        success: false,
        error: 'Invalid or expired verification token',
        code: 'INVALID_TOKEN',
      };
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    return {
      success: true,
      data: {
        message: 'Email verified successfully',
      },
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  }
};

// Resend verification email
export const resendVerificationEmail = async (email: string): Promise<ServiceResponse> => {
  try {
    if (!email) {
      return {
        success: false,
        error: 'Email is required',
        code: 'VALIDATION_ERROR',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format',
        code: 'VALIDATION_ERROR',
      };
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return {
        success: false,
        error: 'Email not found',
        code: 'EMAIL_NOT_FOUND',
      };
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return {
        success: false,
        error: 'Email is already verified',
        code: 'ALREADY_VERIFIED',
      };
    }

    // Generate new verification token
    const newToken = generateVerificationToken(String(user._id));
    const newTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    user.emailVerificationToken = newToken;
    user.tokenExpiry = newTokenExpiry;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, user.firstName, newToken);
    
    if (!emailResult.success) {
      return {
        success: false,
        error: 'Failed to send verification email',
        code: 'EMAIL_SEND_ERROR',
      };
    }

    return {
      success: true,
      data: {
        message: 'Verification email sent successfully',
      },
    };
  } catch (error) {
    console.error('Resend verification error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  }
};

// Login user with rate limiting
export const loginUser = async (userData: LoginUserData): Promise<ServiceResponse<LoginResponse>> => {
  try {
    const { email, password } = userData;

    // Validation
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Find user by email with password included
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      };
    }

    // Check if account is locked due to too many failed attempts
    if (user.isLocked()) {
      const lockTime = new Date(user.lockUntil as Date).toISOString();
      return {
        success: false,
        error: `Account is locked until ${lockTime}`,
        code: 'ACCOUNT_LOCKED',
      };
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    
    // Handle failed login attempt
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      // Lock account if 5 or more failed attempts
      if (user.loginAttempts >= 5) {
        // Lock for 15 minutes
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      
      await user.save();
      
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      };
    }

    // Check if email is verified (using isActive field)
    if (!user.isActive) {
      return {
        success: false,
        error: 'Email not verified. Please verify your email first.',
        code: 'EMAIL_NOT_VERIFIED',
      };
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();

    // Generate tokens
    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = generateRefreshToken(String(user._id));
    
    // Calculate token expiry dates
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Store refresh token in user document
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: refreshTokenExpiry,
      createdAt: new Date()
    });
    
    // Limit stored refresh tokens to 5 most recent
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();

    // Prepare user data for response
    const userResponse = {
      id: String(user._id),
      firstName: user.name.split(' ')[0], // Using name field from user model
      lastName: user.name.split(' ').slice(1).join(' '), // Using name field from user model
      email: user.email,
      isEmailVerified: user.isActive, // Using isActive as isEmailVerified
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return {
      success: true,
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  }
};

// Logout user by invalidating refresh token
export const logoutUser = async (refreshToken: string): Promise<ServiceResponse> => {
  try {
    if (!refreshToken) {
      return {
        success: false,
        error: 'Refresh token is required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded || decoded.type !== 'refresh_token') {
      return {
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      };
    }

    // Find user and remove the specific refresh token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    // Filter out the provided refresh token
    user.refreshTokens = user.refreshTokens.filter(
      (token: IRefreshToken) => token.token !== refreshToken
    );

    await user.save();

    return {
      success: true,
      data: {}
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  }
};

// Refresh user token with token rotation
export const refreshUserToken = async (refreshToken: string): Promise<ServiceResponse<RefreshTokenResponse>> => {
  try {
    if (!refreshToken) {
      return {
        success: false,
        error: 'Refresh token is required',
        code: 'VALIDATION_ERROR',
      };
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded || decoded.type !== 'refresh_token') {
      return {
        success: false,
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN',
      };
    }

    // Find user and check if refresh token exists in their tokens array
    const user = await User.findById(decoded.userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      };
    }

    // Find the specific refresh token in the user's tokens array
    const tokenIndex = user.refreshTokens.findIndex(
      (token: IRefreshToken) => token.token === refreshToken
    );

    if (tokenIndex === -1) {
      return {
        success: false,
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN',
      };
    }

    // Check if token is expired in our database
    const tokenData = user.refreshTokens[tokenIndex];
    if (new Date() > tokenData.expiresAt) {
      // Remove expired token
      user.refreshTokens.splice(tokenIndex, 1);
      await user.save();
      
      return {
        success: false,
        error: 'Refresh token has expired',
        code: 'EXPIRED_REFRESH_TOKEN',
      };
    }

    // Generate new tokens (token rotation)
    const newAccessToken = generateAccessToken(String(user._id));
    const newRefreshToken = generateRefreshToken(String(user._id));
    
    // Calculate new refresh token expiry
    const newRefreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Remove the old refresh token and add the new one
    user.refreshTokens.splice(tokenIndex, 1);
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: newRefreshTokenExpiry,
      createdAt: new Date()
    });
    
    await user.save();

    return {
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    };
  }
};

// Export all functions
export const userAuthService = {
  registerUser,
  verifyEmail,
  resendVerificationEmail,
  loginUser,
  logoutUser,
  refreshUserToken,
  generateVerificationToken,
  sendVerificationEmail,
};

export default userAuthService;
