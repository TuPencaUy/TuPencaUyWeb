import api from "@/logic/apiLogic.js";
import {loadScript} from "@paypal/paypal-js";
import paymentLogic from "@/logic/paymentLogic.js";
import {uuid} from "vue-uuid";

export default function paypalLogic() {
    const BASE_URL = "https://api-m.sandbox.paypal.com";

    async function initPaypal() {
        try {
            return await loadScript({
                clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
            });
        } catch (error) {
            console.error("failed to load the PayPal JS SDK script", error);
        }
    }

    async function createOrder(paymentObj) {
        const accessToken = await generateAccessToken();
        const url = `${BASE_URL}/v2/checkout/orders`;
        const response = await api().execute(url, "POST", paymentObj, {Authorization: `Bearer ${accessToken}`}, true);
        const json = await response.json();
        return json.id;
    }

    async function capturePayment(orderId) {
        const accessToken = await generateAccessToken();
        const url = `${BASE_URL}/v2/checkout/orders/${orderId}/capture`;
        const response = await api().execute(url, "POST", null, {Authorization: `Bearer ${accessToken}`}, true);
        return await response.json();
    }

    async function generateAccessToken() {
        const auth = btoa(import.meta.env.VITE_PAYPAL_CLIENT_ID + ":" + import.meta.env.VITE_PAYPAL_SECRET_ID);

        let response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${auth}`
            },
            body: "grant_type=client_credentials"
        });
        response = await response.json();
        return response?.access_token ?? null;
    }

    async function createPaymentDB(eventId, paymentDetails) {
        paymentDetails.eventId = eventId;
        await paymentLogic().createPayment(paymentDetails);
        return true;
    }

    async function createPayout(items, eventName) {
        const accessToken = await generateAccessToken();
        const url = `${BASE_URL}/v1/payments/payouts`;
        const payoutDetails = {
            items: [],
            sender_batch_header: {
                sender_batch_id: uuid.v4(),
                email_subject: "You have a payment",
                email_message: `You have received a payment.`,
            },
        }
        payoutDetails.items = items.map(item => {
            return {
                receiver: item.receiver,
                recipient_type: "EMAIL",
                amount: {
                    currency: "USD",
                    value: item.amount,
                },
                note: `Payment for ${eventName} event.`,
                notification_language: "en-EN",
            };
        });
        const response = await api().execute(url, "POST", payoutDetails, {Authorization: `Bearer ${accessToken}`}, true);
        return await response.json();
    }

    async function convertUSDtoUYU(uyu_value) {
        const response = await api().execute("https://cotizaciones-brou-v2-e449.fly.dev/currency/latest", 'GET');
        if (!response || Object.entries(response).length === 0) return null;

        const usd_value = Number(uyu_value) / Number(response.rates.USD.buy);
        if (!usd_value) return null;

        return usd_value;
    }

    return {
        initPaypal,
        createOrder,
        capturePayment,
        createPaymentDB,
        createPayout,
    };
}
