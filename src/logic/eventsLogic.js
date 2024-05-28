import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';

export default function eventsLogic() {

    async function getEvents() {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute('/event', 'GET', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        getEvents,
    };
}
