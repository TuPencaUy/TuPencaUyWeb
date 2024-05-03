import { defineStore } from 'pinia'

export const useTenantStore = defineStore({
  id: 'tenant',
  state: () => {
    return {
      _currentTenant: null
    }
  },
  actions: {
    setTenant(tenant) {
      this._tenant = tenant
    },
    clearTenant() {
      this._tenant = null
    }
  },
  getters: {
    tenant() {
      return this._tenant
    }
  },
  persist: true
})
