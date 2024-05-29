import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';

export default function sportLogic() {

    async function getSports() {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute('/event/sport', 'GET', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        getSports,
    };
}
