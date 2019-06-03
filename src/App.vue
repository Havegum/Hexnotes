<template>
  <div id="app">
    <nav id="nav" class="navbar navbar-expand-sm navbar-dark bg-primary">
      <a class="navbar-brand" href="#">
         <img src="./assets/logo-white.svg" width="30" height="30" class="d-inline-block align-top" alt="">
         Hexnotes
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#expandedNavbar" aria-controls="expandedNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="expandedNavbar" class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item"><router-link class="nav-link" to="/"><i class="fas fa-map"></i> Map</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/calendar"><i class="fas fa-calendar-alt"></i> Calendar</router-link></li>
          <li class="nav-item"><router-link class="nav-link disabled" to="/notes"><i class="fas fa-feather-alt"></i> Notes</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/network"><i class="fab fa-hubspot"></i> Network</router-link></li>
          <li class="nav-item"><router-link class="nav-link disabled" to="/inventory"><i class="fas fa-box"></i> Inventory</router-link></li>
        </ul>
      </div>
    </nav>
    <div id="view">
      <div id="main">
        <router-view/>
      </div>
      <PersonInspector v-if="inspected.isPerson"/>
      <FactionInspector v-else-if="inspected.isFaction"/>
      <NetworkInspector v-else/>
    </div>
  </div>
</template>

<script>
import store from '@/store.js';
import NetworkInspector from '@/inspectors/NetworkInspector.vue';
import PersonInspector from '@/inspectors/PersonInspector.vue';
import FactionInspector from '@/inspectors/FactionInspector.vue';

export default {
  store,
  computed: {
    inspected () {
      return this.$store.state.inspected || undefined;
    }
  },
  components: {
    NetworkInspector,
    PersonInspector,
    FactionInspector
  }
};
</script>

<style lang="scss">
body { overflow: hidden }
#app {
  font-family: 'Fira Sans Condensed', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

#nav a.router-link-exact-active {
  color: white;
}

#view {
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: row;

  #main {
    position: relative;
    flex-grow: 1;
  }

  aside {
    flex-grow: 0;
    background-color: #e3e3e3;
    max-width: 25%;
    width: 100%;
    padding: .5em;
    // TODO: overflow y
  }
}

</style>
