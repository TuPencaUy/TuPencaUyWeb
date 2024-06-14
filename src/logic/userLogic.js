import api from './apiLogic';
import {useUserStore} from "@/store/user.js";
import {useTenantStore} from "@/store/tenant.js";

export default function userLogic() {
    async function basicSignUp(userData, currentTenant) {
        try {
            const response = await api().execute('/identity/basicsignup', 'POST', userData, {currentTenant});
            return await response.json();

        } catch (error) {
            return null;
        }
    }

    async function basicLogin(userData) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute('/identity/basiclogin', 'POST', userData, {currentTenant});
            return await response.json();
        } catch (error) {
            return error;
        }
    }

    async function authLogin(token, currentTenant = {}) {
        try {
            const response = await api().execute('/identity/oauthlogin', 'POST', token, {currentTenant});
            return await response.json();
        } catch (error) {
            return error;
        }
    }

    async function subscribeToEvent(eventId) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const userId = useUserStore()._user?.id;
            const response = await api().execute(`/user/subscribetoevent?userId=${userId}&eventId=${eventId}`, 'POST', null, {currentTenant, "Authorization": `Bearer ${useUserStore().getToken}`});
            return await response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        basicSignUp,
        basicLogin,
        authLogin,
        subscribeToEvent,
    };
}
