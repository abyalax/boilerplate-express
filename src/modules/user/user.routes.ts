import { createRouter } from '~/common/http/router'
import { catchMethodNotAllowed } from '~/common/middleware/catch.middleware'
import { getProfile, listUser } from './user.controller'

export const userRoutes = createRouter()

userRoutes.get('/users/me', getProfile)
userRoutes.get('/users', listUser)

userRoutes.use('/users', catchMethodNotAllowed)
