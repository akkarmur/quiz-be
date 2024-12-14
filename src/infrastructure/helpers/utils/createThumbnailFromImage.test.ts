import { getImageData, uploadImage } from '../fs'
import { createThumbnailFromExistingImage } from './createThumbnailFromImage'
import { thumbnailMaker } from './thumbnail-maker'

jest.mock('../fs', () => ({
  getImageData: jest.fn(),
  uploadImage: jest.fn(),
}))

jest.mock('./thumbnail-maker', () => ({
  thumbnailMaker: jest.fn(),
}))

describe('createThumbnailFromExistingImage', () => {
  const mockImgUrl = 'baseFolder/image.jpg'
  const mockBaseFolder = 'baseFolder'
  const mockThumbnailFolder = 'thumbnailFolder'
  const mockImageData = Buffer.from('mockImageData')
  const mockThumbnailBuffer = Buffer.from('mockThumbnailBuffer')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return undefined if getImageData returns null or undefined', async () => {
    ;(getImageData as jest.Mock).mockResolvedValue(null)

    const result = await createThumbnailFromExistingImage(
      mockImgUrl,
      mockBaseFolder,
      mockThumbnailFolder,
    )

    expect(getImageData).toHaveBeenCalledWith(mockImgUrl)
    expect(result).toBeUndefined()
  })

  it('should generate a thumbnail and return its name', async () => {
    ;(getImageData as jest.Mock).mockResolvedValue(mockImageData)
    ;(thumbnailMaker as jest.Mock).mockResolvedValue(mockThumbnailBuffer)

    const expectedThumbnailName = 'thumbnailFolder/image_thumbnail.jpg'

    const result = await createThumbnailFromExistingImage(
      mockImgUrl,
      mockBaseFolder,
      mockThumbnailFolder,
    )

    expect(getImageData).toHaveBeenCalledWith(mockImgUrl)
    expect(thumbnailMaker).toHaveBeenCalledWith(mockImageData)
    expect(uploadImage).toHaveBeenCalledWith(
      mockThumbnailBuffer,
      mockThumbnailFolder,
      undefined,
      expectedThumbnailName,
    )
    expect(result).toBe(expectedThumbnailName)
  })
})
