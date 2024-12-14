import { Pagination } from '../../../../domain/entities/common/pagination'
import { UserGetDB } from '../../../../domain/entities/user/user-get.interface'
import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'

const getUserFixture = {
  paginationInput: {
    fields: [{ name: 'name', value: 'Test', operation: 'like' }],
    limit: 10,
    offset: 0,
    order: [{ field: 'name', direction: 'asc' }],
  } as Pagination,

  userRecords: [
    {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: USER_ROLES.USER,
      is_active: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      name: 'Another User',
      email: 'another@example.com',
      role: USER_ROLES.USER,
      is_active: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ] as UserGetDB[],

  userCount: 2,
}

export default getUserFixture
