<template lang="pug">
body#app
  Header
  .wrapper
    router-view
  Footer
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="sass" scoped>
  .wrapper {
    padding-bottom: 50px
  }
</style>

