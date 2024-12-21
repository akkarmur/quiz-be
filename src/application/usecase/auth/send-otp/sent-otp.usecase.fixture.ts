import { SentOtpPostReqOtp } from '../../../../domain/entities/auth/sent-otp.interface'
const sendOtpFixture: {
  input: SentOtpPostReqOtp
  otp: string
} = {
  input: {
    email: 'test@example.com',
    otp: '',
    device_id: 'device123',
  },
  otp: '123456',
}

export default sendOtpFixture
