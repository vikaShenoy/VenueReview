<script>
  import NavBar from '../components/Navbar.vue';

  export default {
    name: 'app',
    components: {
      'Navigation': NavBar,
    }
  }
</script>

<template>
  <div id="app">
    <img src="../assets/logo.png">
    <router-view/>
    <Navigation></Navigation>
    <router-view></router-view>

  </div>
</template>

