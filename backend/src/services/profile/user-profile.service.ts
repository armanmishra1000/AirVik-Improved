import mongoose from 'mongoose';
import User, { IUserDocument } from '../../models/user.model';

// Types for service functions
export interface ViewProfileResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateProfileResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
  message?: string;
}

/**
 * Extract first and last name from the combined name field
 * @param fullName The combined name from the database
 * @returns Object with firstName and lastName
 */
const extractNameParts = (fullName: string): { firstName: string; lastName: string } => {
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return { firstName, lastName };
};

/**
 * Combine first and last name into a single name field
 * @param firstName First name
 * @param lastName Last name
 * @returns Combined name string
 */
const combineNameParts = (firstName: string, lastName: string): string => {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
};

/**
 * View user profile information
 * @param userId The user ID from JWT token
 * @returns ServiceResponse with user profile data
 */
export const viewUserProfile = async (userId: string): Promise<ServiceResponse<ViewProfileResponse>> => {
  try {
    // Find user by ID
    const user = await User.findById(userId) as IUserDocument | null;
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      };
    }
    
    // Extract name parts from the combined name field
    const { firstName, lastName } = extractNameParts(user.name);
    
    // Format response according to API contract
    const userData = {
      id: user._id instanceof mongoose.Types.ObjectId ? user._id.toString() : String(user._id),
      firstName,
      lastName,
      email: user.email,
      isEmailVerified: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
    
    return {
      success: true,
      data: {
        user: userData
      }
    };
  } catch (error) {
    console.error('Error in viewUserProfile:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    };
  }
};

/**
 * Update user profile information
 * @param userId The user ID from JWT token
 * @param updateData The profile data to update
 * @returns ServiceResponse with updated user profile data
 */
export const updateUserProfile = async (
  userId: string, 
  updateData: UpdateProfileData
): Promise<ServiceResponse<UpdateProfileResponse>> => {
  try {
    // Validate input data
    const { firstName, lastName, email } = updateData;
    
    // Check if email is already in use by another user
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim(),
      _id: { $ne: userId } // Exclude current user
    });
    
    if (existingUser) {
      return {
        success: false,
        error: 'Email is already in use',
        code: 'EMAIL_EXISTS'
      };
    }
    
    // Find current user
    const user = await User.findById(userId) as IUserDocument | null;
    
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      };
    }
    
    // Combine first and last name for storage
    const combinedName = combineNameParts(firstName, lastName);
    
    // Update user fields
    user.name = combinedName;
    user.email = email.toLowerCase().trim();
    
    // Save the updated user
    await user.save();
    
    // Extract name parts for response
    const { firstName: updatedFirstName, lastName: updatedLastName } = extractNameParts(user.name);
    
    // Format response according to API contract
    const userData = {
      id: user._id instanceof mongoose.Types.ObjectId ? user._id.toString() : String(user._id),
      firstName: updatedFirstName,
      lastName: updatedLastName,
      email: user.email,
      isEmailVerified: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
    
    return {
      success: true,
      data: {
        user: userData,
        message: 'Profile updated successfully'
      }
    };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    };
  }
};

// Export service object for consistency with existing patterns
export const userProfileService = {
  viewUserProfile,
  updateUserProfile
};

export default userProfileService; 