import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';
import {useUserStore} from "@/store/user.js";

export default function eventsLogic() {

    const URL = '/event';

    async function getEvents(instantiateEvents = false) {
        try {
            const events = [];
            let page = 1;
            let hasMore = true;
            do {
                const url = `${URL}?page=${page}`;
                let currentTenant = useTenantStore().getCurrentTenant;
                if (instantiateEvents) currentTenant = null;
                const response = await api().execute(url, 'GET', null, {currentTenant});
                const data = await response.json();

                if (data?.data?.list?.length > 0) {
                    events.push(...data.data.list);
                    page++;
                } else {
                    hasMore = false;

                    if (instantiateEvents) return events.filter(event => event.instantiable === true);

                    return events;
                }
            } while (hasMore);
        } catch (error) {
            return [];
        }
    }

    async function getEvent(id) {
        try {
            const url = `${URL}/${id}`;
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(url, 'GET', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function createOrUpdateEvent(event, eventIdToUpdate = '') {
        try {
            const ALLOWED_TEAM_TYPES = {national: 1, local: 2};

            if (!event.teamType || !ALLOWED_TEAM_TYPES[event.teamType] === undefined) throw new Error('Invalid team type value');

            const dataToSend = {
                name: event.name,
                startDate: event.startDate + 'T00:00:00.000Z',
                endDate: event.endDate + 'T00:00:00.000Z',
                comission: event.comission * 0.01,
                teamType: ALLOWED_TEAM_TYPES[event.teamType],
                sport_id: event.sport_id,
                instantiable: Boolean(event.instantiable)
            };

            const currentTenant = useTenantStore().getCurrentTenant;
            const url = `${URL}/${eventIdToUpdate}`;
            const httpRequest = eventIdToUpdate !== '' ? 'PATCH' : 'POST';

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(url, httpRequest, dataToSend, {
                'Authorization': `Bearer ${token}`,
                currentTenant
            });
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function deleteEvent(eventId) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(`${URL}/${eventId}`, 'DELETE', null, {
                'Authorization': `Bearer ${token}`,
                currentTenant
            });
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function getUsersFromEvent(eventId) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(`/user?eventId=${eventId}`, 'GET', null, {
                currentTenant,
                'Authorization': `Bearer ${useUserStore().getToken}`
            });
            const {data} = await response.json();
            if (!data) return [];

            return data.filter(user => user.id !== useUserStore()._user.id && user.role.id !== 1);

        } catch (error) {
            return error;
        }
    }

    async function instantiateEvent(instantiateData) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(
                `${URL}/instantiateevent?eventId=${instantiateData.eventId}&price=${instantiateData.price}&prizePercentage=${instantiateData.prizePercentage}`,
                'POST',
                null,
                {
                    currentTenant,
                    'Authorization': `Bearer ${useUserStore().getToken}`
                });
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        getEvents,
        getEvent,
        getUsersFromEvent,
        createOrUpdateEvent,
        deleteEvent,
        instantiateEvent,
    };
}
