export const mockFile: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'image.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1024,
  stream: null as any,
  destination: '',
  filename: '',
  path: '',
  buffer: Buffer.from('file-buffer'),
}

export const mockBuffer = Buffer.from('raw-buffer')
export const mockName = 'custom-file-name.jpg'
