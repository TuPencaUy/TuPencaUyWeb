import {createMemoryHistory, createRouter} from 'vue-router';

import App from '../App.vue';
import HomeView from '../pages/Home.vue';
import LoginView from '../pages/LoginView.vue';
import SignUpView from '../pages/SignupView.vue';
import DashboardView from "@/pages/Admin/Dashboards/DashboardView.vue";
import EventsView from "@/pages/Admin/Events/EventsView.vue";
import EventsAdd from "@/pages/Admin/Events/EventsAdd.vue";
import SportsView from "@/pages/Admin/Sports/SportsView.vue";

const routes = [
    {path: '/', name: 'home', component: HomeView},
    {path: '/signup', name: 'Signin', component: SignUpView},
    {path: '/login', name: 'login', component: LoginView},
    {path: '/:catchAll(.*)', name: 'Not Found', component: LoginView},
    //Admin routes
    {path: '/admin', name: 'dashboard', component: DashboardView},
    {path: '/admin/events', name: 'events', component: EventsView},
    {path: '/admin/events/add', name: 'addEvent', component: EventsAdd},
    {path: '/admin/sports', name: 'sports', component: SportsView},
];

const router = createRouter({
    history: createMemoryHistory(),
    routes
});

export default router;
