export const mockRequestFixture = {
  body: {
    email: 'test@example.com',
    password: 'newPassword',
    otp: '123456',
    device_id: 'device123',
  },
}

export const mockResponseFixture = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
}

export const mockTransactionFixture = jest.fn()

export const mockErrorFixture = new Error('Test error')
