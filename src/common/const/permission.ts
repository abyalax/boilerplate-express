/** biome-ignore-all lint/style/useNamingConvention: <off> */
export type roles = 'Client' | 'Admin'

export const ROLE = Object.freeze({
  ADMIN: 'Admin',
  CLIENT: 'Client',
} as const)

export const ROLEIDS = Object.freeze({
  Admin: 1,
  Client: 2,
} as const)

export const PERMISSIONS = Object.freeze({
  ADMIN: {
    READ_CLIENT: 'client:read',
    UPDATE_CLIENT: 'client:update',
    CREATE_CLIENT: 'client:create',
    DELETE_CLIENT: 'client:delete',

    READ_MESSAGES: 'messages:read',
    UPDATE_MESSAGES: 'messages:update',
    CREATE_MESSAGES: 'messages:create',
    DELETE_MESSAGES: 'messages:delete',
  },
  CLIENT: {
    READ_MESSAGES: 'messages:read',
    UPDATE_MESSAGES: 'messages:update',
    CREATE_MESSAGES: 'messages:create',
    DELETE_MESSAGES: 'messages:delete',
  },
} as const)
