<script>
  import 'material-design-icons-iconfont/dist/material-design-icons.css';
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
          { text: 'Photo', value: 'photoData' }
        ],
        unfilteredVenues: [],
        filteredVenues: [],
        cityList: [],
        categoryList: [],
        selectedSearchTerm: "",
        selectedCity: "",
        selectedCategory: ""
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
        return filteredVenues;
      }
    },
    methods: {
      setup() {
        let headers = {
          'X-Authorization': localStorage.getItem("authToken")
        };
        this.$http.get("http://localhost:4941/api/v1/venues", {
          headers: headers
        })
          .then(function(response) {
            this.getVenueDetails(response.body);
          }, function(error) {
            console.log(error);
          })
      },

      getVenueDetails(venues) {
        let headers = {
          'X-Authorization': localStorage.getItem("authToken")
        };
        let venueList = [];
        for (let i = 0 ; i < venues.length ; i++) {
          this.$http.get("http://localhost:4941/api/v1/venues/" + venues[i].venueId, {
            headers: headers
          })
            .then(function(response) {
              response.body.modeCostRating = venues[i].modeCostRating;

              // Split this up in to a new function
              // Handle default star and cost ratings
              if (venues[i].meanStarRating === null) {
                response.body.meanStarRating = 3;
              } else {
                response.body.meanStarRating = venues[i].meanStarRating;
              }

              if (venues[i].modeCostRating === null) {
                response.body.modeCostRating = 0;
              } else {
                response.body.modeCostRating = venues[i].modeCostRating;
              }

              // Populate drop down lists
              this.cityList.push(response.body.city);
              this.categoryList.push(response.body.category.categoryName);
              venueList.push(response.body);
            }, function(error) {
              console.log(error);
            })
        }
        this.cityList.unshift("");
        this.categoryList.unshift("");
        this.unfilteredVenues = venueList;
      },
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
            <td>
              <img :src="props.item.photoData">
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>

</template>

<style scoped>

</style>
