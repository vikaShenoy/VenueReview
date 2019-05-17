<script>
  import 'material-design-icons-iconfont/dist/material-design-icons.css';
  export default {
    data () {
      return {
        name: "Venues.vue",
        headers: [
          {
            text: 'Venue',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          { text: 'Category', value: 'categoryId' },
          { text: 'City', value: 'city' },
          { text: 'Star Rating (Mean)', value: 'meanStarRating' },
          { text: 'Cost Rating (Mode)', value: 'modeCostRating' },
          { text: 'Photo', value: 'photoData' }
        ],
        allVenues: [],
        selectedVenues: [],
        cities: [],
      }
    },
    mounted: function() {
      console.log('Venues mounted');
      this.getVenues();
      this.selectedVenues = this.allVenues;
    },
    methods: {
      getCities(venueData) {
        let cityList = [];
        for (let i = 0 ; i < venueData.length ; i++) {
          cityList.push(venueData[i].city);
        }
        // To enable the user to select all cities
        cityList.push("All");
        this.cities = cityList;
      },
      getVenues() {
        console.log("Get venues called.");
        let headers = {
          'X-Authorization': localStorage.getItem("authToken")
        };
        this.$http.get("http://localhost:4941/api/v1/venues", {
          headers: headers
        })
          .then(function(response) {
            this.allVenues = response.body;
            this.selectedVenues = this.allVenues;
            this.loadPhotos();
            this.getCities(response.body);
            this.loadPhotos();
          }, function(error) {
            console.log(error);
          })
      },
      loadPhotos() {
        console.log("Load photos called");
        console.log("Selected venues original");
        console.log(this.selectedVenues);
        for (let i = 0 ; i < this.selectedVenues.length ; i++) {
          let venue = this.selectedVenues[i];
          let headers = {
            'X-Authorization': localStorage.getItem("authToken")
          };
          this.$http.get("http://localhost:4941/api/v1/venues/" + venue.venueId + "/photos/" + venue.primaryPhoto, {
            headers: headers
          })
            .then(function(response) {
              this.selectedVenues[i].photoData =  response.body;
            }, function(error) {
              console.log(error);
            });
        }
        console.log("selected venues after");
        console.log(this.selectedVenues);
      },
      filterCities(city) {
        console.log(city === "All");
        if (city !== "All") {
          let venueList = [];
          for (let i = 0; i < this.allVenues.length; i++) {
            if (this.allVenues[i].city === city) {
              venueList.push(this.allVenues[i]);
            }
          }
          this.selectedVenues = venueList;
        } else {
          this.selectedVenues = this.allVenues;
        }
      }
    },
  }
</script>

<template>
  <v-layout gridlist>
    <v-flex lg12>
      <v-card dark min-width="120">
        <v-layout row>
          <v-flex xs12 sm6 d-flex>
            <v-select
              chips
              solo
              :items="cities"
              label="City"
              @change="filterCities($event)"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="selectedVenues"
          class="elevation-1"
          dark
        >
          <template v-slot:items="props">
            <td>{{ props.item.venueName }}</td>
            <td class="text-xs-right">{{ props.item.categoryId }}</td>
            <td class="text-xs-right">{{ props.item.city }}</td>
            <td class="text-xs-right">{{ props.item.meanStarRating }}</td>
            <td class="text-xs-right">{{ props.item.modeCostRating }}</td>
            <td class="text-xs-right">{{ props.item.photoData }}</td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>

</template>

<style scoped>

</style>
