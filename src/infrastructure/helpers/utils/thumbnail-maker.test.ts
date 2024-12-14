import imageFunction from 'image-thumbnail'
import { CONSTANTS } from '../../configs/constants/constants'
import { thumbnailMaker } from './thumbnail-maker'

jest.mock('image-thumbnail', () => jest.fn())

describe('thumbnailMaker', () => {
  const mockBuffer = Buffer.from('mockImageBuffer')
  const mockFile = {
    buffer: Buffer.from('mockFileBuffer'),
  } as Express.Multer.File
  const mockThumbnailBuffer = Buffer.from('mockThumbnailBuffer')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should generate a thumbnail from a Buffer input', async () => {
    ;(imageFunction as jest.Mock).mockResolvedValue(mockThumbnailBuffer)

    const result = await thumbnailMaker(mockBuffer)

    expect(imageFunction).toHaveBeenCalledWith(mockBuffer, {
      responseType: 'buffer',
      width: CONSTANTS.DEFAULT_VALUES.THUMBNAIL_SIZE.width,
      height: CONSTANTS.DEFAULT_VALUES.THUMBNAIL_SIZE.height,
    })
    expect(result).toBe(mockThumbnailBuffer)
  })

  it('should generate a thumbnail from an Express.Multer.File input', async () => {
    ;(imageFunction as jest.Mock).mockResolvedValue(mockThumbnailBuffer)

    const result = await thumbnailMaker(mockFile)

    expect(imageFunction).toHaveBeenCalledWith(mockFile.buffer, {
      responseType: 'buffer',
      width: CONSTANTS.DEFAULT_VALUES.THUMBNAIL_SIZE.width,
      height: CONSTANTS.DEFAULT_VALUES.THUMBNAIL_SIZE.height,
    })
    expect(result).toBe(mockThumbnailBuffer)
  })

  it('should throw an error if imageFunction fails', async () => {
    const mockError = new Error('Thumbnail generation failed')
    ;(imageFunction as jest.Mock).mockRejectedValue(mockError)

    await expect(thumbnailMaker(mockBuffer)).rejects.toThrow(
      'Thumbnail generation failed',
    )
  })
})
