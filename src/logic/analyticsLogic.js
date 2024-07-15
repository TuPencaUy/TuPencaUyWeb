import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';
import {useUserStore} from "@/store/user.js";

export default function analyticsLogic() {

    async function eventLeaderBoard(eventId) {
        try {
            const url = `/analytics/leaderboard/${eventId}`;
            const currentTenant = useTenantStore().getCurrentTenant;

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(url, 'GET', null, {'Authorization': `Bearer ${token}`, currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function betsMatchData(matchId) {
        try {
            const url = `/analytics/bets/matches?matchId=${matchId}`;
            const currentTenant = useTenantStore().getCurrentTenant;

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(url, 'GET', null, {'Authorization': `Bearer ${token}`, currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function betsEventData(eventId) {
        try {
            const url = `/analytics/bets/events?eventId=${eventId}`;
            const currentTenant = useTenantStore().getCurrentTenant;

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(url, 'GET', null, {'Authorization': `Bearer ${token}`, currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function platformFinances() {
        return _platform('finances')
    }

    async function platformEvents() {
        return _platform('events')
    }

    async function platformSites() {
        return _platform('sites')
    }

    async function _platform(type) {
        try {
            const url = `/analytics/platform/${type}`;
            const currentTenant = useTenantStore().getCurrentTenant;

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(url, 'GET', null, {'Authorization': `Bearer ${token}`, currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }
  
    return {
        eventLeaderBoard,
        betsMatchData,
        betsEventData,
        platformFinances,
        platformEvents,
        platformSites
    };
}