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
      let url = window.location.hostname;
      url = url.replace('www.', '');
      url = url.replace('.com', '');

      const splittedUrl = url.split('.');

      this._currentTenant = (splittedUrl?.length > 1)
        ? splittedUrl[0]
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
