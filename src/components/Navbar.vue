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
          <v-toolbar-title>{{}}</v-toolbar-title>
        </v-spacer>

        <v-toolbar-items>
          <v-btn flat>Profile</v-btn>
          <v-btn flat>Login</v-btn>
          <v-btn flat>Signup</v-btn>
        </v-toolbar-items>
      </v-toolbar>



    </v-layout>

  </div>
</template>

<script>
    export default {
      name: "Navbar",
      data() {
        return {
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

<style scoped>

</style>
