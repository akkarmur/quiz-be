import { createTransport } from 'nodemailer'
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}))

jest.mock('../../env', () => ({
  env: {
    SMTP_HOST: 'mock.smtp.host',
    SMTP_PORT: 587,
    SMTP_EMAIL: 'mock_email@example.com',
    SMTP_PASSWORD: 'mock_password',
  },
}))

describe('Nodemailer Transporter', () => {
  it('should configure the transporter with the correct settings', () => {
    // Arrange
    const mockCreateTransport = createTransport

    const mockTransporterConfig = {
      host: 'mock.smtp.host',
      port: 587,
      secure: true,
      auth: {
        user: 'mock_email@example.com',
        pass: 'mock_password',
      },
    }

    // Act
    require('./index')

    // Assert
    expect(mockCreateTransport).toHaveBeenCalledWith(mockTransporterConfig)
  })
})
