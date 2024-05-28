import router from "@/router/index.js";
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
        if (!useUserStore().isAuthenticated) {
            router.push('/login');
        }

    }

    return {
        showLoader,
        hideLoader,
        ensureIsLoggedIn
    };
}
