import api from './apiLogic';
import {useUserStore} from "@/store/user.js";

export default function payoutLogic() {

    const URL = '/payout';

    async function createPayout(payoutDetails) {
        try {
            const response = await api().execute(URL, 'POST', payoutDetails, {
                Authorization: `Bearer ${useUserStore().getToken}`
            });
            return await response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        createPayout,
    };
}
