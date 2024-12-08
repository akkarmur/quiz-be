import { Router } from 'express'

import { env } from '../../infrastructure/env'
import { verifyJWTHS512Middleware } from '../../infrastructure/helpers/token/jwt-HS256.token'
import { validation } from '../../infrastructure/helpers/validator'
import { forgotPasswordController } from '../controller/auth/forgot-password.controller'
import { guestUserController } from '../controller/auth/guest-user.controller'
import { loginController } from '../controller/auth/login.controller'
import { logoutController } from '../controller/auth/logout.controller'
import { refreshTokenController } from '../controller/auth/refresh-token.controller'
import { registrationController } from '../controller/auth/registration.controller'
import { sentOtpController } from '../controller/auth/sent-otp.controller'
import { forgotPasswordSchema } from '../validation/auth/forgot-password.schema'
import { putGuestUserSchema } from '../validation/auth/guest-user.schema'
import { loginSchema } from '../validation/auth/login.schema'
import { logoutSchema } from '../validation/auth/logout.schema'
import { refreshTokenSchema } from '../validation/auth/refresh-token.schema'
import { registrationSchema } from '../validation/auth/registration.schema'
import { sentOtpReqSchema } from '../validation/auth/sent-otp.schema'

const route = Router()

/**
 * For sending otp for registration and forgot-password
 */
route.post('/send-otp', validation(sentOtpReqSchema), sentOtpController)

/**
 * For verifying otp and creating new user
 */
route.post(
  '/registration',
  validation(registrationSchema),
  registrationController,
)

/**
 * For verifying otp and updating password
 */
route.patch(
  '/forgot-password',
  validation(forgotPasswordSchema),
  forgotPasswordController,
)

/**
 * For login for all roles
 */
route.post('/login', validation(loginSchema), loginController)

/**
 * For Logout for all roles
 */
route.post(
  '/logout',
  validation(logoutSchema),
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET),
  logoutController,
)

/**
 * For updating refresh-token as well as access-token
 */
route.post(
  '/refresh-token',
  validation(refreshTokenSchema),
  verifyJWTHS512Middleware(env.JWT_HS512_REFRESH_SECRET),
  refreshTokenController,
)

/**
 * Guest user registration
 */
route.put(
  '/guest-user',
  verifyJWTHS512Middleware(env.JWT_HS512_ACCESS_SECRET, undefined, false),
  validation(putGuestUserSchema),
  guestUserController,
)

export const authRoute = route
