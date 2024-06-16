import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';

export default function teamLogic() {

    async function getTeams() {
        try {
            const teams = [];
            let page = 1;
            let hasMore = true;
            do {
                const url = `/event/team?page=${page}`;
                const currentTenant = useTenantStore().getCurrentTenant;
                const response = await api().execute(url, 'GET', null, {currentTenant});
                const data = await response.json();

                if (data?.data?.list?.length > 0) {
                    teams.push(...data.data.list);
                    page++;
                } else {
                    hasMore = false;
                    return teams;
                }
            } while (hasMore);
        } catch (error) {
            return [];
        }
    }

    async function getTeam(id) {
        try {
            const url = `/event/team/${id}`;
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(url, 'GET', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function createOrUpdateTeam(team, teamIdToUpdate = '') {
        try {
            team.sport = Number(team.sport);
            team.teamType = Number(team.teamType);

            if (team.logo) {
                team.logo = team.logo.split(',')[1];
            }

            const currentTenant = useTenantStore().getCurrentTenant;
            const url = `/event/team/${teamIdToUpdate}`;
            const httpRequest = teamIdToUpdate !== '' ? 'PATCH' : 'POST';
            const response = await api().execute(url, httpRequest, team, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function deleteTeam(teamId) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(`/event/team/${teamId}`, 'DELETE', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        getTeams,
        getTeam,
        createOrUpdateTeam,
        deleteTeam,
    };
}
