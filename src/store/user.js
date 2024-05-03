import { defineStore } from 'pinia'
import userLogic from '@/logic/userLogic'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      _isAuthenticated: false,
      _user: null,
      _token: null
    }
  },
  actions: {
    async login(userData) {
      const user = userData?.token
        ? await userLogic().authLogin(userData.token)
        : await userLogic().basicLogin(userData)
      this._isAuthenticated = true
      this._user = user
      this._token = user?.token ?? null

      return this._isAuthenticated
    },
    logOut() {
      this._isAuthenticated = false
      this._user = null
      this._token = null
    }
  },
  getters: {
    isAuthenticated() {
      return this._isAuthenticated
    }
  },
  persist: true
})
