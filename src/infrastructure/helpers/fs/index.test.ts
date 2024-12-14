import { existsSync } from 'fs'
import fs from 'fs/promises'
import { getImageData, removeImage, uploadImage } from '.'
import { randomNameGenerator } from '../utils/random-name'
import { mockBuffer, mockFile, mockName } from './index.fixture'

jest.mock('fs/promises')
jest.mock('fs', () => ({
  existsSync: jest.fn(),
}))
jest.mock('path')
jest.mock('../../env', () => ({
  env: {
    IMG_BASE_PATH: '/mock/base/path/',
  },
}))
jest.mock('../utils/random-name', () => ({
  randomNameGenerator: jest.fn(() => 'random-file-name'),
}))
jest.mock('../utils/thumbnail-maker', () => ({
  thumbnailMaker: jest.fn(async (file) => Buffer.from('thumbnail-buffer')),
}))

describe('uploadImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should upload an image and create a thumbnail if provided', async () => {
    ;(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined)
    ;(fs.mkdir as jest.Mock).mockResolvedValueOnce(undefined)
    ;(fs.access as jest.Mock).mockRejectedValueOnce(
      new Error('Directory not found'),
    )

    const result = await uploadImage(mockFile, 'images', 'thumbnails')

    expect(randomNameGenerator).toHaveBeenCalledWith(32)
    expect(fs.writeFile).toHaveBeenCalledTimes(2)
    expect(result).toEqual({
      fileName: 'images/random-file-name.jpg',
      thumbnailName: 'thumbnails/random-file-name_thumbnail.jpg',
    })
  })

  it('should upload a raw buffer without creating a thumbnail', async () => {
    ;(fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined)
    ;(fs.mkdir as jest.Mock).mockResolvedValueOnce(undefined)
    ;(fs.access as jest.Mock).mockRejectedValueOnce(
      new Error('Directory not found'),
    )

    const result = await uploadImage(mockBuffer, 'images', undefined, mockName)

    expect(fs.writeFile).toHaveBeenCalledWith(
      '/mock/base/path/custom-file-name.jpg',
      expect.any(Buffer),
    )
    expect(result).toEqual({
      fileName: 'custom-file-name.jpg',
      thumbnailName: '',
    })
  })
})

describe('removeImage', () => {
  it('should remove the image if it exists', async () => {
    ;(existsSync as jest.Mock).mockReturnValueOnce(true)
    ;(fs.unlink as jest.Mock).mockResolvedValueOnce(undefined)

    await removeImage('test-file.jpg')

    expect(existsSync).toHaveBeenCalledWith('/mock/base/path/test-file.jpg')
    expect(fs.unlink).toHaveBeenCalledWith('/mock/base/path/test-file.jpg')
  })

  it('should do nothing if the file does not exist', async () => {
    ;(existsSync as jest.Mock).mockReturnValueOnce(false)
    ;(fs.unlink as jest.Mock).mockReset() // Ensure no prior calls affect the test

    await removeImage('non-existent-file.jpg')

    expect(existsSync).toHaveBeenCalledWith(
      '/mock/base/path/non-existent-file.jpg',
    )
    expect(fs.unlink).not.toHaveBeenCalled()
  })
})

describe('getImageData', () => {
  it('should return the file buffer if the file exists', async () => {
    ;(fs.access as jest.Mock).mockResolvedValueOnce(undefined)
    ;(fs.readFile as jest.Mock).mockResolvedValueOnce(Buffer.from('file-data'))

    const result = await getImageData('existing-file.jpg')

    expect(fs.access).toHaveBeenCalledWith('/mock/base/path/existing-file.jpg')
    expect(fs.readFile).toHaveBeenCalledWith(
      '/mock/base/path/existing-file.jpg',
    )
    expect(result).toEqual(Buffer.from('file-data'))
  })

  it('should return undefined if the file does not exist', async () => {
    ;(fs.access as jest.Mock).mockRejectedValueOnce(new Error('File not found'))

    const result = await getImageData('non-existent-file.jpg')

    expect(fs.access).toHaveBeenCalledWith(
      '/mock/base/path/non-existent-file.jpg',
    )
    expect(result).toBeUndefined()
  })
})
