<template>
  <p class="control has-icons-left">
    <input type="text" class="input" placeholder="Search for song titles ..." v-model="searchInput" />

    <span class="icon is-small is-left"><fa-icon icon="search" /></span>
  </p>
</template>

<script>
import MusicWorker from '@/music.worker'

let worker = {}

export default {
  props: {
    songs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      searchInput: ''
    }
  },
  watch: {
    songs () {
      this.search('')
    },
    searchInput (searchTerm) {
      this.search(searchTerm)
    }
  },
  methods: {
    search (searchTerm) {
      if (searchTerm === '') {
        this.$emit('filteredSongs', this.songs)
        return
      }

      if (worker.terminate !== undefined) {
        worker.terminate()
      }

      worker = new MusicWorker()

      worker.postMessage({ search: searchTerm, songs: this.songs })

      worker.onmessage = (m) => {
        this.$emit('filteredSongs', m.data.filteredSongs)
      }
    }
  }
}
</script>

<style>

</style>
