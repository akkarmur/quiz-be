import { getImageData, uploadImage } from '../fs'
import { thumbnailMaker } from './thumbnail-maker'

export const createThumbnailFromExistingImage = async (
  imgUrl: string,
  baseFolder: string,
  thumbnailFolder: string,
) => {
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
