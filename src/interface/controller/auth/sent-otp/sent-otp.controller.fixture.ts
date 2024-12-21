export const mockRequestFixture = {
  body: {
    /**
     *
     * @type {string}
     * @memberof SentOtpPostReq
     */
    email: 'string',
    /**
     *
     * @type {string}
     * @memberof SentOtpPostReq
     */
    otp: '12345',
    /**
     *
     * @type {string}
     * @memberof SentOtpPostReq
     */
    device_id: 'string',
  },
}

export const mockResponseFixture = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  locals: { user: { id: 'user123' } },
}

export const mockTransactionFixture = jest.fn()

export const mockErrorFixture = new Error('Test error')
