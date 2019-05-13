import Vue from 'vue';
import App from './components/App.vue';
import Signup from './components/Signup.vue';
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import Profile from './components/Profile.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import 'vuetify/dist/vuetify.css'

import Vuetify from 'vuetify'
Vue.use(Vuetify);

Vue.http.options.emulateJSON = true;

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/signup",
    component: Signup
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/profile/:userId",
    component: Profile
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
