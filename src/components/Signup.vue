<script>
  const regeneratorRuntime = require("regenerator-runtime");
  import { checkEmail } from '../util/Validate';

  export default {
    data() {
      return {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstNameErrors: [],
        lastNameErrors: [],
        emailErrors: [],
        usernameErrors: [],
        passwordErrors: [],
        confirmPasswordErrors: [],
        userId: 0
      }
    },
    mounted: function() {
      console.log("Mounting complete.");
    },
    methods: {
      /**
       * Check user first name field is non-empty.
       * @returns {boolean} true if first name is valid, false otherwise
       */
      validateFirstName() {
        this.firstNameErrors = [];
        if (!this.firstName) {
          this.firstNameErrors = ["First name is required"];
        } else {
          this.firstNameErrors = [];
        }
        return this.firstNameErrors.length === 0;
      },

      /**
       * Check if user last name is non-empty.
       * @returns {boolean} true if name valid, false otherwise.
       */
      validateLastName() {
        this.lastNameErrors = [];
        if (!this.lastName) {
          this.lastNameErrors = ["Last name is required"];
        } else {
          this.lastNameErrors = [];
        }
        return this.lastNameErrors.length === 0;
      },

      /**
       * Check if input username is non-empty and less than 64 chars.
       * @returns {boolean} true if valid, false otherwise.
       */
      validateUsername() {
        this.usernameErrors = [];
        if (!this.username) {
          this.usernameErrors = ["Username is required"];
        } else if (this.username.length > 64) {
          this.usernameErrors = ["Username must be less than 64 characters"];
        } else {
          this.usernameErrors = [];
        }
        return this.usernameErrors.length === 0;
      },
      /**
       * Check if email is non-empty and valid format.
       * @returns {boolean} true if valid email, false otherwise.
       */
      validateEmail() {
        this.emailErrors = [];
        if (!this.email) {
          this.emailErrors = ["Email is required"];
        } else if (!checkEmail(this.email)) {
          this.emailErrors = ["Email is invalid"];
        } else {
          this.emailErrors = [];
        }
        return this.emailErrors.length === 0;
      },
      /**
       * Check if password is non-empty.
       * @returns {boolean} true if pass valid, false otherwise.
       */
      validatePassword() {
        this.passwordErrors = [];
        if (!this.password) {
          this.passwordErrors = ["Password is required"];
        } else {
          this.passwordErrors = [];
        }
        return this.passwordErrors.length === 0;
      },
      /**
       * Check if confirm password is non-empty and matching password.
       * @returns {boolean} true if confirm valid, false otherwise.
       */
      validateConfirmPassword() {
        this.confirmPasswordErrors = [];
        if (!this.confirmPassword) {
          this.confirmPasswordErrors = ["Confirm password is required"];
        } else if (this.password !== this.confirmPassword) {
          this.confirmPasswordErrors = ["Passwords must match"]
        } else {
          this.confirmPasswordErrors = [];
        }
        return this.confirmPasswordErrors.length === 0;
      },
      /**
       * Check all user input fields for signing up are valid.
       * @returns {Promise<boolean>}
       */
      async validateInput() {
        const fields = [
          this.validateFirstName(),
          this.validateUsername(),
          this.validateLastName(),
          this.validatePassword(),
          this.validateEmail(),
          this.validateConfirmPassword()
        ];
        const fieldResults = await Promise.all(fields);
        return fieldResults.every(fieldResult => fieldResult);
      },
      /**
       * Check input. Send post request to sign user up if valid.
       * Then log user in and set token/user id in localstorage.
       * @returns {Promise<void>}
       */
      async signUp() {
        const validFields = await this.validateInput();
        if (!validFields) return;
        this.$http.post("http://localhost:4941/api/v1/users", JSON.stringify({
          "username": this.username,
          "email": this.email,
          "givenName": this.firstName,
          "familyName": this.lastName,
          "password": this.password
        }))
          .then(function(response) {
            localStorage.setItem("userId", response.body.userId);
            this.$http.post("http://localhost:4941/api/v1/users/login", JSON.stringify({
              "username": this.username,
              "email": this.email,
              "password": this.password
            }))
              .then(function(response) {
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                this.$router.push("/profile/" + response.data.userId);
              }, function(e) {
                console.log(e);
              });
          }, function(e) {
            console.log(e);
          })
      }
    }
  }
</script>

<template>

  <div>
    <v-app style="background: mintcream">
      <v-container>

        <v-card class="uk-card-header" style="background: powderblue">
          <h2 class="headings">Sign Up</h2>
        </v-card>

        <v-card class="padding">
          <v-text-field
            v-model="firstName"
            label="First Name"
            :error-messages="firstNameErrors"
            @blur="validateFirstName()"
            :maxlength="64"
          ></v-text-field>

          <v-text-field
            v-model="lastName"
            label="Last Name"
            :error-messages="lastNameErrors"
            @blur="validateLastName()"
          ></v-text-field>

          <v-text-field
            v-model="username"
            label="Username"
            :error-messages="usernameErrors"
            @blur="validateUsername()"
          ></v-text-field>

          <v-text-field
            v-model="email"
            label="Email"
            :error-messages="emailErrors"
            @blur="validateEmail()"
          ></v-text-field>

          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            :error-messages="passwordErrors"
            @blur="validatePassword()"
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            type="password"
            label="Confirm Password"
            :error-messages="confirmPasswordErrors"
            @blur="validateConfirmPassword()"
          ></v-text-field>

          <v-btn
            depressed
            @click="signUp()"
            >Sign Up</v-btn>
        </v-card>

      </v-container>
    </v-app>
  </div>

</template>

<style lang="css" scoped>
  @import './../stylesheets/style.css';
  #signup {
    align-self: center;
    padding: 20px;
    background: powderblue;
  }
</style>


