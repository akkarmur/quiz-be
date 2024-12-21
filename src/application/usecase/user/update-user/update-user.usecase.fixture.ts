import { UserGetDB } from '../../../../domain/entities/user/user-get.interface'
import { UserPatchReq } from '../../../../domain/entities/user/user-update.interface'
import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'

const updateUserFixture = {
  validInput: {
    id: 1,
    name: 'Updated User',
    updated_by: 'admin',
  } as UserPatchReq,

  inputWithImage: {
    id: 1,
    name: 'Updated User',
    image: {
      fieldname: 'file',
      originalname: 'profile.png',
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: Buffer.from(''),
      size: 1024,
    } as Express.Multer.File,
    updated_by: 'admin',
  } as UserPatchReq,

  existingUser: {
    id: 1,
    name: 'Existing User',
    email: 'existing@example.com',
    role: USER_ROLES.USER,
    is_active: 1,
    created_at: new Date(),
    updated_at: new Date(),
  } as UserGetDB,

  updatedInput: {
    id: 1,
    name: 'Updated User',
    profile_image: 'uploaded/profile.png',
    updated_by: 'admin',
  } as UserPatchReq,
}

export default updateUserFixture
