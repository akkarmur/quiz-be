import { randomNameGenerator } from './random-name'

describe('randomNameGenerator', () => {
  it('should generate a random string of the specified length', () => {
    const length = 10
    const result = randomNameGenerator(length)

    // Assert that the result is a string of the correct length
    expect(result).toHaveLength(length)

    // Assert that the result only contains valid characters
    const validCharacters = /^[A-Za-z0-9]+$/
    expect(result).toMatch(validCharacters)
  })

  it('should generate an empty string when length is 0', () => {
    const length = 0
    const result = randomNameGenerator(length)

    expect(result).toBe('')
  })

  it('should generate different strings on multiple calls', () => {
    const length = 10
    const result1 = randomNameGenerator(length)
    const result2 = randomNameGenerator(length)

    // Assert that the two results are not the same
    expect(result1).not.toBe(result2)
  })

  it('should handle large lengths without errors', () => {
    const length = 1000
    const result = randomNameGenerator(length)

    // Assert that the result is a string of the correct length
    expect(result).toHaveLength(length)

    // Assert that the result only contains valid characters
    const validCharacters = /^[A-Za-z0-9]+$/
    expect(result).toMatch(validCharacters)
  })

  it('should call Math.random the correct number of times', () => {
    const length = 5
    const randomSpy = jest.spyOn(Math, 'random')

    randomNameGenerator(length)

    expect(randomSpy).toHaveBeenCalledTimes(length)

    randomSpy.mockRestore()
  })
})
