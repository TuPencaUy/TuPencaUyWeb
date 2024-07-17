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
            _payPalEmail: null,
            _uniqueId: null,
        };
    },
    actions: {
        setCurrentTenant() {
            const hostname = window.location.hostname;
            if (!hostname) return null;

            let parts = hostname.split('.');

            let tupencauyIndex = parts.indexOf(import.meta.env.VITE_BASE_URL_INDEX);

            if (tupencauyIndex > 0) {
                this._currentTenant = parts[tupencauyIndex - 1];
            } else {
                this._currentTenant = null;
            }
        },
        setTenantAccess(access) {
            this._tenantAccess = access;
        },
        setTenantColor(color) {
            this._tenantColor = color;
        },
        setTenantId(id) {
            this._id = id;
        },
        async refreshTenantValues() {
            this.setCurrentTenant();
            await siteLogic().validateSite();
        },
        setPayPalEmail(email) {
            this._payPalEmail = email;
        },
        setUniqueId(id) {
            this._uniqueId = id;
        }
    },
    getters: {
        getCurrentTenant() {
            return this._currentTenant;
        },
        getTenantAccess() {
            return this.isCentralSite ? 1 : this._tenantAccess;
        },
        getTenantColor() {
            return this._tenantColor;
        },
        getUniqueId() {
            return this._uniqueId;
        },
        isCentralSite() {
            return this._currentTenant === null;
        },
        getTenantId() {
            return this._id;
        },
        getPayPalEmail() {
            return this._payPalEmail;
        },
        isClosedAccess() {
            return this._tenantAccess === 0;
        },
        isOpenAccess() {
            return this._tenantAccess === 1;
        },
        isInvitationAccess() {
            return this._tenantAccess === 2;
        },
        isRequestAccess() {
            return this._tenantAccess === 3;
        },
        isInvitationLinkValidated() {
            if (!this.isInvitationAccess || !this.getUniqueId) return false;
            return window.location.href.includes(this.getUniqueId);
        }
    },
    persist: true
});
