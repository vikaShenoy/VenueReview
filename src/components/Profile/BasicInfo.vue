<script>

  export default {

    props: {
      ownProfile: {
        type: Boolean,
        required: true,
      }
    },

    data() {
      return {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        oldPasswordErrors: [],
        newPasswordErrors: [],
        firstNameErrors: [],
        lastNameErrors: [],
        dialog: false,
        passwordDialog: false
      }
    },
    /**
     * Retrieve the user's info from the server.
     * Check whether the user is viewing their own profile
     * and set the ownProfile flag accordingly.
     */
    mounted() {
      this.retrieveUserData();
    },
    methods: {

      /**
       * Send a get request to the server for the user info.
       * Set the data with the user data in the response body.
       */
      retrieveUserData() {
        this.$http.get("http://localhost:4941/api/v1/users/" + this.$route.params.userId, {
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        })
          .then(function(response) {
            this.firstName = response.data.givenName;
            this.lastName = response.data.familyName;
            this.username = response.data.username;
            this.email = response.data.email;
          }, function(err) {
            console.log(err);
          });
      },

      /**
       * Called on close of the password edit dialog.
       * Set the fields in the dialog to empty and close the dialog.
       */
      exitPassEdit() {
        this.oldPassword = "";
        this.newPassword = "";
        this.passwordDialog = false;
      },

      /**
       * Called on close to the name edit dialog.
       * Re-retrieve the user's data, as no editing has been done.
       * Close the dialog.
       */
      exitNameEdit() {
        this.retrieveUserData();
        this.dialog = false;
      },

      /**
       * Send a patch request to edit the user's password.
       * Close the dialog on success.
       * @param patchData request body, contianing the user's new password.
       */
      patchPassword(patchData) {
        let headers = {'X-Authorization': localStorage.getItem("authToken")};

        this.$http.patch("http://localhost:4941/api/v1/users/" + this.$route.params.userId,
          patchData, {headers: headers})
          .then(function(response) {
            this.exitPassEdit();
          }, function(error) {
            console.log(error);
          })
      },

      /**
       * Check if the user's old password is accurate by using a login request.
       * If valid, call the patch password funtion with the user's new password.
       * Else, show an error message.
       */
      savePassEdit() {
        this.oldPasswordErrors = [];
        this.newPasswordErrors = [];
        if (!this.oldPassword) this.oldPasswordErrors = ["Provide your old password"];
        if (!this.newPassword) this.newPasswordErrors = ["Provide a new password"];

        if (this.oldPasswordErrors.length === 0 && this.newPasswordErrors.length === 0) {
          let headers = {'X-Authorization': localStorage.getItem("authToken")};
          let loginData = JSON.stringify({
            "username": this.username,
            "password": this.oldPassword
          });
          let patchData = JSON.stringify({
            "password": this.newPassword
          });

          this.$http.post("http://localhost:4941/api/v1/users/login", loginData, {
            headers: headers
          })
            .then(function(response) {
              localStorage.setItem("authToken", response.data.token);
              this.patchPassword(patchData);
            }, function(error) {
              this.oldPasswordErrors = ["Invalid password"];
              console.log(error);
            });
        }
      },

      /**
       * Check fields are valid, then send a request to patch the user's name details.
       * Show an error message if fields are empty.
       */
      saveNameEdit() {
        this.lastNameErrors = [];
        this.firstNameErrors = [];
        if (!this.firstName) this.firstNameErrors = ["Name can't be empty"];
        if (!this.lastName) this.lastNameErrors = ["Name can't be empty"];

        if (this.firstNameErrors.length === 0 && this.lastNameErrors.length === 0) {
          // Send edit req
          let headers = {
            'X-Authorization': localStorage.getItem("authToken")
          };
          let data = JSON.stringify({
            "givenName": this.firstName,
            "familyName": this.lastName
          });
          this.$http.patch("http://localhost:4941/api/v1/users/" + this.$route.params.userId,
            data, {headers: headers})
            .then(function(response) {
              this.dialog=false;
            }, function(error) {
              console.log(error);
            })
        }
      },
    }
  }
</script>

<template>
  <v-card class="uk-card uk-padding" style="margin: 10px">

    <v-layout row>
      <h4 class="font-weight-light">Username</h4>
      <v-spacer align="right">
        <h4 style="color:indianred">{{ this.username }}</h4>
      </v-spacer>
    </v-layout>
    <hr>

    <v-layout row>
      <h4 class="font-weight-light">First Name</h4>
      <v-spacer align="right">
        <h4 style="color:indianred">{{ this.firstName }}</h4>
      </v-spacer>
    </v-layout>
    <hr>


    <v-layout row>
      <h4 class="font-weight-light">Last Name</h4>
      <v-spacer align="right">
        <h4 style="color:indianred">{{ this.lastName }}</h4>
      </v-spacer>
    </v-layout>
    <hr>


    <div v-if="ownProfile">
      <v-layout row>
        <h4 class="font-weight-light">Email</h4>
        <v-spacer align="right">
          <h4 style="color:indianred">{{ this.email }}</h4>
        </v-spacer>
      </v-layout>
    </div>
    <hr>

    <!--Edit Info Dialogs-->
    <v-layout v-if="ownProfile" row>
      <!--Edit names-->
      <template>
        <v-layout row justify-center>
          <v-dialog v-model="dialog" persistent max-width="500">
            <template v-slot:activator="{ on }">
              <v-btn color="blue" dark v-on="on">Edit Profile</v-btn>
            </template>
            <v-card class="uk-padding-small">
              <v-card-title class="headline">Edit Profile</v-card-title>
              <v-text-field
                v-model="firstName"
                label="First Name"
                :maxlength="64"
                :error-messages="firstNameErrors"
              ></v-text-field>

              <v-text-field
                v-model="lastName"
                label="Last Name"
                :error-messages="lastNameErrors"
              ></v-text-field>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click="exitNameEdit()">Cancel</v-btn>
                <v-btn color="green darken-1" flat @click="saveNameEdit()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </template>

      <!--Edit password-->
      <template>
        <v-layout row justify-center>
          <v-dialog v-model="passwordDialog" persistent max-width="500">
            <template v-slot:activator="{ on }">
              <v-btn color="red" dark v-on="on">Edit Password</v-btn>
            </template>
            <v-card class="uk-padding-small">
              <v-card-title class="headline">Edit Password</v-card-title>
              <v-text-field
                v-model="oldPassword"
                label="Old Password"
                type="password"
                :error-messages="oldPasswordErrors"
              ></v-text-field>

              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                :error-messages="newPasswordErrors"
              ></v-text-field>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat @click="exitPassEdit()">Cancel</v-btn>
                <v-btn color="green darken-1" flat @click="savePassEdit()">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
      </template>
    </v-layout>
  </v-card>


</template>
