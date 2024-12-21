export const mockRequestFixture = {
  body: {
    email: 'guest@example.com',
    name: 'Guest User',
    device_id: 'device123',
  },
}

export const mockResponseFixture = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  locals: {},
}

export const mockTransactionFixture = jest.fn()

export const mockErrorFixture = new Error('Test error')
