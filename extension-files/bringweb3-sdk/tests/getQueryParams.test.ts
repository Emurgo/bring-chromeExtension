import getQueryParams from '../utils/getQueryParams'
import { describe, it, expect } from 'vitest'

describe('getQueryParams', () => {
    it('return params', () => {

        const query = { param1: 'value1', param2: 'value2' }
        const params = getQueryParams({ query })

        expect(params).toEqual('param1=value1&param2=value2')
    })
    it('return empty string', () => {
        const params = getQueryParams({ query: {} })

        expect(params).toEqual('')
    })
    it('adds prefix', () => {
        const query = { param1: 'value1', param2: 'value2' }
        const params = getQueryParams({ query, prefix: 'theme' })

        expect(params).toEqual('t_param1=value1&t_param2=value2')
    })
})