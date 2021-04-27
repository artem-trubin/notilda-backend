const requestLogger = (request, response, next) => {
  // This is a custom middleware function for
  // login all requests in console.
  
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

module.exports = { requestLogger }
