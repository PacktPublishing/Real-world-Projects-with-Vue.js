<template>
  <div id="app">
    <nav class="navbar" role="navigation">
      <div class="container">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-item">Ye Artisanal Bread Shoppe</router-link>
        </div>
        
        <div class="navbar-menu">
          <div class="navbar-end">
            <router-link to="/cart" class="navbar-item"><fa-icon icon="shopping-cart" /> Cart {{ total | price }}</router-link>
          </div>
        </div>
      </div>
    </nav>

    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    total () {
      return this.$store.getters.totalItems
    }
  }
}
</script>

<style>
html {
  height: 100%;
  background-color: #f9f9f9;
}
</style>
