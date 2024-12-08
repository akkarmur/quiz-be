import { Router } from 'express'
import multer from 'multer'

import { env } from '../../infrastructure/env'
import { verifyJWTHS512Middleware } from '../../infrastructure/helpers/token/jwt-HS256.token'
import { validation } from '../../infrastructure/helpers/validator'
import { getUserController } from '../controller/user/get-user.controller'
import { updateUserController } from '../controller/user/update-user.controller'
import { getUserSchema } from '../validation/user/get-user.schema'
import { updateUserSchema } from '../validation/user/update-user.schema'

const route = Router()
const upload = multer()

/**
 * For getting user details
 */
route.get(
  '/',
  validation(getUserSchema),
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  getUserController,
)
/**
 * For updating user details
 */
route.patch(
  '/',
  upload.single('image'),
  validation(updateUserSchema),
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  updateUserController,
)

export const userRoute = route
