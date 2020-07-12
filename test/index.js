const test = require('tape')

const api = require('..')

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('PASS: largest popularity increases - with options', async t => {
  try {
    const params = {
      method: 'largest_popularity_increases',
      options: {
        hours_ago: 48,
        limit: 50,
        percentage: true,
        min_popularity: 50,
        start_index: 0
      }
    }
    const { data, statusCode } = await api(params)
    t.equals(statusCode, 200)
    t.true(Array.isArray(data))
    t.true(data.length)
  } catch (e) {
    console.error(e)
    t.ok(false)
  }
})

test('FAIL: largest popularity increases - with options', async t => {
  try {
    const params = {
      method: 'largest_popularity_increases',
      options: {
        hours: 48,
        limit: 50,
        percentage: true,
        min_popularity: 50,
        start_index: 0
      }
    }
    const { data, statusCode } = await api(params)
    t.equals(statusCode, 200)
    t.true(Array.isArray(data))
    t.true(data.length)
  } catch (e) {
    const { statusCode = 200, message = '' } = e
    t.equals(message, 'Missing required parameter "hours_ago"')
    t.equals(statusCode, 200) // never gets to HTTP call
    t.ok(true)
  }
})
