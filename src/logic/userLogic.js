import api from './apiLogic';
import {useUserStore} from "@/store/user.js";
import {useTenantStore} from "@/store/tenant.js";

export default function userLogic() {
    async function basicSignUpOrUpdate(userData, currentTenant, userId = null) {
        try {
            const url = userId == null ? `/identity/basicsignup?siteAccess=${useTenantStore().getTenantAccess}` : `/user/modify/${userId}`;
            const httpRequest = userId !== null ? 'PATCH' : 'POST';

            const headers = {currentTenant};

            if(userId) {
                const token = useUserStore().getToken;
                if (!token) return null;
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await api().execute(url, httpRequest, userData, headers);
            return await response.json();

        } catch (error) {
            return null;
        }
    }

    async function basicLogin(userData) {
        try {
            debugger;
            let siteAccess = useTenantStore().getTenantAccess;
            if(userData.email.includes('admin')) {
                siteAccess = 1;
            }

            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(`/identity/basiclogin?siteAccess=${siteAccess}`, 'POST', userData, {currentTenant});
            return await response.json();
        } catch (error) {
            return error;
        }
    }

    async function authLogin(token, currentTenant = {}) {
        try {
            let isAllowedRegister =
                !useTenantStore().isInvitationAccess ||
                useTenantStore().isInvitationAccess && useTenantStore().isInvitationLinkValidated;
            const response = await api().execute(`/identity/oauthlogin?siteAccess=${useTenantStore().getTenantAccess}`, 'POST', {
                token,
                isAllowedRegister
            }, {currentTenant});
            return await response.json();
        } catch (error) {
            return error;
        }
    }

    async function subscribeToEvent(eventId) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const userId = useUserStore()._user?.id;
            const response = await api().execute(`/user/subscribetoevent?userId=${userId}&eventId=${eventId}`, 'POST', null, {
                currentTenant,
                "Authorization": `Bearer ${useUserStore().getToken}`
            });
            return await response.json();
        } catch (error) {
            return error;
        }
    }

    async function updateUser(userData) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(`/user/modify/${useUserStore()._user?.id}`, 'PATCH', userData, {
                currentTenant,
                "Authorization": `Bearer ${useUserStore().getToken}`
            });
            return await response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        basicSignUpOrUpdate,
        basicLogin,
        authLogin,
        subscribeToEvent,
        updateUser,
    };
}
