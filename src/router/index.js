import {createMemoryHistory, createRouter} from 'vue-router';

import Events from '../pages/Events.vue';
import Event from '../pages/Event.vue';
import LoginView from '../pages/LoginView.vue';
import SignUpView from '../pages/SignupView.vue';
import DashboardView from "@/pages/Admin/Dashboards/DashboardView.vue";
import EventsView from "@/pages/Admin/Events/EventsView.vue";
import EventView from "@/pages/Admin/Events/EventView.vue";
import SportsView from "@/pages/Admin/Sports/SportsView.vue";
import SportView from "@/pages/Admin/Sports/SportView.vue";
import TeamsView from "@/pages/Admin/Teams/TeamsView.vue";
import TeamView from "@/pages/Admin/Teams/TeamView.vue";
import MatchesView from "@/pages/Admin/Matches/MatchesView.vue";
import CreateSiteView from '../pages/CreateSiteView.vue';
import ChatView from "@/pages/ChatView.vue";
import EventInstantiate from "@/pages/Admin/Events/EventInstantiate.vue";
import SettingsView from "@/pages/Admin/Settings/SettingsView.vue";
import SettingSecurity from "@/components/Settings/SettingSecurity.vue";
import SettingCustom from "@/components/Settings/SettingCustom.vue";
import SitesView from "@/pages/Admin/Sites/SitesView.vue";
import SiteView from "@/pages/Admin/Sites/SiteView.vue";

const routes = [
  { path: '/events', name: 'user events', component: Events },
  { path: '/signup', name: 'Signin', component: SignUpView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/create-site', name: 'create-site', component: CreateSiteView },
  {path: '/chat', name: 'chat', component: ChatView},
  { path: '/:catchAll(.*)', name: 'Not Found', component: LoginView },
  //Admin routes
  { path: '/admin', name: 'dashboard', component: DashboardView },
  { path: '/admin/events', name: 'events', component: EventsView },
  { path: '/admin/events/add', name: 'addEvent', component: EventView },
  { path: '/admin/events/instantiate', name: 'instantiateEvent', component: EventInstantiate },
  { path: '/admin/events/:id', name: 'showEvent', component: EventView },
  { path: '/admin/sports', name: 'sports', component: SportsView },
  { path: '/admin/sports/add', name: 'addSport', component: SportView },
  { path: '/admin/sports/:id', name: 'showSport', component: SportView },
  { path: '/admin/teams', name: 'teams', component: TeamsView },
  { path: '/admin/teams/add', name: 'addTeam', component: TeamView },
  { path: '/admin/teams/:id', name: 'ShowTeam', component: TeamView },
  { path: '/admin/event/:event/matches', name: 'showMatches', component: MatchesView },
  { path: '/admin/sites', name: 'sites', component: SitesView },
  { path: '/admin/sites/add', name: 'addSite', component: SiteView },
  //Settings
  { path: '/admin/settings/general', name: 'settings', component: SettingsView },
  { path: '/admin/settings/security', name: 'settingSecurity', component: SettingSecurity },
  { path: '/admin/settings/custom', name: 'settingCustom', component: SettingCustom },

];

const router = createRouter({
    history: createMemoryHistory(),
    routes
});

export default router;