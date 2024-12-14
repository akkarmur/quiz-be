import { convertToPagination, parseOrder } from './pagination'

describe('parseOrder', () => {
  it('should parse a single string order into an array', () => {
    const result = parseOrder('name | desc')
    expect(result).toEqual([{ field: 'name', direction: 'desc' }])
  })

  it('should default direction to asc if not provided', () => {
    const result = parseOrder('name')
    expect(result).toEqual([{ field: 'name', direction: 'asc' }])
  })

  it('should parse an array of orders into an array of objects', () => {
    const result = parseOrder(['name | desc', 'age | asc'])
    expect(result).toEqual([
      { field: 'name', direction: 'desc' },
      { field: 'age', direction: 'asc' },
    ])
  })
})

describe('convertToPagination', () => {
  it('should convert data to pagination object with fields and order', () => {
    const data = {
      name: 'John | like',
      age: 30,
      order: 'name | asc',
      limit: '10',
      offset: '0',
    }

    const result = convertToPagination(data)

    expect(result).toEqual({
      fields: [
        { name: 'name', value: 'John', operation: 'like' },
        { name: 'age', value: 30, operation: 'equals' },
      ],
      order: [{ field: 'name', direction: 'asc' }],
      limit: 10,
      offset: 0,
    })
  })

  it('should handle array fields properly', () => {
    const data = {
      tags: ['tag1 | equals', 'tag2 | like'],
      order: 'tags | desc',
    }

    const result = convertToPagination(data)

    expect(result).toEqual({
      fields: [
        { name: 'tags', value: 'tag1', operation: 'equals' },
        { name: 'tags', value: 'tag2', operation: 'like' },
      ],
      order: [{ field: 'tags', direction: 'desc' }],
      limit: undefined,
      offset: undefined,
    })
  })

  it('should default missing limit and offset to undefined', () => {
    const data = {
      order: 'name | asc',
    }

    const result = convertToPagination(data)

    expect(result).toEqual({
      fields: [],
      order: [{ field: 'name', direction: 'asc' }],
      limit: undefined,
      offset: undefined,
    })
  })

  it('should return an empty fields array if no fields are provided', () => {
    const data = {
      order: 'name | asc',
      limit: '10',
      offset: '5',
    }

    const result = convertToPagination(data)

    expect(result).toEqual({
      fields: [],
      order: [{ field: 'name', direction: 'asc' }],
      limit: 10,
      offset: 5,
    })
  })

  it('should handle missing order field', () => {
    const data = {
      name: 'John | like',
      limit: '10',
      offset: '0',
    }

    const result = convertToPagination(data)

    expect(result).toEqual({
      fields: [{ name: 'name', value: 'John', operation: 'like' }],
      order: [],
      limit: 10,
      offset: 0,
    })
  })
})
