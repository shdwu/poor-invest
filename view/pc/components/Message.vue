<template lang="pug">
  div#message(v-if='errors || success')
    .alert.alert-danger.alert-dismissible.fade.show(role='alert' v-for='error in errors')
      | {{error.msg}}
      button.close(type='button' data-dismiss='alert' aria-label="Close")
        span(aria-hidden="true") &times;
    .alert.alert-success.alert-dismissible.fade.show(role='alert' v-for='succ in success')
      | {{succ.msg}}
      button.close(type='button' data-dismiss='alert' aria-label="Close")
        span(aria-hidden="true") &times;
</template>

<script>
export default {
  data() {
    return {
      errors: {},
      success: {}
    }
  },
  created() {
    this.$bus.on('errors', this.showError);
    this.$bus.on('success', this.showSuccess);
  },
  methods: {
    showError(err) {
      this.errors = err;
    },
    showSuccess(success) {
      this.success = success;
    }
  }
}
</script>
