import api from './apiLogic'

export default function userLogic()
{
  async function basicLogin(userData)
  {
    try
    {
    } catch (error) { }
  }

  async function authLogin(token, currentTenant = {})
  {
    try
    {
      const response = await api().execute('/identity/oauthlogin', 'POST', token, { currentTenant });
      return await response.json();
    } catch (error)
    {
      return error;
    }
  }

  return {
    basicLogin,
    authLogin
  }
}
