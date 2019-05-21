<script>
  const regeneratorRuntime = require("regenerator-runtime");

  export default {
    data() {
      return {
        userEmail: "",
        email: "",
        password: "",
        passwordErrors: [],
        userEmailErrors: [],
        errorFlag: false,
      }
    },
    methods: {
      /**
       * Send a login request to the server.
       * Try with the userEmail field as a username first, then email.
       * Call login success function if request is successful.
       */
      login() {
        // try to send req with username first, then email.
        this.$http.post("http://localhost:4941/api/v1/users/login", JSON.stringify({
          "username": this.userEmail,
          "password": this.password
        }))
          .then(function(response) {
            this.loginSuccess(response);
          }, function(error) {
            console.log(error);
            this.$http.post("http://localhost:4941/api/v1/users/login", JSON.stringify({
              "email": this.userEmail,
              "password": this.password
            }))
              .then(function(response) {
                this.loginSuccess(response);
              }, function(error) {
                console.log(error);
                this.errorFlag = true;
              });
          });
      },

      /**
       * Call when the user login request is successful.
       * Disable error flag, set token and userId in local storage.
       * Route to the profile page.
       * @param response HTTP response from the profile page.
       */
      loginSuccess(response) {
        this.errorFlag = false;
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        this.$router.push("/profile/" + response.data.userId);
      },

      /**
       * Check password field is not empty.
       * @returns {boolean} true if there are no errors.
       */
      validatePassword() {
        this.passwordErrors = [];
        if (!this.password) {
          this.passwordErrors = ["Password is required"];
        }
        return this.passwordErrors.length === 0;
      },

      /**
       * Check uerEmail field is non-empty.
       * @returns {boolean} true if there are no errors.
       */
      validateUserEmail() {
        this.userEmailErrors = [];
        if (!this.userEmail) {
          this.userEmailErrors = ["Username or email required"];
        }
        return this.userEmailErrors.length === 0;
      }
    }
  }
</script>

<template>

  <div>
    <v-app style="background: mintcream">
      <v-container>
        <v-card class="padding">

          <v-text-field
            v-model="userEmail"
            label="Username / Email"
            :error-messages="userEmailErrors"
            @blur="validateUserEmail()"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            :error-messages="passwordErrors"
            @blur="validatePassword()"
          ></v-text-field>

          <v-alert
          :value="errorFlag"
          type="error"
        >Invalid credentials.</v-alert>

          <br>
          <br>

          <v-btn
            @click="login()"
            depressed
            >Login</v-btn>

        </v-card>
      </v-container>
    </v-app>
  </div>

</template>

<style lang="css" scoped>
  @import '../../stylesheets/style.css';
</style>
