import { getImageData, uploadImage } from '../fs'
import { thumbnailMaker } from './thumbnail-maker'

/**
 * Creates a thumbnail from an existing image.
 *
 * @param {string} imgUrl - The URL of the image to create a thumbnail from.
 * @param {string} baseFolder - The base folder of the image.
 * @param {string} thumbnailFolder - The folder to store the thumbnail in.
 *
 * @returns {Promise<string | undefined>} - A promise that resolves to the name of the thumbnail if successful, or undefined if the image data is not found.
 */
export const createThumbnailFromExistingImage = async (
  imgUrl: string,
  baseFolder: string,
  thumbnailFolder: string,
): Promise<string | undefined> => {
  const imageData = await getImageData(imgUrl)
  if (!imageData) {
    return undefined
  }
  const thumbnailBuffer = await thumbnailMaker(imageData)
  const splittedFileName = imgUrl.split('.')
  const thumbnailName =
    splittedFileName[0].replace(baseFolder, thumbnailFolder) +
    '_thumbnail.' +
    splittedFileName[1]

  uploadImage(thumbnailBuffer, thumbnailFolder, undefined, thumbnailName)
  return thumbnailName
}
