import mongoose, { Document, Schema } from 'mongoose';

// Import UserRole type from user contract
export type UserRole = 'user' | 'staff' | 'admin';

// Role audit log interface for TypeScript
export interface IRoleAuditLog {
  userId: string;
  previousRole: UserRole;
  newRole: UserRole;
  changedBy: string;
  reason?: string;
  timestamp: Date;
  ipAddress?: string;
}

// Role audit log document interface extending Mongoose Document
export interface IRoleAuditLogDocument extends IRoleAuditLog, Document {}

// Create audit log data interface for creating new logs
export interface CreateAuditLogData {
  userId: string;
  previousRole: UserRole;
  newRole: UserRole;
  changedBy: string;
  reason?: string;
  ipAddress?: string;
}

// Role audit log schema definition
const roleAuditLogSchema = new Schema<IRoleAuditLogDocument>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User'
    },
    previousRole: {
      type: String,
      required: [true, 'Previous role is required'],
      enum: {
        values: ['user', 'staff', 'admin'],
        message: 'Previous role must be one of: user, staff, admin'
      }
    },
    newRole: {
      type: String,
      required: [true, 'New role is required'],
      enum: {
        values: ['user', 'staff', 'admin'],
        message: 'New role must be one of: user, staff, admin'
      }
    },
    changedBy: {
      type: String,
      required: [true, 'Changed by user ID is required'],
      ref: 'User'
    },
    reason: {
      type: String,
      maxlength: [500, 'Reason must be less than 500 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    },
    ipAddress: {
      type: String,
      validate: {
        validator: function(v: string) {
          // Basic IP address validation (IPv4 and IPv6)
          const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
          const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
          return !v || ipv4Regex.test(v) || ipv6Regex.test(v);
        },
        message: 'Invalid IP address format'
      }
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: {
      transform: function(doc, ret: any) {
        // Remove version field from JSON output
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

// Create indexes for efficient querying
roleAuditLogSchema.index({ userId: 1 }); // For finding all changes for a specific user
roleAuditLogSchema.index({ changedBy: 1 }); // For finding all changes made by a specific admin
roleAuditLogSchema.index({ timestamp: -1 }); // For finding recent changes (descending order)
roleAuditLogSchema.index({ userId: 1, timestamp: -1 }); // Compound index for user's change history
roleAuditLogSchema.index({ newRole: 1, timestamp: -1 }); // For finding role assignments by role type

// Pre-save middleware to ensure timestamp is set
roleAuditLogSchema.pre('save', function(next) {
  if (!this.timestamp) {
    this.timestamp = new Date();
  }
  next();
});

// Static method to find audit logs by user ID
roleAuditLogSchema.statics.findByUserId = function(userId: string) {
  return this.find({ userId }).sort({ timestamp: -1 });
};

// Static method to find audit logs by admin who made changes
roleAuditLogSchema.statics.findByChangedBy = function(changedBy: string) {
  return this.find({ changedBy }).sort({ timestamp: -1 });
};

// Static method to find audit logs by role
roleAuditLogSchema.statics.findByRole = function(role: UserRole) {
  return this.find({ newRole: role }).sort({ timestamp: -1 });
};

// Static method to find audit logs within date range
roleAuditLogSchema.statics.findByDateRange = function(startDate: Date, endDate: Date) {
  return this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ timestamp: -1 });
};

// Static method to get recent role changes (last N days)
roleAuditLogSchema.statics.findRecentChanges = function(days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return this.find({ timestamp: { $gte: cutoffDate } }).sort({ timestamp: -1 });
};

// Create and export the RoleAuditLog model
const RoleAuditLog = mongoose.model<IRoleAuditLogDocument>('RoleAuditLog', roleAuditLogSchema);

export default RoleAuditLog; 