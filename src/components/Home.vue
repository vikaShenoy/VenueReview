<script>

  import Venues from "./Venues/Venues.vue";


  export default {
    name: "Home",
    components: {Venues},
    data() {
      return {}
    },
    mounted: function() {
    },
    methods: {
      signUp() {
        this.$router.push("/signup");
      },
      login() {
        this.$router.push("/login");
      },
    }
  }

</script>

<template>
  <div>
    <v-app>
      <v-container>

        <!--Venue component-->
        <v-flex>
          <Venues/>
        </v-flex>

      </v-container>
    </v-app>
  </div>

</template>

<style lang="css" scoped>
  @import './../stylesheets/style.css';
</style>
