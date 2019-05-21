<script>
  export default {
    name: "AddVenue.vue",
    props: {
      value: {},
    },
    data() {
      return {
        venueCategories: [],
        venueIds: [],
        name: "",
        category: "",
        shortDescription: "",
        longDescription: "",
        city: "",
        address: "",
        latitude: "",
        longitude: "",
        showError: false,
        errorMessage: "",
      }
    },
    mounted: function() {
      this.getCategories();
    },
    methods: {
      getCategories() {
        this.$http.get("http://localhost:4941/api/v1/categories")
          .then(function(response) {
            let names = response.body.map(category => category.categoryName);
            this.venueCategories = names;
          })
      },
      showErrorMessage(message) {
        this.errorMessage = message;
        this.showError = true;
      },
      addVenue() {
        if (!this.checkFields()) return;
        let category = this.venueCategories.indexOf(this.category) + 1;
        let headers = {'X-Authorization': localStorage.getItem("authToken")};
        let body = {
          "venueName": this.name,
          "categoryId": category,
          "city": this.city,
          "shortDescription": this.shortDescription,
          "longDescription": this.longDescription,
          "address": this.address,
          "latitude": parseInt(this.latitude),
          "longitude": parseInt(this.longitude),
        };
        this.$http.post("http://localhost:4941/api/v1/venues", JSON.stringify(body), {headers: headers})
          .then(function(response) {
            this.$emit('saveVenue');
            this.close();
          }, function(error) {
            if (error.status === 400) this.showErrorMessage("Invalid data");
            else if (error.status === 401) this.showErrorMessage("Unauthorized");
          });
      },
      checkFields() {
        if (this.name.length === 0 || this.city.length === 0 || this.shortDescription.length === 0 ||
          this.category.length === 0 || this.longDescription.length === 0 || this.address.length === 0 ||
          this.longitude.length === 0 || this.latitude.length === 0) {
          this.showErrorMessage("No field can be empty!");
          return false;
        } else {
          this.showError = false;
          return true;
        }
      },
      close() {
        this.showError = false;
        this.name = "";
        this.category = "";
        this.city = "";
        this.shortDescription = "";
        this.longDescription = "";
        this.address = "";
        this.latitude = "";
        this.longitude = "";
        this.$emit('input');
      }
    }
  }
</script>

<template>

  <v-dialog
    persistent
    :value="value"
    @input="$emit('input')"
    width="500"
  >
    <v-card class="padding">

      <v-text-field
        v-model="name"
        label="Name"
      ></v-text-field>

      <v-select
        v-model="category"
        :items="venueCategories"
        label="Category"
      ></v-select>

      <v-text-field
        v-model="city"
        label="City"
      ></v-text-field>

      <v-text-field
        v-model="shortDescription"
        label="Short Description"
      ></v-text-field>

      <v-text-field
        v-model="longDescription"
        label="Long Description"
      ></v-text-field>

      <v-text-field
        v-model="address"
        label="Address"
      ></v-text-field>

      <v-text-field
        v-model="latitude"
        type="number"
        label="Latitude"
      ></v-text-field>

      <v-text-field
        v-model="longitude"
        type="number"
        label="Longitude"
      ></v-text-field>

      <v-alert
        :value="showError"
        type="error"
      >
        {{ this.errorMessage }}
      </v-alert>

      <v-spacer align="center">
        <v-btn color="blue darken-1" flat="flat" @click="addVenue"
        >Add Venue</v-btn>
        <v-btn color="red darken-1" flat="flat"
               @click.native="close()"
        >Close</v-btn>
      </v-spacer>
    </v-card>
  </v-dialog>

</template>

<style scoped>

</style>
