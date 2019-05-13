<script xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  export default {
    data() {
      return {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        ownProfile: false,
        dialog: false
      }
    },
    mounted: function() {
      this.retrieveUserData();
      this.checkUser();
    },
    methods: {

      checkUser() {
        if (this.$route.params.userId === localStorage.getItem("userId")) {
          this.ownProfile = true;
        }
      },
      retrieveUserData() {
        this.$http.get("http://localhost:4941/api/v1/users/" + this.$route.params.userId, {
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        })
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

      logout() {
        localStorage.setItem("authToken", null);
        this.$router.push("/")

      }
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
                <v-spacer>
                  <h1 class="headings">Profile</h1>
                </v-spacer>

                <v-spacer align="right">
                  <v-btn
                    depressed
                    @click="logout()"
                  >Logout</v-btn>
                </v-spacer>
              </v-layout>

            </v-card>
          </v-flex>
        </v-layout>

        <v-layout grid-list>
          <v-flex md4>

            <v-card class="uk-card uk-padding" style="margin: 10px">

              <v-layout row>
                  <h4 class="font-weight-light">Username</h4>
                <v-spacer align="right">
                  <h4 style="color:indianred">{{ this.username }}</h4>
                </v-spacer>
              </v-layout>

              <v-layout row>
                <h4 class="font-weight-light">First Name</h4>
                <v-spacer align="right">
                  <h4 style="color:indianred">{{ this.firstName }}</h4>
                </v-spacer>
              </v-layout>

              <v-layout row>
                <h4 class="font-weight-light">Last Name</h4>
                <v-spacer align="right">
                  <h4 style="color:indianred">{{ this.lastName }}</h4>
                </v-spacer>
              </v-layout>

              <div v-if="this.ownProfile">
                <v-layout row>
                  <h4 class="font-weight-light">Email</h4>
                  <v-spacer align="right">
                    <h4 style="color:indianred">{{ this.email }}</h4>
                  </v-spacer>
                </v-layout>
              </div>

              <v-dialog
                v-model="dialog"
                max-width="500"
              >
                <template v-slot:activator="{ on }">

                  <v-btn
                    depressed
                    v-on="on"
                  >Edit</v-btn>
                </template>

                <v-card class="padding">

                  <h2 class="padding">Edit Profile</h2>

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
                    v-model="currentPassword"
                    label="Current Password"
                    :error-messages="lastNameErrors"
                    @blur="validateLastName()"
                  ></v-text-field>

                  <v-text-field
                    v-model="newPassword"
                    label="New Password"
                    :error-messages="lastNameErrors"
                    @blur="validateLastName()"
                  ></v-text-field>

                  <v-btn
                    class="v-btn--block"
                  >Save</v-btn>

                </v-card>

              </v-dialog>



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
