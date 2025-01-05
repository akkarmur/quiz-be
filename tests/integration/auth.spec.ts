import request from 'supertest'
import User from '../../src/infrastructure/orm/sequelize/entities/m_user'
import Login from '../../src/infrastructure/orm/sequelize/entities/t_login'
import Otp from '../../src/infrastructure/orm/sequelize/entities/t_otp'
import { createServer } from '../../src/infrastructure/webserver/express/index'

describe('Auth API Integration Tests', () => {
  let app: any

  beforeAll(() => {
    app = createServer()
  })

  describe('POST /v1/auth/send-otp', () => {
    it('should send an OTP successfully', async () => {
      const response = await request(app)
        .post('/v1/auth/send-otp')
        .send({ email: 'test@yopmail.com', device_id: 'ROG123' })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('message', 'OTP Sent Successfully')
    })

    it('should return 400 for invalid parameters', async () => {
      const response = await request(app)
        .post('/v1/auth/send-otp')
        .send({ email: 'invalidemail' })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('message')
    })
  })

  describe('POST /v1/auth/registration', () => {
    beforeAll(async () => {
      const user = await User.findOne({
        where: { email: 'test@yopmail.com' },
      })
      if (user) {
        await Login.destroy({ where: { user_id: user.id }, force: true })
        await User.destroy({
          where: { email: 'test@yopmail.com' },
          force: true,
        })
      }
    })
    it('should return 401 for invalid OTP', async () => {
      const response = await request(app).post('/v1/auth/registration').send({
        email: 'test@yopmail.com',
        name: 'Test User',
        password: 'password123',
        otp: '000000',
        device_id: 'ROG123',
        os: 'android',
        device_token: 'token123',
      })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('message', 'Otp not valid.')
    })

    it('should register a user successfully', async () => {
      const otp = await Otp.findOne({
        where: { email: 'test@yopmail.com' },
        order: [['created_at', 'DESC']],
      })
      const response = await request(app).post('/v1/auth/registration').send({
        email: 'test@yopmail.com',
        name: 'Test User',
        password: 'password123',
        otp: otp?.otp,
        device_id: 'ROG123',
        os: 'android',
        device_token: 'token123',
      })

      expect(response.status).toBe(201)
    })
  })

  describe('POST /v1/auth/login', () => {
    it('should log in a user successfully', async () => {
      const response = await request(app).post('/v1/auth/login').send({
        email: 'test@yopmail.com',
        password: 'password123',
        device_id: 'ROG123',
        os: 'android',
      })

      expect(response.status).toBe(200)
    })

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app).post('/v1/auth/login').send({
        email: 'test@yopmail.com',
        password: 'wrongpassword',
        device_id: 'ROG123',
        os: 'android',
      })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('message', 'Invalid Credentials')
    })
  })
})
