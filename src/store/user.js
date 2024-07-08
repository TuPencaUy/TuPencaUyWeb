import {defineStore} from 'pinia';
import userLogic from '@/logic/userLogic';
import {useTenantStore} from './tenant';
import {useAuth0} from "@auth0/auth0-vue";
import {useChatStore} from "@/store/chatStore.js";

export const useUserStore = defineStore({
    id: 'user', state: () => {
        return {
            _isAuthenticated: false, _user: null, _token: null, _picture: null
        };
    }, actions: {
        async login(userData) {
            const tenant = useTenantStore().getCurrentTenant;
            const user = userData?.token ? await userLogic().authLogin(userData.token, tenant) : await userLogic().basicLogin(userData);

            if (!user || !user?.data || user?.error) return user;

            this.setLogIn(user);

            return this._isAuthenticated;
        }, logOut() {
            this._isAuthenticated = false;
            this._user = null;
            this._token = null;
            useChatStore().deleteChat();
        }, setLogIn(userData) {
            const auth0 = useAuth0();

            this._user = userData?.data?.user;
            this._token = {
                token: userData?.data?.token,
                expiration: userData?.data?.expiration
            };
            this._picture = auth0?.user?.value?.picture;
            this._isAuthenticated = userData?.data?.token ? true : false;
        }
    }, getters: {
        isAuthenticated() {
            return this._isAuthenticated;
        }, getToken() {
            return this._token?.token;
        },
        isAdmin() {
            return this._user?.role?.id === 1;
        },
        getEvents() {
            return this._user?.events ?? [];
        },
        getSite() {
            return this._user?.site;
        },
        getUserEmail() {
            return this._user?.email;
        }
    }, persist: true
});
