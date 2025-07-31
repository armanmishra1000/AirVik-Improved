"use client";

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  AssignRoleFormData, 
  AssignRoleFormValidation, 
  FieldValidation, 
  RoleUIState,
  UserWithRole 
} from '../../types/role.types';
import * as roleService from '../../services/role.service';
import { isSuccessResponse, isErrorResponse, getErrorMessage } from '../../services/role.service';

/**
 * RoleAssignmentForm Component
 * 
 * A reusable role assignment form component for the Airvik Hotel System
 * This component handles form state, validation, and UI feedback
 * Now integrated with real backend API calls
 */
interface RoleAssignmentFormProps {
  users: UserWithRole[];
  onRoleAssigned?: () => void;
}

const RoleAssignmentForm: React.FC<RoleAssignmentFormProps> = ({ 
  users, 
  onRoleAssigned 
}) => {
  // ============================================================================
  // USER DATA FROM PROPS
  // ============================================================================
  
  // Use users from props instead of mock data

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Form data state
  const [formData, setFormData] = useState<AssignRoleFormData>({
    userId: '',
    role: UserRole.USER,
    reason: ''
  });
  
  // Form validation state
  const [validation, setValidation] = useState<AssignRoleFormValidation>({
    userId: { isValid: true },
    role: { isValid: true },
    reason: { isValid: true },
    isFormValid: false
  });
  
  // UI state for loading, errors, success
  const [uiState, setUiState] = useState<RoleUIState>({
    loading: {
      isAssigningRole: false,
      isGettingUserRole: false,
      isUpdatingRole: false,
      isGettingUsersByRole: false,
      isValidatingAssignment: false
    },
    error: null,
    success: null,
    isFormSubmitted: false
  });
  
  // User search and selection state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<UserWithRole[]>(users);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  
  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
  
  /**
   * Handle input field changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (uiState.error) {
      setUiState(prev => ({
        ...prev,
        error: null
      }));
    }
  };
  
  /**
   * Handle user search
   */
  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    
    if (searchValue.trim() === '') {
      setFilteredUsers(users);
      setShowUserDropdown(false);
    } else {
      const filtered = users.filter((user: UserWithRole) => 
        user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowUserDropdown(true);
    }
  };
  
  /**
   * Handle user selection
   */
  const handleUserSelect = (user: UserWithRole): void => {
    setSelectedUser(user);
    setFormData(prev => ({
      ...prev,
      userId: user.id
    }));
    setSearchTerm(`${user.firstName} ${user.lastName} (${user.email})`);
    setShowUserDropdown(false);
    
    // Clear user validation error
    setValidation(prev => ({
      ...prev,
      userId: { isValid: true }
    }));
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Mark form as submitted to show all validation errors
    setUiState(prev => ({
      ...prev,
      isFormSubmitted: true
    }));
    
    // Validate all fields
    const validationResult = validateForm();
    
    if (!validationResult.isFormValid) {
      return;
    }
    
    // Set loading state
    setUiState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        isAssigningRole: true
      },
      error: null,
      success: null
    }));
    
    try {
      // Real API call using role service
      const result = await roleService.assignRole(formData);
      
      if (isSuccessResponse(result)) {
        // Show success message
        setUiState(prev => ({
          ...prev,
          loading: {
            ...prev.loading,
            isAssigningRole: false
          },
          success: result.data?.message || `Role ${formData.role} successfully assigned to ${selectedUser?.firstName} ${selectedUser?.lastName}`
        }));
      } else {
        throw new Error(getErrorMessage(result));
      }
      
      // Reset form
      resetForm();
      
      // Notify parent to refresh data
      if (onRoleAssigned) {
        onRoleAssigned();
      }
      
    } catch (error) {
      // Handle error
      setUiState(prev => ({
        ...prev,
        loading: {
          ...prev.loading,
          isAssigningRole: false
        },
        error: error instanceof Error ? error.message : 'Failed to assign role. Please try again.'
      }));
    }
  };
  
  /**
   * Reset form to initial state
   */
  const resetForm = (): void => {
    setFormData({
      userId: '',
      role: UserRole.USER,
      reason: ''
    });
    setSelectedUser(null);
    setSearchTerm('');
    setFilteredUsers(users);
    setShowUserDropdown(false);
    setValidation({
      userId: { isValid: true },
      role: { isValid: true },
      reason: { isValid: true },
      isFormValid: false
    });
    setUiState(prev => ({
      ...prev,
      isFormSubmitted: false
    }));
  };
  
  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================
  
  /**
   * Validate individual field
   */
  const validateField = (field: keyof AssignRoleFormData, value: string): FieldValidation => {
    switch (field) {
      case 'userId':
        if (!value.trim()) {
          return { isValid: false, error: 'Please select a user' };
        }
        return { isValid: true };
        
      case 'role':
        if (!value || !Object.values(UserRole).includes(value as UserRole)) {
          return { isValid: false, error: 'Please select a valid role' };
        }
        return { isValid: true };
        
      case 'reason':
        if (value.trim() && value.length > 500) {
          return { isValid: false, error: 'Reason must not exceed 500 characters' };
        }
        return { isValid: true };
        
      default:
        return { isValid: true };
    }
  };
  
  /**
   * Validate entire form
   */
  const validateForm = (): AssignRoleFormValidation => {
    const userIdValidation = validateField('userId', formData.userId);
    const roleValidation = validateField('role', formData.role);
    const reasonValidation = validateField('reason', formData.reason);
    
    const isFormValid = userIdValidation.isValid && roleValidation.isValid && reasonValidation.isValid;
    
    const validationResult: AssignRoleFormValidation = {
      userId: userIdValidation,
      role: roleValidation,
      reason: reasonValidation,
      isFormValid
    };
    
    setValidation(validationResult);
    return validationResult;
  };
  
  /**
   * Handle field blur for validation
   */
  const handleBlur = (field: keyof AssignRoleFormData): void => {
    const fieldValidation = validateField(field, formData[field]);
    
    setValidation(prev => ({
      ...prev,
      [field]: fieldValidation,
      isFormValid: field === 'userId' 
        ? fieldValidation.isValid && prev.role.isValid && prev.reason.isValid
        : field === 'role'
        ? prev.userId.isValid && fieldValidation.isValid && prev.reason.isValid
        : prev.userId.isValid && prev.role.isValid && fieldValidation.isValid
    }));
  };
  
  // ============================================================================
  // API INTEGRATION COMPLETE
  // ============================================================================
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Update filtered users when users prop changes
   */
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  /**
   * Validate form when inputs change
   */
  useEffect(() => {
    if (uiState.isFormSubmitted) {
      validateForm();
    }
  }, [formData, uiState.isFormSubmitted]);
  
  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  /**
   * Get role display name
   */
  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case UserRole.USER:
        return 'User';
      case UserRole.STAFF:
        return 'Staff';
      case UserRole.ADMIN:
        return 'Administrator';
      default:
        return role;
    }
  };
  
  /**
   * Get role color class
   */
  const getRoleColorClass = (role: UserRole): string => {
    switch (role) {
      case UserRole.USER:
        return 'bg-gray-100 text-gray-800';
      case UserRole.STAFF:
        return 'bg-blue-100 text-blue-800';
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Role Assignment
        </h2>
        
        {/* Error Alert */}
        {uiState.error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{uiState.error}</p>
          </div>
        )}
        
        {/* Success Alert */}
        {uiState.success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>{uiState.success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
          {/* User Search/Selection */}
          <div className="mb-6">
            <label 
              htmlFor="userSearch" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search User
            </label>
            <div className="relative">
              <input
                type="text"
                id="userSearch"
                value={searchTerm}
                onChange={handleUserSearch}
                onFocus={() => setShowUserDropdown(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by email or name..."
                disabled={uiState.loading.isAssigningRole}
              />
              
              {/* User Dropdown */}
              {showUserDropdown && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleUserSelect(user)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getRoleColorClass(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!validation.userId.isValid && uiState.isFormSubmitted && (
              <p className="mt-1 text-sm text-red-600">
                {validation.userId.error}
              </p>
            )}
          </div>
          
          {/* Current Role Display */}
          {selectedUser && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Role</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColorClass(selectedUser.role)}`}>
                  {getRoleDisplayName(selectedUser.role)}
                </span>
              </div>
            </div>
          )}
          
          {/* New Role Selection */}
          <div className="mb-6">
            <label 
              htmlFor="role" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              onBlur={() => handleBlur('role')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !validation.role.isValid && uiState.isFormSubmitted
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              disabled={uiState.loading.isAssigningRole}
              required
            >
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.STAFF}>Staff</option>
              <option value={UserRole.ADMIN}>Administrator</option>
            </select>
            {!validation.role.isValid && uiState.isFormSubmitted && (
              <p className="mt-1 text-sm text-red-600">
                {validation.role.error}
              </p>
            )}
          </div>
          
          {/* Reason Input */}
          <div className="mb-6">
            <label 
              htmlFor="reason" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reason (Optional)
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              onBlur={() => handleBlur('reason')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !validation.reason.isValid && uiState.isFormSubmitted
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="Enter reason for role change..."
              disabled={uiState.loading.isAssigningRole}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>Optional reason for role assignment</span>
              <span>{formData.reason.length}/500</span>
            </div>
            {!validation.reason.isValid && uiState.isFormSubmitted && (
              <p className="mt-1 text-sm text-red-600">
                {validation.reason.error}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uiState.loading.isAssigningRole}
              className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                uiState.loading.isAssigningRole
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {uiState.loading.isAssigningRole ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning Role...
                </div>
              ) : (
                'Assign Role'
              )}
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              disabled={uiState.loading.isAssigningRole}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleAssignmentForm; 