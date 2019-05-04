import wu from '../index'

export default {
  
  mockFetch: (definition, response = '{}', responseHeaders = {}, responseStatus = 200) => {
    const mockFetchPromise = Promise.resolve({
      headers: responseHeaders,
      status: responseStatus,
      json: () => new Promise((resolve, reject) => {
        const parsedResponse = JSON.parse(response)
        setTimeout(() => {
          // simulate an asynchronous response
          resolve(parsedResponse)
        })
      })
    })
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise)
    wu.create('api', 'api-name', definition)
  }
  
}
