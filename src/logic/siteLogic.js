import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';
import {useUserStore} from '@/store/user';
import themes from "@/logic/themes.js";

export default function siteLogic() {

    async function init() {
        await useTenantStore().setCurrentTenant();

        await themes().setTheme(useTenantStore().getTenantColor);

        await validateSite();
    }

    async function getSites() {
        try {
            const response = await api().execute('/site', 'GET');
            return response.json();
        } catch (e) {
            return null;
        }
    }

    async function createSite(data) {
        try {

            const dataToSend = {
                "name": data?.name,
                "domain": data?.domain,
                "accessType": Number(data?.accesstype),
                "color": Number(data?.color),
            };

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute('/site/createsite', 'POST', dataToSend, {'Authorization': `Bearer ${token}`});
            return response.json();
        } catch (e) {
            return null;
        }
    }

    async function updateSite(siteData) {
        try {

            const dataToSend = {
                "id": siteData.id,
                "Name": siteData.name,
                "Domain": siteData.domain,
                "AccessType": Number(siteData.accesstype),
                "Color": Number(siteData.color),
                "paypalEmail": siteData?.paypalEmail ?? null,
            };

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(`/site/${dataToSend.id}`, 'PUT', dataToSend, {'Authorization': `Bearer ${token}`});
            return response.json();
        } catch (e) {
            return null;
        }
    }

    async function deleteSite(siteId) {
        try {
            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(`/site/${siteId}`, 'DELETE', null, {
                currentTenant: null,
                'Authorization': `Bearer ${token}`
            });
            return response.json();
        } catch (e) {
            return null;
        }
    }

    async function getSite(tenant) {
        try {
            const response = await api().execute(`/site/${tenant}`, 'GET');
            return response.json();
        } catch (e) {
            return null;
        }
    }

    async function validateSite() {
        const tenant = useTenantStore().getCurrentTenant;
        if (!tenant) return;

        const site = await getSite(tenant);
        debugger;
        if (!site || site?.error || !site?.data) {
            window.location.href = import.meta.env.VITE_API_CENTRAL_URL;
        }
        useTenantStore().setTenantId(site.data?.id);
        useTenantStore().setTenantAccess(site.data?.accessType ?? 1);
        useTenantStore().setTenantColor(site.data?.color ?? 1);
        useTenantStore().setPayPalEmail(site.data?.paypalEmail);
    }

    async function redirectUserToSite(tenant) {
        window.location.href = `http://${tenant}.${import.meta.env.VITE_BASE_DOMAIN}`;
    }

    return {
        init,
        getSites,
        createSite,
        getSite,
        updateSite,
        deleteSite,
        validateSite,
        redirectUserToSite,
    };
}
