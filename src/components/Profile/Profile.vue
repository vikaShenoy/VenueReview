<script>

  import ProfilePicture from "./ProfilePicture"
  import BasicInfo from "./BasicInfo"

  export default {
    components: {
      ProfilePicture,
      BasicInfo
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
        ownProfile: false,
        dialog: false,
        passwordDialog: false
      }
    },
    mounted: function() {
      this.checkUser();
    },
    methods: {
      /**
       * Check if the user is viewing their own profile.
       * Set the ownProfile flag to true if so.
       */
      checkUser() {
        if (this.$route.params.userId === localStorage.getItem("userId")) {
          this.ownProfile = true;
        }
      },

      logout() {
        this.$http.post("http://localhost:4941/api/v1/users/logout", {}, {
          headers: {'X-Authorization': localStorage.getItem("authToken")}
        })
          .then(function(response) {
            localStorage.setItem("authToken", null);
            this.$router.push("/")
          }, function(error) {
            console.log(error);
          });
      }
    }
  }
</script>

<template>
  <div>
    <v-app>
      <v-container>
        <!--Title Bar-->
        <v-layout grid-list>
          <v-flex>
            <v-card class="uk-card-header uk-padding" style="background: powderblue">
              <v-layout row>
                <v-spacer>
                  <h1 class="headings">Profile</h1>
                </v-spacer>

                <v-spacer align="right">
                  <v-btn
                    @click="logout()"
                  >Logout</v-btn>
                </v-spacer>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout grid-list>

        <!--Profile info card-->
          <v-flex>
            <BasicInfo :ownProfile="ownProfile"/>
          </v-flex>

        <!--Photo card-->
          <v-flex>
            <ProfilePicture :ownProfile="ownProfile"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>

</template>

<style lang="css" scoped>
  @import '../../stylesheets/style.css';
</style>
