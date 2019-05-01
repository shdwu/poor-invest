<template lang="pug">
body#app
  Header
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
