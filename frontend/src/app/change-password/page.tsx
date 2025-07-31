import React from 'react';
import { Metadata } from 'next';
import ChangePasswordForm from '@/src/components/auth/ChangePasswordForm';

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: 'Change Password | AirVik',
  description: 'Change your account password securely',
  keywords: ['change password', 'security', 'account', 'airvik'],
  robots: 'noindex, nofollow', // Don't index password change pages
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Change Password Page
 * 
 * This page allows authenticated users to change their password.
 * It requires the user to provide their current password for verification
 * and a new password that meets security requirements.
 * 
 * Features:
 * - Current password verification
 * - New password with strength validation
 * - Password confirmation
 * - Real-time validation feedback
 * - Password strength indicator
 * - Secure form submission
 * - Error handling and user feedback
 * - Automatic redirect after success
 */
const ChangePasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ChangePasswordForm />
    </div>
  );
};

export default ChangePasswordPage; 