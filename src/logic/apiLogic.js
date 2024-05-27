export default function api() {
  const BASE_URL = import.meta.env.VITE_API_CORE_URL

  async function execute(url, method, body = {}, headers = {}) {
    const requestObject = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }

    
    if (body && Object.keys(body).length > 0) {
      requestObject.body = JSON.stringify(body);
    }

    if (Object.keys(headers).length > 0) {
      Object.assign(requestObject.headers, headers);
    }

    const finalUrl = `${BASE_URL}${url}`;

    const response = await fetch(finalUrl, requestObject);
    return response;
  }

  function response(data = null, message = "", error = false)
  {
    return {
      error: error,
      message: message,
      data: data
    }
  }

  return {
    execute,
    response
  }
}