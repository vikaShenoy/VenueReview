<script>
  export default {
    data() {
      return {}
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
        <v-layout grid-list>
          <v-flex>
            <v-card class="uk-card-header uk-padding" style="background: powderblue">
              <v-layout row>

                <h2 class="headings">Travel Site</h2>

                <v-spacer align="right">
                  <v-btn
                    depressed
                    @click="login()"
                  >Login</v-btn>

                  <v-btn
                    depressed
                    @click="signUp()"
                  >Sign Up</v-btn>

                </v-spacer>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>

</template>

<style lang="css" scoped>
  @import './../stylesheets/style.css';
</style>
