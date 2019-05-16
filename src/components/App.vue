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
    <Navigation></Navigation>
    <router-view/>

  </div>
</template>

