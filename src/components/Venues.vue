<script>
  import 'material-design-icons-iconfont/dist/material-design-icons.css';
  let rootUrl = "http://localhost:4941/api/v1";
  export default {
    data () {
      return {
        name: "Venues.vue",
        rowsPerPageItems: [10],
        pagination: {
          rowsPerPage: 10
        },
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
          { text: 'Distance (km)', value: 'distance' },
          { text: 'Photo', value: 'photo' }
        ],
        unfilteredVenues: [],
        filteredVenues: [],
        cityList: [],
        categoryList: [],
        selectedSearchTerm: "",
        selectedCity: "",
        selectedCategory: "",
        selectedStarRating: "",
        selectedCostRating: "",
        snackbar: false,
        snackbarText: "",
        latitude: null,
        longitude: null,
      }
    },
    mounted: function() {
      this.setup();
    },
    computed: {
      filterTableData() {
        let filteredVenues = this.unfilteredVenues;

        if (this.selectedSearchTerm) {
          filteredVenues = filteredVenues.filter(
            venue => venue.venueName.toLowerCase().includes(this.selectedSearchTerm.toLowerCase()));
        }

        if (this.selectedCity) {
          filteredVenues = filteredVenues.filter(
            venue => venue.city.toLowerCase() === this.selectedCity.toLowerCase());
        }

        if (this.selectedCategory) {
          filteredVenues = filteredVenues.filter(
            venue => venue.category.categoryName.toLowerCase() === this.selectedCategory.toLowerCase());
        }

        if (this.selectedStarRating) {
          filteredVenues = filteredVenues.filter(
            venue => venue.meanStarRating > this.selectedStarRating
          );
        }

        if (this.selectedCostRating) {
          console.log(1);
          console.log(this.selectedCostRating);
          let maxCostRating = 0;
          if (this.selectedCostRating === "$") maxCostRating = 1;
          else if (this.selectedCostRating === "$$") maxCostRating = 2;
          else if (this.selectedCostRating === "$$$") maxCostRating = 3;
          else if (this.selectedCostRating === "$$$$") maxCostRating = 4;
          filteredVenues = filteredVenues.filter(
            venue => venue.modeCostRating <= maxCostRating
          );
        }

        return filteredVenues;
      }
    },
    methods: {

      /**
       * Start the setup process for
       * loading venue data.
       */
      setup() {
        this.getLocation();
      },

      /**
       * Call the function to save the user browser location,
       * if supported by browser. Else print an error to console.
       */
      getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.savePosition, this.showLocationError);
        } else {
          console.log("Browser doesn't support geolocation");
        }
      },

      /**
       * Save the user's latitude and longitude data.
       * This is sent in the get venues request,
       * to get distance data returned.
       * @param position
       */
      savePosition(position) {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.getAllVenues();
      },

      /**
       * Enable the error snackbar with a provided message.
       * @param error geolocation error which the message is taken from.
       */
      showLocationError(error) {
        this.snackbar = true;
        this.snackbarText = error.message;
        this.getAllVenues();
      },

      /**
       * Call the endpoint to retrieve every venue in the database.
       * Call another function (getVenueDetails) to get more specific details
       * for that venue.
       */
      getAllVenues() {
        let headers = {
          'X-Authorization': localStorage.getItem("authToken")
        };
        let url = rootUrl + "/venues";
        if (this.latitude != null) url += "?myLatitude=" + this.latitude + "&myLongitude=" + this.longitude;
        this.$http.get(url, {
          headers: headers
        })
          .then(function(response) {
            console.log(response.body);
            this.getVenueDetails(response.body);
          }, function(error) {
            console.log(error);
          });
      },

      /**
       * Call the endpoint to get details for a venue. Use a combination of
       * data from the general venue endpoint and this endpoint
       * to populate the data needed to be displayed in the table.
       * @param venues response body from the get venues request
       */
      getVenueDetails(venues) {
        let headers = {
          'X-Authorization': localStorage.getItem("authToken")
        };
        let venueList = [];
        for (let i = 0 ; i < venues.length ; i++) {
          let initialData = venues[i];
          this.$http.get(rootUrl + "/venues/" + initialData.venueId, {
            headers: headers
          })
            .then(function(response) {
              let tableData = this.processVenueData(initialData, response.body);
              // Populate drop down lists
              this.cityList.push(tableData.city);
              this.categoryList.push(tableData.category.categoryName);
              venueList.push(tableData);
            }, function(error) {
              console.log(error);
            })
        }
        this.cityList.unshift("");
        this.categoryList.unshift("");
        venueList.sort((a, b) => a.meanStarRating - b.meanStarRating);
        this.unfilteredVenues = venueList;
      },

      /**
       * Sets the parameters to be displayed in the table data.
       * @param initialData Data from the general get venues endpoint.
       * @param responseData
       * @returns {*}
       */
      processVenueData(initialData, responseData) {
        let tableData = responseData;
        if (initialData.meanStarRating === null) tableData.meanStarRating = 3;
        else tableData.meanStarRating = initialData.meanStarRating;

        if (initialData.modeCostRating === null) tableData.modeCostRating = 0;
        else tableData.modeCostRating = initialData.modeCostRating;

        if (initialData.distance) tableData.distance = initialData.distance.toFixed(2);

        if (initialData.primaryPhoto) {
          tableData.photo = rootUrl + "/venues/" + initialData.venueId +
            "/photos/" + initialData.primaryPhoto;
        } else {
          tableData.photo = "./src/assets/default-venue.png";
        }
        return tableData;
      },
    },
  }
</script>

<template>
  <v-layout gridlist>
    <v-flex lg12>
      <v-card dark min-width="120">

        <v-snackbar
          v-model="snackbar"
          :timeout="5000"
        >
          {{ snackbarText }}
          <v-btn
            color="pink"
            flat
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>

        <v-layout row>
          <v-flex  d-flex>
            <v-select
              box
              :items="cityList"
              label="City"
              placeholder="City"
              v-model="selectedCity"
            ></v-select>
            <v-select
              box
              :items="categoryList"
              label="Category"
              placeholder="Category"
              v-model="selectedCategory"
            ></v-select>
            <v-select
              box
              :items="['', 1,2,3, 4, 5]"
              label="Minimum Star Rating"
              placeholder="Minimum Star Rating"
              v-model="selectedStarRating"
            ></v-select>
            <v-select
              box
              :items="['', 'Free', '$', '$$', '$$$', '$$$$']"
              label="Maximum Cost Rating"
              v-model="selectedCostRating"
            ></v-select>
            <v-text-field
              v-model="selectedSearchTerm"
              label="Search"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="filterTableData"
          :rows-per-page-items="rowsPerPageItems"
          :pagination.sync="pagination"
          class="elevation-1"
          must-sort
          dark
        >
          <template v-slot:items="props">
            <td>{{ props.item.venueName }}</td>
            <td class="text-xs-right">{{ props.item.category.categoryName }}</td>
            <td class="text-xs-right">{{ props.item.city }}</td>
            <td class="text-xs-right">{{ props.item.meanStarRating }}</td>
            <td class="text-xs-right">{{ props.item.modeCostRating }}</td>
            <td class="text-xs-right">{{ props.item.distance }}</td>
            <td>
              <img :src="props.item.photo">
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>

</template>

<style scoped>

</style>
