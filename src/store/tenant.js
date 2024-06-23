import {defineStore} from 'pinia';
import siteLogic from "@/logic/siteLogic.js";

export const useTenantStore = defineStore({
    id: 'tenant',
    state: () => {
        return {
            _id: null,
            _currentTenant: null,
            _tenantAccess: null,
            _tenantColor: null,
            _isTenantValid: false,
        };
    },
    actions: {
        setCurrentTenant() {
            let url = window.location.hostname;
            url = url.replace('www.', '');
            url = url.replace('.com', '');

            const splittedUrl = url.split('.');

            this._currentTenant = (splittedUrl?.length > 1)
                ? splittedUrl[0]
                : null;
        },
        setTenantAccess(access) {
            this._tenantAccess = access;
        },
        setTenantColor(color) {
            this._tenantColor = color;
        },
        setIsTenantValid(isValid) {
            this._isTenantValid = isValid;
        },
        setTenantId(id) {
            this._id = id;
        },
        async refreshTenantValues() {
            this.setCurrentTenant();
            this.setIsTenantValid(false);
            await siteLogic().validateSite();
        }
    },
    getters: {
        getCurrentTenant() {
            return this._currentTenant;
        },
        getTenantAccess() {
            return this._tenantAccess;
        },
        getTenantColor() {
            return this._tenantColor;
        },
        isCentralSite() {
            return this._currentTenant === null;
        },
        getTenantId() {
            return this._id;
        }
    },
    persist: true
});
