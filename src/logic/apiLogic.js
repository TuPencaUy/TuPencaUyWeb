export default function api()
{
  const BASE_URL = import.meta.env.VITE_API_CORE_URL

  async function execute(url, method, body = {}, headers = {})
  {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(body)
    });
    return response;
  }

  return {
    execute,
  }
}
