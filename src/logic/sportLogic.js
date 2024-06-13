import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';

export default function sportLogic() {

    async function getSports(id = '') {
        try {
            const url = `/event/sport/${id}`;
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(url, 'GET', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function createOrUpdateSport(sport, sportIdToUpdate = '') {
        try {
            sport.tie = sport.tie === 'yes';

            const currentTenant = useTenantStore().getCurrentTenant;
            const url = `/event/sport/${sportIdToUpdate}`;
            const httpRequest = sportIdToUpdate !== '' ? 'PATCH' : 'POST';
            const response = await api().execute(url, httpRequest, sport, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function deleteSport(sportId) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(`/event/sport/${sportId}`, 'DELETE', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        getSports,
        createOrUpdateSport,
        deleteSport
    };
}
