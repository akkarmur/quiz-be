import transporter from '.'
import { sendOtpMail } from './send-otp'
import { mockConstants, mockEmailData } from './send-otp.fixture'

jest.mock('./index', () => ({
  sendMail: jest.fn(),
}))

describe('sendOtpMail', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.mock('../../configs/constants/constants', () => ({
      CONSTANTS: mockConstants,
    }))
  })

  it('should send an email with the correct mail options', async () => {
    const { email, otp, mailOptions } = mockEmailData

    const mockSendMail = transporter.sendMail as jest.Mock // Explicitly cast as Jest mock

    await sendOtpMail(email, otp)

    expect(mockSendMail).toHaveBeenCalledWith(mailOptions)
  })

  it('should throw an error if sendMail fails', async () => {
    const { email, otp } = mockEmailData

    const mockSendMail = transporter.sendMail as jest.Mock // Explicitly cast as Jest mock
    mockSendMail.mockRejectedValueOnce(new Error('SMTP Error'))

    await expect(sendOtpMail(email, otp)).rejects.toThrow('SMTP Error')
  })
})
