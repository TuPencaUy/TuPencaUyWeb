import api from './apiLogic';
import {useTenantStore} from "@/store/tenant.js";

export default function paymentLogic() {

    const URL= '/payment';

    async function createPayment(paymentDetails) {
        try {
            const currentTenant = useTenantStore().getCurrentTenant;
            const response = await api().execute(URL, 'POST', paymentDetails, {currentTenant});
            return response.json();
        } catch (error) {
            return error;
        }
    }

    return {
        createPayment,
    };
}
