import api from './apiLogic'

export default function userLogic()
{
  async function basicLogin(userData)
  {
    try
    {
    } catch (error) { }
  }

  async function authLogin(token)
  {
    try
    {
      return await api().execute('/identity/oauthlogin', 'POST', token);
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
