import { Op } from 'sequelize'
import { mysqlCommonRepo } from './common.repo'
import { mockOrderFields, mockPaginationFields } from './common.repo.fixture'

describe('mysqlCommonRepo', () => {
  describe('convertOrder', () => {
    it('should convert order fields to the correct SQL format', () => {
      const result = mysqlCommonRepo.convertOrder(mockOrderFields)
      expect(result).toEqual([
        ['name', 'asc'],
        ['created_at', 'desc'],
      ])
    })

    it('should return undefined when no order fields are provided', () => {
      const result = mysqlCommonRepo.convertOrder()
      expect(result).toBeUndefined()
    })
  })

  describe('whereCondition', () => {
    it('should create a where condition for pagination fields', () => {
      const result = mysqlCommonRepo.whereCondition(mockPaginationFields)

      expect(result).toEqual({
        name: { [Op.like]: '%Test%' },
        age: { [Op.gt]: 18 },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle active filter correctly', () => {
      const activeResult = mysqlCommonRepo.whereCondition([], 'active')
      expect(activeResult).toEqual({ is_active: { [Op.eq]: 1 } })

      const inactiveResult = mysqlCommonRepo.whereCondition([], 'inactive')
      expect(inactiveResult).toEqual({ is_active: { [Op.eq]: 0 } })

      const bothResult = mysqlCommonRepo.whereCondition([], 'both')
      expect(bothResult).toEqual({})
    })

    it('should handle various operations correctly', () => {
      const fields = [
        { name: 'salary', value: 50000, operation: 'greater_than' },
        { name: 'department', value: 'HR', operation: 'equals' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)

      expect(result).toEqual({
        salary: { [Op.gt]: 50000 },
        department: { [Op.eq]: 'HR' },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should merge conditions for the same field', () => {
      const fields = [
        { name: 'price', value: 100, operation: 'greater_than' },
        { name: 'price', value: 500, operation: 'less_than' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)

      expect(result).toEqual({
        price: {
          [Op.gt]: 100,
          [Op.lt]: 500,
        },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should default to equals operation for unknown operations', () => {
      const fields = [{ name: 'status', value: 'active', operation: 'unknown' }]
      const result = mysqlCommonRepo.whereCondition(fields)

      expect(result).toEqual({
        status: { [Op.eq]: 'active' },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle not_equals operation correctly', () => {
      const fields = [
        { name: 'status', value: 'inactive', operation: 'not_equals' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        status: { [Op.ne]: 'inactive' },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle greater_than_equals and less_than_equals operations', () => {
      const fields = [
        { name: 'age', value: 18, operation: 'greater_than_equals' },
        { name: 'age', value: 60, operation: 'less_than_equals' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        age: {
          [Op.gte]: 18,
          [Op.lte]: 60,
        },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should merge conditions with Op.or for overlapping fields', () => {
      const fields = [
        { name: 'status', value: 'active', operation: 'equals' },
        { name: 'status', value: 'inactive', operation: 'equals' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        status: {
          [Op.or]: [{ [Op.eq]: 'active' }, { [Op.eq]: 'inactive' }],
        },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle multiple conditions with different operations', () => {
      const fields = [
        { name: 'name', value: 'Admin', operation: 'like' },
        { name: 'status', value: 'active', operation: 'not_equals' },
        { name: 'age', value: 25, operation: 'greater_than' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        name: { [Op.like]: '%Admin%' },
        status: { [Op.ne]: 'active' },
        age: { [Op.gt]: 25 },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should return an empty where object when no fields or active filter is provided', () => {
      const result = mysqlCommonRepo.whereCondition([], 'both')
      expect(result).toEqual({})
    })

    it('should add not_equals condition when multiple values are provided', () => {
      const fields = [
        { name: 'status', value: 'inactive', operation: 'not_equals' },
        { name: 'role', value: 'admin', operation: 'not_equals' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        status: { [Op.ne]: 'inactive' },
        role: { [Op.ne]: 'admin' },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle overlapping like conditions', () => {
      const fields = [
        { name: 'name', value: 'Admin', operation: 'like' },
        { name: 'name', value: 'User', operation: 'like' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        name: {
          [Op.or]: [{ [Op.like]: '%Admin%' }, { [Op.like]: '%User%' }],
        },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle overlapping greater_than conditions', () => {
      const fields = [
        { name: 'price', value: 100, operation: 'greater_than' },
        { name: 'price', value: 200, operation: 'greater_than' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        price: { [Op.gt]: 200 },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle overlapping less_than_equals conditions', () => {
      const fields = [
        { name: 'age', value: 60, operation: 'less_than_equals' },
        { name: 'age', value: 50, operation: 'less_than_equals' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        age: { [Op.lte]: 50 },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle multiple fields with different operations', () => {
      const fields = [
        { name: 'name', value: 'Admin', operation: 'like' },
        { name: 'status', value: 'inactive', operation: 'not_equals' },
        { name: 'age', value: 25, operation: 'greater_than' },
        { name: 'salary', value: 50000, operation: 'less_than_equals' },
      ]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        name: { [Op.like]: '%Admin%' },
        status: { [Op.ne]: 'inactive' },
        age: { [Op.gt]: 25 },
        salary: { [Op.lte]: 50000 },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle a single greater_than condition', () => {
      const fields = [{ name: 'price', value: 150, operation: 'greater_than' }]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        price: { [Op.gt]: 150 },
        is_active: { [Op.eq]: 1 },
      })
    })

    it('should handle a single less_than_equals condition', () => {
      const fields = [{ name: 'age', value: 50, operation: 'less_than_equals' }]
      const result = mysqlCommonRepo.whereCondition(fields)
      expect(result).toEqual({
        age: { [Op.lte]: 50 },
        is_active: { [Op.eq]: 1 },
      })
    })
  })
})
