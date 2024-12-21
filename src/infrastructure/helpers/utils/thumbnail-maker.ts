import imageFunction from 'image-thumbnail'

import { CONSTANTS } from '../../configs/constants/constants'

/**
 * Takes a Buffer or an Express.Multer.File object as an argument and
 * creates a thumbnail from it. The thumbnail's width and height are set
 * to the values of the CONSTANTS.DEFAULT_VALUES.THUMBNAIL_SIZE object.
 *
 * @param {Express.Multer.File | Buffer} file - The file to create a
 * thumbnail from.
 * @returns {Promise<Buffer>} - A Promise resolving to a Buffer
 * containing the thumbnail.
 */
export const thumbnailMaker = async (file: Express.Multer.File | Buffer) => {
  let buffer: Buffer

  if (file instanceof Buffer) {
    // If the argument is a Buffer, just use it as is.
    buffer = file
  } else {
    // If the argument is an Express.Multer.File object, convert its buffer
    // property to a Buffer.
    buffer = Buffer.from(file.buffer)
  }

  // Call imageFunction() with the Buffer and the options object.
  return imageFunction(buffer, {
    // Set the response type to Buffer, so that we get a Buffer back.
    responseType: 'buffer',
    // Set the width and height of the thumbnail to the values specified
    // in the CONSTANTS.DEFAULT_VALUES.THUMBNAIL_SIZE object.
    width: CONSTANTS.DEFAULT_VALUES.THUMBNAIL_SIZE.width,
    height: CONSTANTS.DEFAULT_VALUES.THUMBNAIL_SIZE.height,
  })
}
