import { defineStore } from 'pinia'

export const useTenantStore = defineStore({
  id: 'tenant',
  state: () =>
  {
    return {
      _currentTenant: null
    }
  },
  actions: {
    setCurrentTenant()
    {
      const url = window.location.hostname;

      this._currentTenant = (url.split('.')?.length > 1)
        ? url.split('.')[0]
        : null;
    }
  },
  getters: {
    getCurrentTenant()
    {
      return this._currentTenant;
    },

  },
  persist: true
})
