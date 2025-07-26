export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]

export interface UserAudit {
  id: string
  userId: string
  action: 'created' | 'updated' | 'deleted'
  changes?: Record<string, any>
  performedBy: string
  performedAt: Date
}

export interface UserSearchCriteria {
  name?: string
  phoneNumber?: string
  status?: UserStatus
  createdBy?: string
  createdAfter?: Date
  createdBefore?: Date
  limit?: number
  offset?: number
}
