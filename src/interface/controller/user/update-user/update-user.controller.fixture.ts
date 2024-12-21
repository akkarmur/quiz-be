import { Readable } from 'stream'

export const mockRequestFixture = {
  body: {
    name: 'Updated User',
  },
  file: {
    fieldname: 'profile_image',
    originalname: 'image.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: Buffer.from('test image data'),
    size: 1024,
    stream: new Readable(), // Mock a readable stream
    destination: 'uploads/',
    filename: 'mock_image.png',
    path: 'uploads/mock_image.png',
  },
}

export const mockResponseFixture = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  locals: { user: { id: 1 } },
}

export const mockTransactionFixture = jest.fn()

export const mockErrorFixture = new Error('Test error')
