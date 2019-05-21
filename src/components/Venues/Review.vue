<script>
  export default {
    name: "Review.vue",
    props: {
      venueId: {},
      adminId: {},
      value: {},
    },
    data() {
      return {
        showError: false,
        errorMessage: "",
        reviewBody: "",
        reviewErrors: [],
        starRating: null,
        starRatingLabels: [1, 2, 3, 4, 5],
        costRating: null,
        costRatingLabels: ["Free", "$", "$$", "$$$", "$$$$"],
      }
    },
    methods: {
      /**
       * Show a v-alert component with an error message.
       * @param message text to be displayed in the error message.
       */
      showErrorMessage(message) {
        this.showError = true;
        this.errorMessage = message;
      },

      /**
       * Get the review data the user has input.
       * Check it's valid.
       * Send a post request to add the review.
       */
      addReview() {
        if (this.validateReviewBody()) return;
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
            if (error.status === 403) {
              this.showErrorMessage("Can't review the same venue twice!")
            }
          });
      },

      /**
       * Show an error message if the user has not
       * entered a review body.
       * @returns {number}
       */
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

      <v-alert
        :value="showError"
        type="error"
      >
        {{ this.errorMessage }}
      </v-alert>

      <v-spacer align="center">
      <v-btn color="blue darken-1" flat="flat"
             @click="addReview()"
      >Add Review</v-btn>
      <v-btn color="red darken-1" flat="flat"
             @click.native="showError = false ; $emit('input')"
      >Close</v-btn>
      </v-spacer>

    </v-card>
  </v-dialog>
</template>
<style scoped>
</style>
