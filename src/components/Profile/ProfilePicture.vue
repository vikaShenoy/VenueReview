<script>

  export default {
    data() {
      return {
        selectedPhoto: ""
      }
    },

    methods: {
      onFileChanged(event) {
        console.log(1);
        this.selectedPhoto = event.target.file;
        console.log(this.selectedPhoto);
      }
    }
  }

</script>

<template>
  <v-card class="uk-card uk-padding" style="margin: 10px">

    <input type="file" @change="onFileChanged">
    <button @click="onUpload">Upload!</button>

  </v-card>
</template>
