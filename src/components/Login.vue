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
    mounted: function() {
      console.log("Mounting.");
    },
    methods: {
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

      loginSuccess(response) {
        this.errorFlag = false;
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        this.$router.push("/");
      },

      validatePassword() {
        this.passwordErrors = [];
        if (!this.password) {
          this.passwordErrors = ["Password is required"];
        }
        return this.passwordErrors.length === 0;
      },
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

        <v-card class="uk-card uk-card-header" style="background: powderblue">
          <h2 class="headings">Login</h2>
        </v-card>

        <v-card class="padding">

          <v-text-field
            v-model="userEmail"
            label="Username / email"
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
            depressed
            @click="login()"
            >Login</v-btn>

        </v-card>

      </v-container>


    </v-app>

  </div>

</template>

<style lang="css" scoped>
  @import './../stylesheets/style.css';
</style>
