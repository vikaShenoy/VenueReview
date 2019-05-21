<script src="./Venues.js">

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
                    v-if="!userIsVenueAdmin(props.item.admin.userId) && userIsLoggedIn()"
                    @click="showReview = !showReview"
                  >Add Review</v-btn>
                  <Review
                    v-model="showReview"
                    :venueId="props.item.venueId"
                    :adminId="props.item.admin.userId"
                    :reviewers="props.item.reviews"></Review>
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
