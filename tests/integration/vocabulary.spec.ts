import request from 'supertest'
import Vocabulary from '../../src/infrastructure/orm/sequelize/entities/t_vocabulary'
import VocabularyGroup from '../../src/infrastructure/orm/sequelize/entities/t_vocabulary_group'
import { createServer } from '../../src/infrastructure/webserver/express/index'

describe('Vocabulary API Integration Tests', () => {
  let app: any
  let token: string
  let vocabGroupId: number
  let vocabId: number

  beforeAll(async () => {
    app = createServer()

    // Assume login endpoint returns a token
    const loginResponse = await request(app).post('/v1/auth/login').send({
      email: 'test@yopmail.com',
      password: 'password123',
      device_id: 'ROG123',
      os: 'android',
    })

    token = loginResponse.body.data.access_token
  })

  describe('Vocabulary Group API', () => {
    beforeAll(async () => {
      const group = await VocabularyGroup.findOne({
        where: { name: 'Greetings' },
      })
      if (group) {
        await Vocabulary.destroy({ where: { vocab_group_id: group.id } })
        await VocabularyGroup.destroy({ where: { name: 'Greetings' } })
      }
    })
    it('should create a vocabulary group', async () => {
      const response = await request(app)
        .post('/v1/vocabulary-group')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Greetings',
          description: 'Group for greeting vocabulary',
        })

      expect(response.status).toBe(201)
      vocabGroupId =
        (await VocabularyGroup.findOne({
          where: { name: 'Greetings' },
          attributes: ['id'],
          order: [['id', 'DESC']],
        }).then((res) => res?.id)) || 0
    })

    it('should retrieve the vocabulary group', async () => {
      const response = await request(app)
        .get('/v1/vocabulary-group')
        .set('Authorization', `Bearer ${token}`)
        .query({ id: vocabGroupId })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty('totalCount')
    })

    it('should update the vocabulary group', async () => {
      const response = await request(app)
        .patch('/v1/vocabulary-group')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: vocabGroupId,
          name: 'Greetings',
        })

      expect(response.status).toBe(200)
    })
  })

  describe('Vocabulary API', () => {
    it('should create a vocabulary', async () => {
      const response = await request(app)
        .post('/v1/vocabulary')
        .set('Authorization', `Bearer ${token}`)
        .send({
          vocab_group_id: vocabGroupId,
          data: [
            {
              word: 'こんにちは',
              language: 'Japanese',
              note_word: '今日は',
              meaning: 'Hello',
              pronunciation: 'Kon-ni-chi-wa',
              note_meaning: 'Used to greet people during the day',
              level: 1,
              type: 'noun',
            },
          ],
        })

      expect(response.status).toBe(201)
      vocabId =
        (await Vocabulary.findOne({
          where: { word: 'こんにちは' },
          attributes: ['id'],
          order: [['id', 'DESC']],
        }).then((res) => res?.id)) || 0
    })

    it('should retrieve the vocabulary', async () => {
      const response = await request(app)
        .get('/v1/vocabulary')
        .set('Authorization', `Bearer ${token}`)
        .query({ id: vocabId })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty('totalCount')
    })

    it('should update the vocabulary', async () => {
      const response = await request(app)
        .patch('/v1/vocabulary')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: vocabId,
          word: 'こんにちは',
          meaning: 'Good Morning 1',
        })

      expect(response.status).toBe(200)
    })

    it('should delete the vocabulary', async () => {
      const response = await request(app)
        .delete('/v1/vocabulary')
        .set('Authorization', `Bearer ${token}`)
        .query({ id: vocabId })

      expect(response.status).toBe(200)
    })
  })
  it('should delete the vocabulary group', async () => {
    const response = await request(app)
      .delete('/v1/vocabulary-group')
      .set('Authorization', `Bearer ${token}`)
      .query({ id: vocabGroupId })

    expect(response.status).toBe(200)
  })
})
