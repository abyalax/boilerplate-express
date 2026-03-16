import { createRouter } from '~/common/http/router'
import { AuthMiddleware } from './common/middleware/auth.middleware'
import { authRoutes } from './modules/auth/auth.routes'
import { userRoutes } from './modules/user/user.routes'

export const routes = createRouter()

routes.use('/', authRoutes)
routes.use('/', userRoutes) // add AuthMiddleware here to protect
