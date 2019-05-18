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
        console.log(this.selectedCity);
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
              response.body.meanStarRating = venues[i].meanStarRating;
              response.body.modeCostRating = venues[i].modeCostRating;
              this.cityList.push(response.body.city);
              this.categoryList.push(response.body.category.categoryName);
              venueList.push(response.body);
            }, function(error) {
              console.log(error);
            })
        }
        this.unfilteredVenues = venueList;
        //this.getCategories();
      },

      getCities() {
        console.log(10);
        let venues = this.unfilteredVenues;
        console.log(this.unfilteredVenues);
        this.cityList = venues.map(venue => venue.city);
        this.cityList.unshift("");
        console.log(this.cityList);
      },

      getCategories() {
        let venues = this.unfilteredVenues;
        this.categoryList = venues.map(venue => venue.category.categoryName);
        this.categoryList.unshift("");
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
              solo
              :items="cityList"
              label="City"
              v-model="selectedCity"
            ></v-select>
            <v-select
              solo
              :items="categoryList"
              label="Category"
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
          class="elevation-1"
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
