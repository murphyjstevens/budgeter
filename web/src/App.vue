<template>
  <Sidebar class="sidebar-wrapper"></Sidebar>

  <div class="content-wrapper">
    <Toast></Toast>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-dialog">
        <div class="spinner-border" role="status">
          <span>Loading...</span>
        </div>
      </div>
    </div>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Sidebar from './components/Sidebar.vue'
import Toast from './components/shared/Toast.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    Toast
  },
  computed: {
    ...mapState({
      isLoading: state => state.isLoading
    })
  }
}
</script>

<style scoped lang="scss">
  .sidebar-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 15em;
  }

  .content-wrapper {
    margin-left: 15em;
  }

  .content {
    padding: 5em;
  }

  .loading-overlay {
    display: flex;
    flex-direction: column;
    position: absolute;
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    align-items: center;
    justify-content: center;
  }

  .loading-dialog {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    border-radius: 10px;
    background-color: white;
    width: 300px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8px;
  }

  .loading-message {
    margin-top: 0.5em;
  }
</style>
