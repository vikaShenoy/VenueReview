<script>
  export default {
    data() {
      return {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        loggedIn: false
      }
    },

    mounted: function() {
      this.checkLogin();

      if (this.loggedIn) this.retrieveUserData();
    },

    methods: {
      retrieveUserData() {
        this.$http.get("http://localhost:4941/api/v1/users/" + localStorage.getItem("userId"), JSON.stringify({
          headers: {
            'X-Authorization': localStorage.getItem('authToken')
          }}))
          .then(function(response) {

            console.log(response.data);
            this.firstName = response.data.givenName;
            this.lastName = response.data.familyName;
            this.username = response.data.username;
            this.email = response.data.email;
          }, function(err) {
            console.log(err);
          });
      },

      signUp() {
        this.$router.push("/signup");
      },
      login() {
        this.$router.push("/login");
      },
      logout() {
        localStorage.setItem("authToken", null);
        this.checkLogin();
      },
      checkLogin() {
        this.loggedIn = localStorage.getItem("authToken") !== "null";
      }
    }
  }

</script>

<template>
  <div>
    <v-app>
      <v-container>

        <v-card class="uk-card-header uk-padding" style="background: powderblue">
          <h2 class="headings">Travel Site</h2>

          <v-btn
            v-if="this.loggedIn"
            depressed
            @click="logout()"
          >Logout</v-btn>

          <v-btn
            v-if="!this.loggedIn"
            depressed
            @click="login()"
          >Login</v-btn>

          <v-btn
            v-if="!this.loggedIn"
            depressed
            @click="signUp()"
          >Sign Up</v-btn>

        </v-card>

        <v-card v-if="this.loggedIn" class="uk-card uk-padding">
          <span>Username: </span>
          <span>{{ this.username }}</span>
          <br>
          <span>First Name</span>
          <span>{{ this.firstName }}</span>
          <br>
          <span>Last Name</span>
          <span>{{ this.lastName }}</span>
          <br>
          <span>Email</span>
          <span>{{ this.email }}</span>
        </v-card>
      </v-container>
    </v-app>
  </div>

</template>

<style lang="css" scoped>
  @import './../stylesheets/style.css';
</style>
