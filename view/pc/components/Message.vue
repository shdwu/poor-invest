<template lang="pug">
  div#message(v-if='errors && errors.length')
    .alert.alert-danger.alert-dismissible.fade.show(role='alert' v-for='error in errors')
      | {{error.msg}}
      button.close(type='button' data-dismiss='alert' aria-label="Close")
        span(aria-hidden="true") &times;
</template>

<script>
export default {
  data() {
    return {
      errors: {}
    }
  },
  created() {
    this.$bus.on('errors', this.showMessage)
  },
  methods: {
    showMessage(err) {
      this.errors = err.response.data.errors;
    }
  }
}
</script>
