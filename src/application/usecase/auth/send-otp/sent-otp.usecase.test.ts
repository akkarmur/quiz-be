import * as E from 'fp-ts/Either'
import { Transaction } from 'sequelize'
import { SentOtpPostReqOtp } from '../../../../domain/entities/auth/sent-otp.interface'
import { sendOtpMail } from '../../../../infrastructure/helpers/mailer/send-otp'
import { randomNumber } from '../../../../infrastructure/helpers/utils/random-number'
import { mockAuthRepo } from '../../../../infrastructure/orm/repositories/mysql-repositories/auth/auth-repo.fixture'
import { sentOtpUseCase } from './sent-otp.usecase'
import fixture from './sent-otp.usecase.fixture'

const input: SentOtpPostReqOtp = fixture.input
const otp: string = fixture.otp

jest.mock('../../../../infrastructure/helpers/mailer/send-otp')
jest.mock('../../../../infrastructure/helpers/utils/random-number')

describe('Sent Otp Use Case', () => {
  let mockTransaction: Transaction

  beforeEach(() => {
    jest.clearAllMocks()
    mockTransaction = {} as Transaction
  })

  it('should successfully generate, save, and send OTP', async () => {
    // Mock random number generation
    ;(randomNumber as jest.Mock).mockReturnValue(otp)

    // Mock repository methods
    ;(mockAuthRepo.deleteOtp as jest.Mock).mockResolvedValue(undefined)
    ;(mockAuthRepo.insertOtp as jest.Mock).mockResolvedValue(undefined)

    // Mock email sending
    ;(sendOtpMail as jest.Mock).mockResolvedValue(undefined)

    const result = await sentOtpUseCase(input, mockAuthRepo, mockTransaction)

    // Assertions
    expect(E.isRight(result)).toBe(true)
    expect(mockAuthRepo.deleteOtp).toHaveBeenCalledWith(input, mockTransaction)
    expect(mockAuthRepo.insertOtp).toHaveBeenCalledWith(
      { ...input, otp: otp },
      mockTransaction,
    )
    expect(sendOtpMail).toHaveBeenCalledWith(input.email, otp)
  })
})
