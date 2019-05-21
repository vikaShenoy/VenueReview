<script>
  const rootUrl = "http://localhost:4941/api/v1/users/";

  export default {

    props: {
      ownProfile: {
        type: Boolean,
        required: true,
      }
    },

    data() {
      return {
        profilePicData: null,
        imageType: null,
        reader: null,
        deleteDisable: true,
        uploadDisable: true,
        errorDialog: false,
        errorMessage: "",
      }
    },


    /**
     * Call the get endpoint to load the user's profile photo.
     */
    mounted() {
      this.getProfilePhoto();
    },

    methods: {

      /**
       * Check if the photo file selected meets input criteria:
       * Less than 20MB big.
       * Image type is png, jpg, jpeg.
       * @param file file uploaded by user
       * @param event used to set input text to empty if there's an error
       */
      checkPhoto(file, event) {
        // Check for correct file type and size.
        if (!(file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
          this.uploadDisable = true;
          this.showError("Wrong file type. Must be png or jpg.");
          event.target.value = '';
        } else if ((file.size / 1000000) > 20) {
          this.uploadDisable = true;
          this.showError("File too large. Must be under 20MB.");
          event.target.files = '';
        } else {
          this.uploadDisable = false;
        }
      },

      /**
       * Called when the user uses the input to choose a file.
       * Load the image data and store it to be sent to server.
       * @param event input file change event.
       */
      onFileChanged(event) {
        let file = event.target.files[0];
        let reader = new FileReader();

        this.checkPhoto(file, event);
        this.imageType = file.type;

        reader.onload = ((e) => {
          this.profilePicData = e.target.result;
        });

        // Read in file as binary data.
        reader.readAsDataURL(file);
      },

      /**
       * Show an error message as a vue dialog component.
       * Set the message to indicate what is wrong.
       * @param message message to be displayed in the error dialog body.
       */
      showError(message) {
        this.errorDialog = true;
        this.errorMessage = message;
      },

      /**
       * Hide the error message. Called on exit button click on the dialog.
       */
      hideError() {
        this.errorDialog = false;
      },

      /**
       * Send a put request to server to update the user's photo with the
       * provided image data.
       * Call the get profile photo method to display the new profile photo.
       */
      uploadProfilePhoto() {
        let data = this.profilePicData;
        const headers = {
          'X-Authorization': localStorage.getItem("authToken"),
          'Content-type': this.imageType
        };
        this.$http.put(
          "http://localhost:4941/api/v1/users/" + localStorage.getItem("userId") + "/photo",
          data, {headers: headers})
          .then(function (response) {
            this.getProfilePhoto();
          }, function (error) {
            console.log(error);
          });
      },

      /**
       * Delete the user's profile photo on the server.
       * Set the image to empty.
       */
      deleteProfilePhoto() {
        const headers = {'X-Authorization': localStorage.getItem("authToken")};

        this.$http.delete(rootUrl + this.$route.params.userId + "/photo", {headers: headers})
          .then(function(response) {
            let img = document.getElementById("profilePhoto");
            img.src = null;
            this.uploadDisable = false;
            this.deleteDisable = true;
          }, function(error) {
            console.log(error);
          });
      },

      /**
       * Get the user's profile photo from the server.
       * Display the received image data in the img element.
       */
      getProfilePhoto() {
        const headers = {'X-Authorization': localStorage.getItem("authToken")};

        this.$http.get("http://localhost:4941/api/v1/users/" + this.$route.params.userId + "/photo",
          {headers: headers})
          .then(function(response) {
              let img = document.getElementById("profilePhoto");
              img.src = response.body;
              this.uploadDisable = true;
              this.deleteDisable = false;
            }, function(error) {
            console.log(error);
              let img = document.getElementById("profilePhoto");
              img.src = null;
            }
          )
      },
    }
  }
</script>

<template>
  <v-card class="uk-card uk-padding" style="margin: 10px">

      <v-layout v-if="ownProfile" row>

        <input type="file" @change="onFileChanged" accept=".jpeg, .png, .jpg">

        <v-btn
          depressed
          @click="uploadProfilePhoto"
          :disabled="uploadDisable"
        >Upload Photo</v-btn>

        <v-btn
          depressed
          @click="deleteProfilePhoto"
          :disabled="deleteDisable"
        >Delete Photo</v-btn>

        <template>
          <v-layout row justify-center>
            <v-dialog v-model="errorDialog" max-width="300">
              <v-card class="uk-padding-small">
                <v-card-title class="headline">Photo Error!</v-card-title>
                <v-card-text style="color:red">{{ this.errorMessage }}</v-card-text>
                <v-card-actions>
                  <v-btn color="darken-1"  @click="hideError()">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
        </template>

      </v-layout>
      <img id="profilePhoto"
           alt=""
           :src="'http://localhost:4941/api/v1/users/' + this.$route.params.userId + '/photo'"/>

  </v-card>
</template>
