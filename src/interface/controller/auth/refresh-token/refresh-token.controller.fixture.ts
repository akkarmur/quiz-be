export const mockRequestFixture = {
  body: {
    device_id: 'device123',
  },
  headers: {
    authorization: 'Bearer mockedToken',
  },
}

export const mockResponseFixture = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  locals: { user: { id: 'user123' } },
}

export const mockTransactionFixture = jest.fn()

export const mockErrorFixture = new Error('Test error')
