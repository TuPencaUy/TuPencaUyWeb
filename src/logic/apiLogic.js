export default function api() {
  const BASE_URL = import.meta.env.VITE_API_CORE_URL

  async function get(url) {
    const response = await fetch(`${BASE_URL}${url}`)
    return response.json()
  }

  async function post(url, data) {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return response.json()
  }

  async function put(url, data) {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return response.json()
  }

  async function remove(url) {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE'
    })

    return response.json()
  }

  return {
    get,
    post,
    put,
    remove
  }
}
