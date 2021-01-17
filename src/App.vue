<template>
  <div id="app">
    <Sidebar class="sidebar"/>
    <router-view class="content"/>
  </div>
</template>

<script>
// import 'bootstrap/dist/css/bootstrap.css'
import './assets/styles.css'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 15em;
}

.content {
  margin-left: 15em;
  padding: 5em;
}
</style>
