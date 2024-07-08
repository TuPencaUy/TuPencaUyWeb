import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';
import {useUserStore} from "@/store/user.js";
import {useEventStore} from "@/store/event.js";

export default function betLogic() {


    async function getBets() {
        try {
            const bets = [];

            const url = `/bet?eventId=${useEventStore().getCurrentEvent?.id}&userEmail=${useUserStore().getUserEmail}`;
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(url, 'GET', null, {currentTenant});
            const data = await response.json();
            if (!data?.data?.list) return bets;

            bets.push(...data.data.list);
            return bets;
        } catch (error) {
            return [];
        }
    }

    async function createOrUpdateBet(bet, updating = false) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const httpRequest = updating ? 'PATCH' : 'POST';

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute('/bet', httpRequest, bet, {
                'Authorization': `Bearer ${token}`,
                currentTenant
            });
            return response.json();
        } catch (error) {
            return error;
        }
    }

    async function deleteBet(betId) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(`/bet/${betId}`, 'DELETE', null, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        getBets,
        createOrUpdateBet,
        deleteBet
    };
}