<script>
  export default {
    name: "Review.vue",
    props: {
      venueId: {},
      adminId: {},
      value: {},
      reviewers: {},
    },
    mounted: function() {
      console.log(this.reviewers);
    },
    data() {
      return {
        snackbar: false,
        snackbarText: "",
        reviewBody: "",
        reviewErrors: [],
        starRating: null,
        starRatingLabels: [1, 2, 3, 4, 5],
        costRating: null,
        costRatingLabels: ["Free", "$", "$$", "$$$", "$$$$"],
      }
    },
    methods: {
      showSnackbar(message) {
        this.snackbar = true;
        this.snackbarText = message;
      },
      addReview() {
        if (this.validateReviewBody()) return;
        // Check they're not admin of the venue
        console.log(localStorage.getItem("userId"));
        if (this.adminId.toString() === localStorage.getItem("userId")) {
          console.log("Admin and venue match");
          this.showSnackbar("Admin can't review their own venue.");
        }
        // Check they haven't written a review of the venue already

        let headers = {'X-Authorization': localStorage.getItem("authToken")};
        let body = {
          "reviewBody": this.reviewBody,
          "starRating": this.starRating + 1,
          "costRating": this.costRating + 1,
        };
        this.$http.post("http://localhost:4941/api/v1/venues/" + this.venueId + "/reviews", JSON.stringify(body), {headers: headers})
          .then(function(response) {
            console.log(response);
          }, function(error) {
            console.log(error);
          });
      },
      validateReviewBody() {
        this.reviewErrors = [];
        if (this.reviewBody.length === 0) {
          this.reviewErrors = ["Review body can't be empty"];
        }
        return this.reviewErrors.length;
      }
    }
  }
</script>

<template>

  <v-dialog persistent :value="value" @input="$emit('input')" width="500">
    <v-card class="uk-padding">

      <v-text-field
        v-model="reviewBody"
        label="Review Content"
        :error-messages="reviewErrors"
        @blur="validateReviewBody()"
      ></v-text-field>
      <v-card-text>Star Rating</v-card-text>
      <v-slider
        v-model="starRating"
        :tick-labels="starRatingLabels"
        :max="4"
        step="1"
        tick-size="2"
      ></v-slider>
      <v-card-text>Cost Rating</v-card-text>
      <v-slider
        v-model="costRating"
        :tick-labels="costRatingLabels"
        :max="4"
        step="1"
        tick-size="2"
      ></v-slider>
      <br>
      <v-spacer align="center">
      <v-btn color="blue darken-1" flat="flat"
             @click="addReview()"
      >Add Review</v-btn>
      <v-btn color="red darken-1" flat="flat"
             @click.native="$emit('input')"
      >Close</v-btn>
      </v-spacer>
    </v-card>
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
  </v-dialog>

</template>

<style scoped>

</style>
