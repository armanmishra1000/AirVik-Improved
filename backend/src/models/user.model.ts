import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// User interface for TypeScript
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  tokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User document interface extending Mongoose Document
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User schema definition
const userSchema = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters long'],
      maxlength: [50, 'First name must be less than 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters long'],
      maxlength: [50, 'Last name must be less than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Don't include password in queries by default
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      select: false // Don't include token in queries by default
    },
    tokenExpiry: {
      type: Date,
      select: false // Don't include expiry in queries by default
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: {
      transform: function(doc, ret: any) {
        // Remove sensitive fields from JSON output
        if ('password' in ret) delete ret.password;
        if ('emailVerificationToken' in ret) delete ret.emailVerificationToken;
        if ('tokenExpiry' in ret) delete ret.tokenExpiry;
        if ('__v' in ret) delete ret.__v;
        // Convert _id to id
        if ('_id' in ret) {
          ret.id = ret._id;
          delete ret._id;
        }
        return ret;
      }
    }
  }
);

// Create unique index on email field
userSchema.index({ email: 1 }, { unique: true });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Static method to find user by email with password field
userSchema.statics.findByEmailWithPassword = function(email: string) {
  return this.findOne({ email }).select('+password');
};

// Static method to find user by verification token
userSchema.statics.findByVerificationToken = function(token: string) {
  return this.findOne({
    emailVerificationToken: token,
    tokenExpiry: { $gt: new Date() }
  }).select('+emailVerificationToken +tokenExpiry');
};

// Create and export the User model
const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;
