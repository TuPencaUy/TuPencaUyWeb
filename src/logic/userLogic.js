import api from './apiLogic'

export default function userLogic()
{
  async function basicSignUp(userData, currentTenant)
  {
    try
    {
      const response = await api().execute('/identity/basicsignup', 'POST', userData, { currentTenant });
      return await response.json();

    } catch (error)
    {
      return null;
    }
  }

  async function basicLogin(userData)
  {
    try
    {
      const response = await api().execute('/identity/basiclogin', 'POST', userData);
      return await response.json();
    } catch (error)
    {
      return error;
    }
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
    basicSignUp,
    basicLogin,
    authLogin
  }
}
