import {useUserStore} from "@/store/user.js";

export default function utils() {
    function showLoader() {
        const loader = document.querySelector('.loader-modal');
        if (!loader) return;

        loader.classList.remove('hidden');
    }

    function hideLoader() {
        const loader = document.querySelector('.loader-modal');
        if (!loader) return;

        loader.classList.add('hidden');
    }

    function ensureIsLoggedIn() {
        return useUserStore().isAuthenticated;
    }

    function hasDateExpired(limitDate) {
        const dateToCompare = typeof limitDate === 'string' ? new Date(limitDate) : limitDate;

        return Date.now() > dateToCompare;
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return false;
        }
    }

    return {
        showLoader,
        hideLoader,
        ensureIsLoggedIn,
        hasDateExpired,
        copyToClipboard,
    };
}
