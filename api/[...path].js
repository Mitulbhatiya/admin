export default async function handler(req, res) {
  // Handle CORS preflight requests - this is critical!
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, isauth, isr, x-requested-with')
    res.setHeader('Access-Control-Max-Age', '86400')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    return res.status(200).end()
  }

  const API_BASE_URL = 'https://api.satdham.in'
  const { path } = req.query

  // Reconstruct the API path from the path array
  const apiPath = Array.isArray(path) ? path.join('/') : path || ''
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = apiPath.startsWith('/') ? apiPath.slice(1) : apiPath
  const targetUrl = `${API_BASE_URL}/${cleanPath}`

  // Build headers to forward (exclude host and other Vercel-specific headers)
  const forwardHeaders = {}

  // Forward content-type only if present
  if (req.headers['content-type']) {
    forwardHeaders['Content-Type'] = req.headers['content-type']
  }

  // Forward custom headers
  if (req.headers.authorization) {
    forwardHeaders['Authorization'] = req.headers.authorization
  }
  if (req.headers.isauth) {
    forwardHeaders['isauth'] = req.headers.isauth
  }
  if (req.headers.isr) {
    forwardHeaders['isr'] = req.headers.isr
  }

  try {
    // Prepare request body
    let body = undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      if (req.body) {
        // If it's JSON, stringify it
        if (req.headers['content-type']?.includes('application/json')) {
          body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
        } else {
          // For other types (FormData, etc.), pass as-is
          // Vercel will have already parsed it if possible
          body = req.body
        }
      }
    }

    // Forward the request to the API
    const fetchOptions = {
      method: req.method,
      headers: forwardHeaders,
    }

    if (body) {
      fetchOptions.body = body
    }

    const response = await fetch(targetUrl, fetchOptions)

    // Get response data
    const contentType = response.headers.get('content-type') || ''
    let data

    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Set CORS headers in response
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, isauth, isr, x-requested-with')
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    // Forward important response headers (except CORS which we set above)
    const headersToForward = ['content-type', 'content-length', 'cache-control', 'etag']
    headersToForward.forEach(headerName => {
      const headerValue = response.headers.get(headerName)
      if (headerValue) {
        res.setHeader(headerName, headerValue)
      }
    })

    // Forward response status and data
    res.status(response.status)
    
    if (contentType.includes('application/json')) {
      res.json(data)
    } else {
      res.send(data)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, isauth, isr, x-requested-with')
    
    const statusCode = error.response?.status || 500
    res.status(statusCode).json({ 
      error: 'Proxy error', 
      message: error.message || 'Failed to proxy request',
      result: { error: 'Failed to proxy request' }
    })
  }
}

