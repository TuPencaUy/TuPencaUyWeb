import {defineStore} from 'pinia';
import eventsLogic from "@/logic/eventsLogic.js";

export const useEventStore = defineStore({
    id: 'event',
    state: () => {
        return {
            _currentEvent: null,
            _bets: [],
            _matches: [],
        };
    },
    actions: {
        async setCurrentEvent(eventId) {
            const response = await eventsLogic().getEvent(eventId);
            this._currentEvent = response?.data ?? null;
        },
        resetCurrentEvent() {
            this._currentEvent = null;
            this._bets = [];
            this._matches = [];
        }
    },
    getters: {
        getCurrentEvent() {
            return this._currentEvent;
        }
    },
    persist: true
});
