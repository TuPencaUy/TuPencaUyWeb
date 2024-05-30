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

    async function createEvent(event) {
        try {
            const ALLOWED_COMMISSION_VALUES = {no: 0, yes: 1};
            const ALLOWED_TEAM_TYPES = {national: 1, local: 2};

            if (!event.commission || ALLOWED_COMMISSION_VALUES[event.commission] === undefined) throw new Error('Invalid commission value');
            if (!event.teamType || !ALLOWED_TEAM_TYPES[event.teamType] === undefined) throw new Error('Invalid team type value');

            const dataToSend = {
                name: event.name,
                startDate: event.startDate + 'T00:00:00.000Z',
                endDate: event.endDate + 'T00:00:00.000Z',
                comission: ALLOWED_COMMISSION_VALUES[event.commission],
                teamType: ALLOWED_TEAM_TYPES[event.teamType],
            };

            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute('/event', 'POST', dataToSend, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        getEvents,
        createEvent,
    };
}
