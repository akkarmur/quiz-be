export const mockRequestFixture = {
  body: {
    email: 'user@example.com',
    password: 'securePassword123',
  },
}

export const mockResponseFixture = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
}

export const mockTransactionFixture = jest.fn()

export const mockErrorFixture = new Error('Test error')
