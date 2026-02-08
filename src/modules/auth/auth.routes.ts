import { createRouter } from '~/common/http/router'
import { login, register } from './auth.controller'

export const authRoutes = createRouter()

authRoutes.post('/auth/login', login)
authRoutes.post('/auth/register', register)
