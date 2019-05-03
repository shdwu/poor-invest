<template lang="pug">
body#app
  Header
  .wrapper
    Message(@errors="errors = $event")
    router-view
  Footer
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Message from "./components/Message.vue";

export default {
  components: {
    Header,
    Footer,
    Message
  }
}
</script>

<style lang="sass" scoped>
  .wrapper {
    padding-bottom: 50px
  }
</style>

