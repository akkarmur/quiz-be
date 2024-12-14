import { randomNumber } from './random-number'

describe('randomNumber', () => {
  it('should generate a random number with the specified number of digits', () => {
    const digit = 6
    const result = randomNumber(digit)

    // Assert that the result is a string of the correct length
    expect(result).toHaveLength(digit)

    // Assert that the result is numeric
    expect(Number(result)).not.toBeNaN()

    // Assert that the result does not exceed the maximum value for the number of digits
    const maxValue = Math.pow(10, digit)
    expect(Number(result)).toBeLessThan(maxValue)
  })

  it('should handle single-digit numbers correctly', () => {
    const digit = 1
    const result = randomNumber(digit)

    // Assert that the result is a single digit
    expect(result).toHaveLength(digit)
    expect(Number(result)).toBeGreaterThanOrEqual(0)
    expect(Number(result)).toBeLessThan(10)
  })

  it('should generate numbers with leading zeros when necessary', () => {
    const digit = 4

    // Run the function multiple times to test leading zeros
    for (let i = 0; i < 10; i++) {
      const result = randomNumber(digit)
      expect(result).toHaveLength(digit)
      expect(result).toMatch(/^[0-9]{4}$/) // Ensure it's a 4-digit number
    }
  })

  it('should return "0" for digit = 1 if Math.random produces 0', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0)

    const result = randomNumber(1)

    expect(result).toBe('0')

    jest.spyOn(Math, 'random').mockRestore()
  })
})
