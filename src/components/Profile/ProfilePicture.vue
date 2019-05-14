<script>
  const rootUrl = "http://localhost:4941/api/v1";

  export default {
    data() {
      return {
        selectedPhoto: null,
        ownProfile: false,
        profilePicData: "",
        reader: null,
      }
    },

    methods: {


      onFileChanged(event) {
        let file = event.target.files[0];
        this.reader = new FileReader();

        // Closure to capture the file information.
        this.reader.onload = (function(theFile) {
          return function(e) {
            // Render thumbnail.
            console.log(e.target);
          };
        })(file);

        // Read in file as binary data.
        this.reader.readAsBinaryString(file);
      },

      onUpload() {
        console.log(this.reader.result);
        let data = this.reader.result;
        const headers = {
          'X-Authorization': localStorage.getItem("authToken"),
          'Content-type': 'image/png'
        };
        this.$http.put(
          "http://localhost:4941/api/v1/users/" + localStorage.getItem("userId") + "/photo",
          data, {headers: headers})
          .then(function (response) {
            console.log(response);
          }, function (error) {
            console.log(error);
          });
      }
    }
  }
</script>

<template>
  <v-card class="uk-card uk-padding" style="margin: 10px">

    <input type="file" @change="onFileChanged">

    <v-btn
      depressed
      color="blue"
      dark
      @click="onUpload"
    >Upload Photo</v-btn>

    <br>
    <br>
    <br>
    <output id="list"></output>

  </v-card>
</template>
