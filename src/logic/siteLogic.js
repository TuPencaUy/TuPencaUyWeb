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

    async function createSite(data) {
        try {

            const dataToSend = {
                "name": "",
                "domain": "",
                "accesstype": "",
                "color": ""
            };

            for (let key in dataToSend) {
                if (!data.hasOwnProperty(key)) {
                    return api().response(null, `Missing ${key}`, true);
                }
            }

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute('/site/createsite', 'POST', data, {'Authorization': `Bearer ${token}`});


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
                "Color": Number(siteData.color)
            };

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(`/site/${dataToSend.id}`, 'PUT', dataToSend, {'Authorization': `Bearer ${token}`});
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

        if (useTenantStore()._isTenantValid) return;

        const site = await getSite(tenant);
        if (!site || site?.error || !site?.data) {
            window.location.href = import.meta.env.VITE_API_CENTRAL_URL;
        }

        useTenantStore().setTenantId(site.data?.id);
        useTenantStore().setTenantAccess(site.data?.accessType ?? 1);
        useTenantStore().setTenantColor(site.data?.color ?? 1);
        useTenantStore().setIsTenantValid(true);
    }

    return {
        init,
        createSite,
        getSite,
        updateSite,
        validateSite,
    };
}
