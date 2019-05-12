import Vue from 'vue';
import App from './App.vue';
import Signup from './Signup.vue';

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
    path: "/signup",
    component: Signup
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
