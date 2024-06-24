import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';

export default function matchLogic() {

    async function getMatches(eventId) {
        try {
            const matchs = [];
            let page = 1;
            let hasMore = true;
            do {
                const url = `/event/match?page=${page}&eventId=${eventId}`;
                const currentTenant = useTenantStore().getCurrentTenant;
                const response = await api().execute(url, 'GET', null, {currentTenant});
                const data = await response.json();

                if (data?.data?.list?.length > 0) {
                    matchs.push(...data.data.list);
                    page++;
                } else {
                    hasMore = false;
                    return matchs;
                }
            } while (hasMore);
        } catch (error) {
            return [];
        }
    }

    async function getMatch(id) {
        try {
            const url = `/event/match/${id}`;
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
            match.matchType = Number(match.matchType);

            if (match.logo) {
                match.logo = match.logo.split(',')[1];
            }

            const currentTenant = useTenantStore().getCurrentTenant;
            const url = `/event/match/${matchIdToUpdate}`;
            const httpRequest = matchIdToUpdate !== '' ? 'PATCH' : 'POST';
            const response = await api().execute(url, httpRequest, match, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function deleteMatch(matchId) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(`/event/match/${matchId}`, 'DELETE', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        getMatches,
        getMatch,
        createOrUpdateMatch,
        deleteMatch,
    };
}
