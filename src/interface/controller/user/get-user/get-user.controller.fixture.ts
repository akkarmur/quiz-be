import { USER_ROLES } from '../../../../infrastructure/configs/constants/enums'

export const mockRequestFixture = {
  query: {
    get_all: 'true',
    limit: '10',
    offset: '0',
    id: '1',
  },
}

export const mockResponseFixture = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  locals: {
    user: {
      id: 1,
      role: USER_ROLES.ADMIN, // Change role as needed for specific test cases
    },
  },
}

export const mockUserUseCaseResponse = {
  totalCount: 2,
  data: [
    {
      id: 1,
      name: 'John Doe',
      role: USER_ROLES.USER,
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: USER_ROLES.ADMIN,
    },
  ],
}

export const mockErrorFixture = new Error('Test error')
