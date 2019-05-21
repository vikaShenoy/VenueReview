<script>
  export default {
    name: "Navbar",
    mounted: function() {
      this.checkLogin();
    },
    watch:{
      $route (to, from){
        this.checkLogin();
      }
    },
    methods: {
      checkLogin() {
        //Remove item
        if (localStorage.getItem("userId") !== 'null') {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      },
      logoutUser() {
        localStorage.setItem("userId", null);
        localStorage.setItem("authToken", null);
        this.$router.push('/home');
        this.checkLogin();
      },
      loadSignup() {
        this.$router.push('/signup');
      },
      loadLogin() {
        this.$router.push('/login');
      },
      loadProfile() {
        this.$router.push('/profile/' + localStorage.getItem('userId'));
      },
      loadHome() {
        console.log("Home button function called.");
        this.$router.push('/home');
      }
    },
    data() {
      return {
        showHome: false,
        showProfile: false,
        showSignup: false,
        loggedIn: false,
        links: [
          {
            id: 0,
            text: 'Profile',
            page: '/Profile/' + localStorage.getItem('userId')
          },
          {
            id: 1,
            text: 'Sign Up',
            page: '/Signup'
          },
          {
            id: 2,
            text: 'Login',
            page: '/Login'
          }
        ]
      }
    }
  }
</script>


<template>
  <div>
    <v-layout row>
<!--      <h2>Nav Bar</h2>
      <nav>
        <router-link class="spacing" v-for="routes in links" v-bind:key="routes.id" :to="`${routes.page}`">
          {{routes.text}}
        </router-link>
      </nav>-->

      <v-toolbar dark>
        <v-spacer>
          <v-toolbar-title>Travel Site</v-toolbar-title>
        </v-spacer>

        <v-toolbar-items>
          <v-btn
            v-if="loggedIn"
            flat
            @click="loadHome()"
          >Home</v-btn>
          <v-btn
            v-if="loggedIn"
            flat
            @click="loadProfile()"
          >Profile</v-btn>
          <v-btn
            v-if="!loggedIn"
            flat
            @click="loadLogin()"
          >Login</v-btn>
          <v-btn
            v-if="loggedIn"
            flat
            @click="logoutUser()"
          >Logout</v-btn>
          <v-btn
            v-if="!loggedIn"
            flat
            @click="loadSignup()"
          >Signup</v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-layout>
  </div>
</template>

<style scoped>

</style>
