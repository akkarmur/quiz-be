import { convertToMd5 } from './md5.hash'
import { mockData } from './md5.hash.fixture'

describe('convertToMd5', () => {
  it('should return the correct MD5 hash for a given string', () => {
    // Arrange
    const { input, expectedHash } = mockData.testString

    // Act
    const result = convertToMd5(input)

    // Assert
    expect(result).toBe(expectedHash)
  })

  it('should return different hashes for different inputs', () => {
    // Arrange
    const { input1, input2 } = mockData.differentInputs

    // Act
    const hash1 = convertToMd5(input1)
    const hash2 = convertToMd5(input2)

    // Assert
    expect(hash1).not.toBe(hash2)
  })

  it('should handle empty strings correctly', () => {
    // Arrange
    const { input, expectedHash } = mockData.emptyString

    // Act
    const result = convertToMd5(input)

    // Assert
    expect(result).toBe(expectedHash)
  })
})
