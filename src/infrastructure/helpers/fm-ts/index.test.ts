import * as O from 'fp-ts/Option'
import { optionFormatForArray, optionFormatForObject } from '.'
import { arrayFixtures, objectFixtures } from './index.fixture'

describe('optionFormatForArray', () => {
  it('should return None for null', () => {
    expect(optionFormatForArray(arrayFixtures.nullValue)).toEqual(O.none)
  })

  it('should return None for undefined', () => {
    expect(optionFormatForArray(arrayFixtures.undefinedValue)).toEqual(O.none)
  })

  it('should return None for an empty array', () => {
    expect(optionFormatForArray(arrayFixtures.emptyArray)).toEqual(O.none)
  })

  it('should return Some for a non-empty array', () => {
    expect(optionFormatForArray(arrayFixtures.nonEmptyArray)).toEqual(
      O.some(arrayFixtures.nonEmptyArray),
    )
  })

  it('should return None for non-array input', () => {
    expect(
      optionFormatForArray(arrayFixtures.nonArrayInputs.number as unknown[]),
    ).toEqual(O.none)
    expect(
      optionFormatForArray(arrayFixtures.nonArrayInputs.string as unknown[]),
    ).toEqual(O.none)
    expect(
      optionFormatForArray(arrayFixtures.nonArrayInputs.object as unknown[]),
    ).toEqual(O.none)
  })
})

describe('optionFormatForObject', () => {
  it('should return None for null', () => {
    expect(optionFormatForObject(objectFixtures.nullValue)).toEqual(O.none)
  })

  it('should return None for undefined', () => {
    expect(optionFormatForObject(objectFixtures.undefinedValue)).toEqual(O.none)
  })

  it('should return None for an empty object', () => {
    expect(optionFormatForObject(objectFixtures.emptyObject)).toEqual(O.none)
  })

  it('should return Some for a non-empty object', () => {
    expect(optionFormatForObject(objectFixtures.nonEmptyObject)).toEqual(
      O.some(objectFixtures.nonEmptyObject),
    )
  })

  it('should return None for non-object input', () => {
    expect(
      optionFormatForObject(objectFixtures.nonObjectInputs.number),
    ).toEqual(O.none)
    expect(
      optionFormatForObject(objectFixtures.nonObjectInputs.string),
    ).toEqual(O.none)
  })
})
