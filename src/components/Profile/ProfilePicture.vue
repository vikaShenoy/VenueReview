<script>

  export default {
    data() {
      return {
        selectedPhoto: null,
        ownProfile: false
      }
    },

    mounted: function() {

    },

    methods: {
      onFileChanged(event) {
        console.log(1);
        this.selectedPhoto = event.target.files[0];
        console.log(this.selectedPhoto);
      },

      onUpload() {
        // Send file

        const data = {
          "body": this.selectedPhoto,
          "headers":
            {
              'X-Authorization': localStorage.getItem("authToken"),
              'Content-type': "image/png"
            }
        };
        let headers = {
          'X-Authorization': localStorage.getItem("authToken"),
          'Content-type': "image/png"
        };
        if (this.selectedPhoto) {
          this.$http.put("http://localhost:4941/api/v1/users/" + this.$route.params.userId + "/photo",
            JSON.stringify(this.selectedPhoto), {headers: headers})
            .then(function(response) {
              console.log("Success");
            }, function(error) {
              console.log("Failure");
              console.log(error);
            });
        }
      }
    }
  }

</script>

<template>
  <v-card class="uk-card uk-padding" style="margin: 10px">

    <input type="file" @change="onFileChanged">
    <v-btn
      color="blue"
      dark
      v-on="on"
      @click="onUpload()"
    >Upload Photo</v-btn>

  </v-card>
</template>
