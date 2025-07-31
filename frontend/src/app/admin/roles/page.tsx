"use client";

import React, { useState, useEffect } from 'react';
import { Metadata } from 'next';
import RoleAssignmentForm from '../../../components/role/RoleAssignmentForm';
import { UserRole, UserWithRole } from '../../../types/role.types';
import * as roleService from '../../../services/role.service';
import { isSuccessResponse, isErrorResponse, getErrorMessage } from '../../../services/role.service';

/**
 * Role Management Page Component
 * 
 * This page provides a complete interface for managing user roles.
 * It displays a list of users with their current roles and includes
 * the role assignment form for changing user roles.
 * 
 * TODO: Add admin role check in F5
 */

/**
 * Role Management Page Component
 */
export default function RoleManagementPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // ============================================================================
  // API FUNCTIONS
  // ============================================================================
  
  /**
   * Fetch users from backend API
   */
  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await roleService.getUsersByRole();
      
      if (isSuccessResponse(result)) {
        setUsers(result.data.users);
      } else {
        throw new Error(getErrorMessage(result));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Refresh users list after role assignment
   */
  const handleRoleAssigned = (): void => {
    fetchUsers();
  };
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Load users on component mount
   */
  useEffect(() => {
    fetchUsers();
  }, []);

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

/**
 * Role Management Page Component
 * 
 * This page provides a complete interface for managing user roles.
 * It displays a list of users with their current roles and includes
 * the role assignment form for changing user roles.
 * 
 * TODO: Add admin role check in F5
 */
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumbs Navigation */}
      <nav className="mb-6">
        <ol className="flex text-sm text-gray-500">
          <li className="flex items-center">
            <a href="/" className="hover:text-blue-600">Home</a>
            <svg 
              className="h-5 w-5 text-gray-400 mx-1" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </li>
          <li className="flex items-center">
            <a href="/admin" className="hover:text-blue-600">Admin</a>
            <svg 
              className="h-5 w-5 text-gray-400 mx-1" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </li>
          <li className="text-blue-600 font-medium">Role Management</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Role Management
        </h1>
        <p className="text-gray-600">
          Manage user roles and permissions for the Airvik Hotel System
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users List Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Users List
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {users.length} users
              </span>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading users...</p>
            </div>
          )}

          {/* Users Table */}
          {!loading && (
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColorClass(user.role)}`}>
                            {getRoleDisplayName(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isEmailVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.isEmailVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-900 font-medium"
                            onClick={() => {
                              // TODO: Implement role change functionality in F5
                              console.log('Change role for user:', user.id);
                            }}
                          >
                            Change Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">There are no users to display at the moment.</p>
            </div>
          )}
        </div>

        {/* Role Assignment Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Assign Role
          </h2>
          <RoleAssignmentForm 
            users={users} 
            onRoleAssigned={handleRoleAssigned}
          />
        </div>
      </div>

      {/* Footer Information */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Role management is restricted to administrators only. 
          All role changes are logged for audit purposes.
        </p>
      </div>
    </div>
  );
} 