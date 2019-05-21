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
        if (this.$route.params.userId.toString() === localStorage.getItem("userId")) {
          this.ownProfile = true;
        }
      },
    }
  }
</script>

<template>
  <div>
    <v-app style="background: mintcream">
      <v-container>
        <v-layout row>
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
