<script>
  export default {
    data() {
      return {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: ""
      }
    },
    mounted: function() {
      console.log("Mounting complete.");
    },
    methods: {}
  }
</script>

<template>

  <div>
    <v-app>
      <v-container>

        <v-card id="signup" class="card">
          <h2 class="headings">Sign Up</h2>
        </v-card>

        <v-card>
          <v-text-field
            v-model="firstName"
            label="First Name"
          ></v-text-field>

          <v-text-field
            v-model="lastName"
            label="Last Name"
          ></v-text-field>

          <v-text-field
            v-model="username"
            label="Username"
          ></v-text-field>

          <v-text-field
            v-model="email"
            label="Email"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
          ></v-text-field>
        </v-card>

      </v-container>
    </v-app>
  </div>

</template>

<style lang="css" scoped>
  #signup {
    align-self: center;
    padding: 20px;
    background: powderblue;
  }
  .headings {
    color:black;
    font-family: 'Roboto', sans-serif;
  }

</style>


