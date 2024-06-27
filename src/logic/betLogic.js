import api from './apiLogic';
import {useTenantStore} from '@/store/tenant';
import {useUserStore} from "@/store/user.js";

export default function betLogic() {


    async function getBets(search) {
        try {
            const bets = [];
            let page = 1;
            let hasMore = true;

            let searchString = '';

            Object.keys(search).forEach((key) => {
                searchString += `${key}=${search[key]}&`;
            });

            do {
                const url = `/bet?page=${page}&${searchString}`;
                const currentTenant = useTenantStore().getCurrentTenant;
                const response = await api().execute(url, 'GET', null, {currentTenant});
                const data = await response.json();

                if (data?.data?.list?.length > 0) {
                    bets.push(...data.data.list);
                    page++;
                } else {
                    hasMore = false;
                    return bets;
                }
            } while (hasMore);
        } catch (error) {
            return [];
        }
    }

    async function createOrUpdateBet(bet, betIdToUpdate = '') {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const url = `/bet/${betIdToUpdate}`;
            const httpRequest = betIdToUpdate !== '' ? 'PATCH' : 'POST';

            const token = useUserStore().getToken;
            if (!token) return null;

            const response = await api().execute(url, httpRequest, bet, {'Authorization': `Bearer ${token}`, currentTenant});
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