import api from './apiLogic';
import { useTenantStore } from '@/store/tenant';

export default function teamLogic() {

    async function getTeams() {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute('/event/team', 'GET', null, { currentTenant });
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        getTeams,
    };
}