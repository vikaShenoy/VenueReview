<template>
  <div>
    <v-layout row>
      <h2>Nav Bar</h2>
      <nav>
        <router-link v-for="routes in links" v-bind:key="routes.id" :to="`${routes.page}`">
          {{routes.text}}
        </router-link>
      </nav>
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
            }
          ]
        }
      }
    }
</script>

<style scoped>

</style>
