<template>
  <div>
    <form id="search" @submit.prevent="search">
      <div class="field has-addons">
        <p class="control is-expanded has-icon has-icon-left">
          <input type="text" class="input" placeholder="Search for shows ..." v-model="searchInput" />

          <span class="icon is-small"><fa-icon icon="search" /></span>
        </p>
        <p class="control"><button type="submit" class="button is-success"><fa-icon icon="search" /></button></p>
      </div>
    </form>

    <a @click="clear_search" v-if="searchResult.length > 0" class="pull-left">Clear search <fa-icon icon="times" /></a>

    <p v-if="searchError">No results found.</p>

    <div class="columns is-multiline">
      <div class="column is-2" v-for="show in searchResult" :key="show.show.id">
        <div class="card">
          <div class="card-image">
            <router-link :to="'/shows/' + show.show.id"><img v-if="show.show.image" v-bind:src="show.show.image.medium" v-bind:alt="show.show.name" /></router-link>
          </div>
          <div class="card-content">
            <p class="title is-4"><router-link :to="'/shows/' + show.show.id">{{ show.show.name }}</router-link></p>
            <p class="subtitle is-6" v-if="show.show.network">Running on <span>{{ show.show.network.name }}</span></p>
          </div>
          <div class="card-footer">
            <div class="card-footer-item">
              <a><fa-icon icon="rss" /> Subscribe</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Fetch from '@/library/Fetch'

export default {
  props: {
    is_subscribed: {
      type: Function
    }
  },
  data () {
    return {
      searchInput: '',
      searchResult: [],
      searchError: false
    }
  },
  methods: {
    search () {
      this.searchResult = []
      this.searchError = false

      Fetch.get('search/shows?q=' + this.searchInput)
      .then(resp => {
        if (resp.length > 0) {
          this.searchResult = resp
        } else {
          this.searchError = true
        }
      })
    },
    clear_search () {
      this.searchInput  = ''
      this.searchError  = false
      this.searchResult = []
    },
    subscribe (show) {
      this.$emit('subscribe', show)
    }
  }
}
</script>

<style>
#search {
  padding: 1em 0;
}
</style>
