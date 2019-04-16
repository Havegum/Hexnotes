<template>
  <div id="app">
    <nav id="nav" class="navbar navbar-expand-sm navbar-dark bg-primary">
      <a class="navbar-brand" href="#">Hexnotes</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#expandedNavbar" aria-controls="expandedNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="expandedNavbar" class="collapse navbar-collapse">
        <ul class="navbar-nav">
          <li class="nav-item"><router-link class="nav-link" to="/">Map</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/calendar">Calendar</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/notes">Notes</router-link></li>
          <li class="nav-item"><router-link class="nav-link" to="/network">Network</router-link></li>
        </ul>
      </div>
    </nav>
    <div id="view">
      <div id="main">
        <router-view/>
      </div>
      <aside><p>In the future, there's gonna be a toolbar here</p></aside>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss">
body { overflow:hidden }
#app {
  font-family: 'Fira Sans Condensed', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

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
  }
}

</style>
