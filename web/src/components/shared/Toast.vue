<template>
  <div class="toast align-items-center text-white bg-primary border-0 mt-3"
       :class="{ 'show': showToast, 'bg-primary': !isError, 'bg-danger': isError }"
       role="alert"
       aria-live="assertive"
       aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">
        {{ toastMessage }}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'

export default {
  name: 'Toast',
  computed: {
    ...mapState({
      toast: state => state.toast
    })
  },
  data () {
    return {
      toastMessage: '',
      showToast: false,
      isError: false,
      timeout: null
    }
  },
  methods: {
    
  },
  watch: {
    toast (toast) {
      this.toastMessage = toast.toastMessage
      this.isError = toast.isError
      this.showToast = true

      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        this.showToast = false
      }, 5000)
    }
  }
}
</script>

<style scoped>
  .toast {
    width: auto;
    min-width: 350px;
    
    position: fixed;
    left: 50%;
    transform: translateX(calc(-50% + 120px));
  }
</style>