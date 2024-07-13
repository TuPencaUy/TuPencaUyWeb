import api from './apiLogic';
import {useTenantStore} from "@/store/tenant.js";
import {useUserStore} from "@/store/user.js";

export default function paymentLogic() {

    const URL= '/payment';

    async function createPayment(paymentDetails) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(URL, 'POST', paymentDetails, {currentTenant, Authorization: `Bearer ${useUserStore().getToken}`});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        createPayment,
    };
}
