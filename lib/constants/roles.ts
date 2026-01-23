// Role definitions based on finance_info_platform_gaps.md personas
// Persona 1: Regular User (Investor) - Standard access
// Persona 2: Premium User (Pro Investor) - Subscription-based
// Persona 3: Admin (Content Manager) - Administrative access

export const ROLES = {
  USER: 'user',
  PREMIUM: 'premium',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Role hierarchy: admin > premium > user
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.USER]: 1,
  [ROLES.PREMIUM]: 2,
  [ROLES.ADMIN]: 3,
};

// Feature limits per role (from personas doc)
export const ROLE_LIMITS = {
  [ROLES.USER]: {
    maxWatchlistStocks: 20,
    maxActiveAlerts: 5,
    canAccessAdmin: false,
    canPublishContent: false,
    canExportData: false,
    hasAIChatbot: false,
    hasPortfolioTracker: false,
  },
  [ROLES.PREMIUM]: {
    maxWatchlistStocks: Infinity,
    maxActiveAlerts: Infinity,
    canAccessAdmin: false,
    canPublishContent: false,
    canExportData: true,
    hasAIChatbot: true,
    hasPortfolioTracker: true,
  },
  [ROLES.ADMIN]: {
    maxWatchlistStocks: Infinity,
    maxActiveAlerts: Infinity,
    canAccessAdmin: true,
    canPublishContent: true,
    canExportData: true,
    hasAIChatbot: true,
    hasPortfolioTracker: true,
  },
} as const;

// Helper to check if role has at least the required level
export const hasMinimumRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Helper to get limits for a role
export const getRoleLimits = (role: UserRole) => {
  return ROLE_LIMITS[role] || ROLE_LIMITS[ROLES.USER];
};
