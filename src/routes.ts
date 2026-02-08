import { authRoutes } from './modules/auth/auth.routes'
import { userRoutes } from './modules/user/user.routes'
import { AuthMiddleware } from './common/middleware/auth.middleware'
import { createRouter } from '~/common/http/router'

export const routes = createRouter()

routes.use('/', authRoutes)
routes.use('/', AuthMiddleware, userRoutes)
