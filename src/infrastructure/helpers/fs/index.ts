import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

import { env } from '../../env'
import { randomNameGenerator } from '../utils/random-name'
import { thumbnailMaker } from '../utils/thumbnail-maker'

/**
 * Uploads an image to local storage.
 *
 * @param {Express.Multer.File | Buffer} file - The image file to be uploaded.
 * @param {string} imageFolder - The folder where the image will be stored.
 * @param {string} [thumbnailFolder] - The optional folder for storing thumbnails.
 * @param {string} [name] - The optional name for the uploaded image.
 * @returns {Promise<{ fileName: string, thumbnailName: string }>} - A Promise resolving to an object containing the file name and thumbnail name of the uploaded image.
 */
export const uploadImage = async (
  file: Express.Multer.File | Buffer,
  imageFolder: string,
  thumbnailFolder?: string,
  name?: string,
): Promise<{ fileName: string; thumbnailName: string }> => {
  let fileName = ''
  let thumbnailName = ''
  let buffer: Buffer | undefined

  if (!(file instanceof Buffer) && 'originalname' in file) {
    // Handle Express.Multer.File
    const { originalname } = file
    fileName = `${imageFolder}/${randomNameGenerator(32)}.${
      originalname.split('.')[1]
    }`
    buffer = file.buffer
  } else if (file instanceof Buffer) {
    // Handle raw Buffer
    if (name) {
      fileName = name
      buffer = file
    }
  }

  if (thumbnailFolder) {
    // Generate thumbnail
    const splittedFileName = fileName.split('.')
    thumbnailName =
      splittedFileName[0].replace(imageFolder, thumbnailFolder) +
      '_thumbnail.' +
      splittedFileName[1]
    const fileBuffer = await thumbnailMaker(file)
    const thumbnailFullName = env.IMG_BASE_PATH + thumbnailName
    await ensureDirectoryExists(path.dirname(thumbnailFullName))
    await fs.writeFile(thumbnailFullName, Buffer.from(fileBuffer))
  }

  if (buffer) {
    const fileFullName = env.IMG_BASE_PATH + fileName
    await ensureDirectoryExists(path.dirname(fileFullName))
    await fs.writeFile(fileFullName, Buffer.from(buffer))
  }

  return { fileName, thumbnailName }
}

/**
 * Removes an image from folder.
 *
 * @param {string} fileName - The name of the file to be removed.
 *
 * This function is used to remove an image from the local folder.
 * It takes in the name of the file to be removed as a parameter.
 *
 * The function first constructs the full path of the file to be removed
 * by concatenating the base path of the image folder and the file name.
 *
 * Then, it checks if the file exists using the fs.existsSync() method.
 * If the file exists, it uses the fs.unlink() method to delete the file.
 */
export const removeImage = async (fileName: string) => {
  /**
   * Construct the full path of the file to be removed.
   */
  const finalFileName = env.IMG_BASE_PATH + fileName

  /**
   * Check if the file exists.
   */
  if (existsSync(finalFileName)) {
    /**
     * If the file exists, delete it.
     */
    await fs.unlink(finalFileName)
  }
}

/**
 * Retrieves the specified image from the local device.
 *
 * @param {string} fileName - The name of the file to be retrieved.
 * @returns {Promise<Buffer | undefined>} - The contents of the file as a Buffer if the file is found, undefined if the file is not found.
 */
export const getImageData = async (
  fileName: string,
): Promise<Buffer | undefined> => {
  /**
   * Construct the full path of the file to be retrieved.
   */
  const finalFileName = env.IMG_BASE_PATH + fileName

  /**
   * Check if the file exists.
   */
  try {
    /**
     * If the file exists, read it using the fs.readFile() method.
     * The fs.readFile() method returns a Promise that resolves to a Buffer that contains the contents of the file.
     */
    await fs.access(finalFileName)
    return fs.readFile(finalFileName)
  } catch (e) {
    /**
     * If the file does not exist, return undefined.
     */
    return undefined
  }
}

/**
 * Ensures that a directory exists, creates it if not.
 *
 * This function takes in a directory path as a parameter and checks if the directory exists.
 * If the directory does not exist, it creates it using the fs.mkdir() method.
 * If the directory does exist, it does nothing.
 *
 * The function is marked as async because the fs.access() method and the fs.mkdir() method
 * return Promises, and we need to wait for these Promises to resolve before returning from the function.
 *
 * @param {string} directory - The directory path.
 * @returns {Promise<void>}
 */
const ensureDirectoryExists = async (directory: string) => {
  try {
    // Check if the directory exists.
    // If the directory does not exist, the fs.access() method will throw an exception.
    await fs.access(directory)
  } catch (error) {
    // If the directory does not exist, create it using the fs.mkdir() method.
    // The { recursive: true } option will create all the parent directories if they do not exist.
    await fs.mkdir(directory, { recursive: true })
  }
}
