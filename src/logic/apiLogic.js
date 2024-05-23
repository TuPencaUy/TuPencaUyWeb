export default function api()
{
  const BASE_URL = import.meta.env.VITE_API_CORE_URL

  async function execute(url, method, body = {}, headers = {})
  {
    const requestObject = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }

    if (body && Object.keys(body).length > 0)
    {
      requestObject.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${url}`, requestObject);
    return response;
  }

  return {
    execute,
  }
}