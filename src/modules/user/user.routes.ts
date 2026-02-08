import { catchMethodNotAllowed } from '~/common/middleware/catch.middleware'
import { getProfile } from './user.controller'
import { createRouter } from '~/common/http/router'

export const userRoutes = createRouter()

userRoutes.get('/users/me', getProfile)

userRoutes.use('/users', catchMethodNotAllowed)
