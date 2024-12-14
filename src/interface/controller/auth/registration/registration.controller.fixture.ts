export const mockRequestFixture = {
  body: {
    email: 'test@example.com',
    password: 'password123',
    device_id: 'device123',
  },
}

export const mockResponseFixture = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  locals: { user: { id: 'user123' } },
}

export const mockTransactionFixture = jest.fn()

export const mockErrorFixture = new Error('Test error')
