import 'material-design-icons-iconfont/dist/material-design-icons.css';
let rootUrl = "http://localhost:4941/api/v1";
import Review from "./Review.vue";
import AddVenue from "./AddVenue.vue";
export default {
  components: {Review, AddVenue},
  data () {
    return {
      name: "Venues.vue",
      rowsPerPageItems: [10],
      showReview: false,
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
      showAddVenue: false,
      venuePhoto: null,
      imageType: "",
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
      filteredVenues.sort((a, b) => b.meanStarRating - a.meanStarRating);
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
     * Get reviews for an item (venue) from the server.
     * @param item venue to retrieve venues for.
     * @param venueId id of the venue to use in the request.
     */
    getVenueReviews(item, venueId) {
      let headers = {'X-Authorization': localStorage.getItem("authToken")};
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
      let url = rootUrl + "/venues?sortBy=STAR_RATING";
      if (this.latitude != null) url += "&myLatitude=" + this.latitude + "&myLongitude=" + this.longitude;
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
    userIsVenueAdmin(adminId) {
      return localStorage.getItem("userId") === adminId.toString();
    },
    userIsLoggedIn() {
      return localStorage.getItem("authToken") !== 'null'
    },

    /**
     * Called when the user uses the input to choose a file.
     * Load the image data and store it to be sent to server.
     * @param event input file change event.
     */
    onFileChanged(event) {
      console.log("File change event called");
      let file = event.target.files[0];
      let reader = new FileReader();
      this.imageType = file.type;
      this.venuePhoto = file;
    },

    uploadVenuePhoto(venueId) {
      console.log("Upload photo func called");
/*      const formData = new FormData();
      formData.append('photo', this.venuePhoto, this.venuePhoto.name);
      formData.append('description', 'Photo of a venue.');
      formData.append('makePrimary', 'false');
      let headers = {'X-Authorization': localStorage.getItem("authToken")};
      this.$http.post("http://localhost:4941/api/v1/venues/" + venueId + "/photos", formData,{headers: headers})
        .then(function(response) {
          this.getAllVenues();
        }, function(error) {
          console.log(error);
        });*/
    },

    deletePhoto(venueId, photoFilename) {
      console.log("Delete called");
/*      console.log(venueId);
      let headers = {'X-Authorization': localStorage.getItem("authToken")};
      this.$http.delete("http://localhost:4941/api/v1/venues/" + venueId + "/photos/" + photoFilename,
        {headers: headers})
        .then(function(response) {
          this.getAllVenues();
        }, function(error) {
          console.log(error);
        });*/
    }
  },
}
