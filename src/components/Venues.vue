<script xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
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
        expand: false,
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
        expandVenue: false,
        latitude: null,
        longitude: null,
        showMyVenues: false,
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

        if (this.showMyVenues) {
          filteredVenues = filteredVenues.filter(
            venue => venue.admin.userId.toString() === localStorage.getItem("userId")
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

      getVenueReviews(item, venueId) {
        console.log(item);
        let headers = {'X-Authorization': localStorage.getItem("authToken")};
        console.log(50);
        this.$http.get("http://localhost:4941/api/v1/venues/" + venueId + "/reviews", {headers: headers})
          .then(function(response) {
            item.reviews = response.body;
          }, function(error) {
            console.log(error);
          });
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
        let headers = {'X-Authorization': localStorage.getItem("authToken")};
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
        let headers = {'X-Authorization': localStorage.getItem("authToken")};
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
        console.log(1);
      },

      /**
       * Sets the parameters to be displayed in the table data.
       * @param initialData Data from the general get venues endpoint.
       * @param responseData
       * @returns {*}
       */
      processVenueData(initialData, responseData) {
        let tableData = responseData;
        tableData.venueId = initialData.venueId;

        if (initialData.meanStarRating === null) tableData.meanStarRating = 3;
        else tableData.meanStarRating = initialData.meanStarRating;

        if (initialData.modeCostRating === null) tableData.modeCostRating = 0;
        else tableData.modeCostRating = initialData.modeCostRating;

        if (initialData.distance) tableData.distance = initialData.distance.toFixed(2);
        if (responseData.longDescription.length === 0) tableData.longDescription =
          "No additional description available.";

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
          <v-flex d-flex>
            <v-text-field
              box
              v-model="selectedSearchTerm"
              label="Search"
              placeholder=" "
            ></v-text-field>
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
          </v-flex>
        </v-layout>
        <v-switch
          v-model="showMyVenues"
          :label="`My Venues`"
          color="white"
        ></v-switch>
        <div>
        <v-data-table
          :headers="headers"
          :items="filterTableData"
          :expand="expand"
          :rows-per-page-items="rowsPerPageItems"
          :pagination.sync="pagination"
          item-key="venueName"
          class="elevation-1"
          must-sort
          dark
          expand
        >
          <template v-slot:items="props">
            <tr @click="props.expanded = !props.expanded ; getVenueReviews(props.item, props.item.venueId)">
            <td>{{ props.item.venueName }}</td>
            <td class="text-xs-right">{{ props.item.category.categoryName }}</td>
            <td class="text-xs-right">{{ props.item.city }}</td>
            <td class="text-xs-right">{{ props.item.meanStarRating }}</td>
            <td class="text-xs-right">{{ props.item.modeCostRating }}</td>
            <td class="text-xs-right">{{ props.item.distance }}</td>
            <td><img height="200" width="200" :src="props.item.photo"></td>
            </tr>
          </template>

          <template v-slot:expand="props">
            <v-card color="#3f363f" class="padding">

              <v-layout row>
                <v-card-title class="uk-text-large">
                  {{props.item.venueName}}
                </v-card-title>
                <v-spacer align="end">
                  <v-btn
                    color="red"
                    @click="expandVenue = !expandVenue"
                  >Expand</v-btn>
                  <v-btn
                    color="red"
                    @click="expandVenue = !expandVenue"
                  >Add Review</v-btn>
                </v-spacer>
              </v-layout>

              <v-layout grid-list>

                <v-flex xs2>
                  <v-layout column>
                    <v-card-text>Category</v-card-text>
                    <v-card-text>Admin</v-card-text>
                    <v-card-text>City</v-card-text>
                    <v-card-text>Star Rating (mean)</v-card-text>
                    <v-card-text>Cost Rating (mode)</v-card-text>
                    <v-card-text>Address</v-card-text>
                    <v-card-text>Date Added</v-card-text>
                    <v-card-text>Description</v-card-text>
                  </v-layout>
                </v-flex>

                <v-flex>
                  <v-layout column>
                    <v-card-text>{{props.item.category.categoryName}}</v-card-text>
                    <v-card-text>{{props.item.admin.username}}</v-card-text>
                    <v-card-text>{{props.item.city}}</v-card-text>
                    <v-card-text>{{props.item.meanStarRating}}</v-card-text>
                    <v-card-text>{{props.item.modeCostRating}}</v-card-text>
                    <v-card-text>{{props.item.address}}</v-card-text>
                    <v-card-text>{{props.item.dateAdded.split('T')[0]}}</v-card-text>
                    <v-card-text>
                      {{props.item.shortDescription}}
                      <div v-if="expandVenue">
                        {{props.item.longDescription}}
                      </div>
                    </v-card-text>
                  </v-layout>
                </v-flex>

            </v-layout>

            <v-container v-if="expandVenue" grid-list-sm fluid>
              <v-layout row wrap>
                <v-flex
                  v-for="item in props.item.photos"
                  :key="item.photoFilename"
                  xs2
                  d-flex
                >
                  <v-card flat tile class="d-flex">
                    <v-img
                      :src="'http://localhost:4941/api/v1/venues/' + props.item.venueId + '/photos/' + item.photoFilename"
                      aspect-ratio="1"
                      class="grey lighten-2"
                    >
                      <template v-slot:placeholder>
                        <v-layout
                          fill-height
                          align-center
                          justify-center
                          ma-0
                        >
                          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                      </template>
                    </v-img>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>


            <v-container v-if="expandVenue">
              <v-card-title class="uk-text-large">Reviews</v-card-title>
              <div v-for="item in props.item.reviews">
                <v-card class="padding" style="margin: 10px" color="dark">
                  <v-layout grid-list>

                    <v-flex xs2>
                      <v-layout column>
                        <v-card-text>Reviewer</v-card-text>
                        <v-card-text>Star Rating</v-card-text>
                        <v-card-text>Cost Rating</v-card-text>
                        <v-card-text>Time Posted</v-card-text>
                        <v-card-text>Review</v-card-text>
                      </v-layout>
                    </v-flex>

                    <v-flex xs8>
                      <v-layout column>
                        <v-card-text>{{item.reviewAuthor.username}}</v-card-text>
                        <v-card-text>{{item.starRating}}</v-card-text>
                        <v-card-text>{{item.costRating}}</v-card-text>
                        <v-card-text>{{item.timePosted}}</v-card-text>
                        <v-card-text>{{item.reviewBody}}</v-card-text>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card>
              </div>
            </v-container>


            </v-card>
          </template>
        </v-data-table>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style scoped>

</style>
