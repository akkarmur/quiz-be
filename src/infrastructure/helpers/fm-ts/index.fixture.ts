export const arrayFixtures = {
  nullValue: null,
  undefinedValue: undefined,
  emptyArray: [] as any[],
  nonEmptyArray: [1, 2, 3],
  nonArrayInputs: {
    number: 123 as any,
    string: 'string' as any,
    object: {} as any,
  },
}

export const objectFixtures = {
  nullValue: null,
  undefinedValue: undefined,
  emptyObject: {} as Record<string, any>,
  nonEmptyObject: { key: 'value' },
  nonObjectInputs: {
    number: 123,
    string: 'string',
  },
}
