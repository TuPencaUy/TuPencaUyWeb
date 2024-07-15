import {useTenantStore} from "@/store/tenant.js";
import api from "@/logic/apiLogic.js";
import {useUserStore} from "@/store/user.js";

export default function accessRequestLogic() {
    const BASE_URL = '/accessrequest';

    async function getAccessRequests() {
        try {
            const url = `${BASE_URL}?page=2147483647&pageSize=2147483647&accessStatusEnum=0`;
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(url, 'GET', null, {
                currentTenant,
                Authorization: `Bearer ${useUserStore().getToken}`
            });
            const {data} = await response.json();
            return data?.requests ?? [];

        } catch (error) {
            return error;
        }
    }

    async function updateAccessRequest(accessRequest) {
        try {
            const url = `${BASE_URL}?accessStatusEnum=${accessRequest.status}&email=${accessRequest.email}`;
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(url, 'PATCH', accessRequest, {
                currentTenant,
                Authorization: `Bearer ${useUserStore().getToken}`
            });
            const {data} = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }

    return {
        getAccessRequests,
        updateAccessRequest,
    };
}