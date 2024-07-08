import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';
import {useUserStore} from "@/store/user.js";

export default function matchLogic() {

    const URL = '/match';

    async function getMatches(eventId) {
        try {
            const matches = [];
            let page = 1;
            let hasMore = true;
            do {
                const url = `${URL}?page=${page}&eventId=${eventId}`;
                const currentTenant = useTenantStore().getCurrentTenant;
                const response = await api().execute(url, 'GET', null, {currentTenant});
                const data = await response.json();

                if (data?.data?.list?.length > 0) {
                    matches.push(...data.data.list);
                    page++;
                } else {
                    hasMore = false;
                    return matches;
                }
            } while (hasMore);
        } catch (error) {
            return [];
        }
    }

    async function getMatch(id) {
        try {
            const url = `${URL}/${id}`;
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(url, 'GET', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function createOrUpdateMatch(match, matchIdToUpdate = '') {
        try {
            match.sport = Number(match.sport);
            match.eventId = Number(match.eventId);
            match.date = (matchIdToUpdate) ? match.date = null : toLocalISOString(match.date);

            const currentTenant = useTenantStore().getCurrentTenant;
            const url = `${URL}/${matchIdToUpdate}`;
            const httpRequest = matchIdToUpdate !== '' ? 'PATCH' : 'POST';

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(url, httpRequest, match, {
                'Authorization': `Bearer ${token}`,
                currentTenant
            });
            return response.json();
        } catch (error) {
            return error;
        }
    }


    async function deleteMatch(matchId) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const token = useUserStore().getToken;
            if (!token) return null;
            const response = await api().execute(`${URL}/${matchId}`, 'DELETE', null, {
                'Authorization': `Bearer ${token}`,
                currentTenant
            });
            return response.json();
        } catch (error) {
            return error;
        }
    }

    function toLocalISOString(date) {
        const offset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() - offset);
        return adjustedDate.toISOString().slice(0, -1);
    }

    return {
        getMatches,
        getMatch,
        createOrUpdateMatch,
        deleteMatch,
    };
}