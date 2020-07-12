const BASE_URL = 'http://robintrack.net/api/'
const fetch = require('node-fetch')
const qs = require('querystring')

//
// Create an enum of active/deprecated methods
//
const METHODS = {
  largest_popularity_changes: 'active',
  largest_popularity_decreases: 'active',
  largest_popularity_increases: 'active',
  least_popular: 'active',
  total_symbols: 'active',
  most_popular: 'active'
}

// largest popularity increases
const normalizeOptions = (method, options = {}) => {
  if (method === 'largest_popularity_increases' ||
  method === 'largest_popularity_decreases' ||
  method === 'largest_popularity_changes') {
    //
    // hours_ago is required
    //
    const {
      hours_ago: hoursAgo = ''
    } = options
    if (!hoursAgo) throw new Error('Missing required parameter "hours_ago"')
  }
  return qs.stringify(options)
}

module.exports = async (params = {}) => {
  //
  // Validate params
  //
  const { method = '', options = {} } = params

  if (!method) throw new Error('Missing required parameter "method"')

  const methodExists = METHODS[method]

  if (!methodExists) {
    throw new Error(`Method ${method} is invalid.`)
  }

  if (!methodExists && METHODS[method] === 'deprecated') {
    throw new Error(`Method ${method} is deprecated.`)
  }

  const URL = `${[BASE_URL, method.toLowerCase()].join('')}?` +
`${normalizeOptions(method, options)}`

  let resp = null
  let data = null

  try {
    resp = await fetch(URL)
    //
    // Confirm it is JSON and not a direct to the HTML from the website
    //
    const contentType = resp.headers.get('content-type')
    if (contentType !== 'application/json; charset=utf-8') {
      throw new Error(`API content type was not JSON: ${contentType}`)
    }

    if (!resp.ok) throw new Error(`API resonse was not ok: ${resp.statusText}`)
    data = await resp.json()
  } catch (e) {
    if (resp.status === 404) return { statusCode: 404 }
    console.error(e)
    throw e
  }
  return { data, statusCode: resp.status }
}
