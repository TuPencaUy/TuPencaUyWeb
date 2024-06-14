import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';

export default function teamLogic() {

    async function getTeams(id = '') {
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
            console.log(team);
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
        createOrUpdateTeam,
        deleteTeam
    };
}
