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
      _token: null
    }
  },
  actions: {
    async login(userData)
    {

      const tenant = useTenantStore().getCurrentTenant;

      const user = userData?.token
        ? await userLogic().authLogin(userData.token, tenant)
        : await userLogic().basicLogin(userData);

      if (user?.error || !user?.data) return false;

      this._isAuthenticated = true;
      this._user = user?.data?.user;
      this._token = {
        token: user?.data?.token,
        expiration: user?.data?.expiration
      }

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
    }
  },
  persist: true
})
