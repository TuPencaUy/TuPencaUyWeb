import {createMemoryHistory, createRouter} from 'vue-router';

import HomeView from '../pages/Home.vue';
import LoginView from '../pages/LoginView.vue';
import SignUpView from '../pages/SignupView.vue';
import DashboardView from "@/pages/Admin/Dashboards/DashboardView.vue";
import EventsView from "@/pages/Admin/Events/EventsView.vue";
import EventView from "@/pages/Admin/Events/EventView.vue";
import SportsView from "@/pages/Admin/Sports/SportsView.vue";
import SportView from "@/pages/Admin/Sports/SportView.vue";
import TeamsView from "@/pages/Admin/Teams/TeamsView.vue";
import CreateSiteView from '../pages/CreateSiteView.vue';
import ChatView from "@/pages/ChatView.vue";

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/signup', name: 'Signin', component: SignUpView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/create-site', name: 'create-site', component: CreateSiteView },
  {path: '/chat', name: 'chat', component: ChatView},
  { path: '/:catchAll(.*)', name: 'Not Found', component: LoginView },
  //Admin routes
  { path: '/admin', name: 'dashboard', component: DashboardView },
  { path: '/admin/events', name: 'events', component: EventsView },
  { path: '/admin/events/add', name: 'addEvent', component: EventView },
  { path: '/admin/events/:id', name: 'showEvent', component: EventView },
  { path: '/admin/sports', name: 'sports', component: SportsView },
  { path: '/admin/sports/add', name: 'addEvent', component: SportView },
  { path: '/admin/sports/:id', name: 'showEvent', component: SportView },
  { path: '/admin/teams', name: 'teams', component: TeamsView },
];

const router = createRouter({
    history: createMemoryHistory(),
    routes
});

export default router;