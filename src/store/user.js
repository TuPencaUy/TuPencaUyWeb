import { defineStore } from 'pinia'
import userLogic from '@/logic/userLogic'
import { useTenantStore } from './tenant'

export const useUserStore = defineStore({
  id: 'user',
  state: () =>
  {
    return {
      _isAuthenticated: false,
      _user: null,
      _token: null,
      _picture: null
    }
  },
  actions: {
    async login(userData)
    {
      const tenant = useTenantStore().getCurrentTenant;

      const user = userData?.token
        ? await userLogic().authLogin(userData.token, tenant)
        : await userLogic().basicLogin(userData);

      if (!user || !user?.data || user?.error) return user;

      this._isAuthenticated = true;
      this._user = user?.data?.user;
      this._token = {
        token: user?.data?.token,
        expiration: user?.data?.expiration
      }
      this._picture = userData?.picture;

      return this._isAuthenticated;
    },
    logOut()
    {
      this._isAuthenticated = false;
      this._user = null;
      this._token = null;
    }
  },
  getters: {
    isAuthenticated()
    {
      return this._isAuthenticated;
    },
    getToken()
    {
      return this._token?.token;
    }
  },
  persist: true
})
