<template>
  <thead>
    <th style="width: 30%">
      <a @click="change_sort('artist')">Artist
      <fa-icon icon="chevron-up" v-if="sortBy == 'artist' && sortDirection == 'asc'" />
      <fa-icon icon="chevron-down" v-if="sortBy == 'artist' && sortDirection == 'desc'" /></a>
    </th>
    <th style="width: 30%">
      <a @click="change_sort('title')">Title
      <fa-icon icon="chevron-up" v-if="sortBy == 'title' && sortDirection == 'asc'" />
      <fa-icon icon="chevron-down" v-if="sortBy == 'title' && sortDirection == 'desc'" /></a>
    </th>
    <th style="width: 20%">
      <a @click="change_sort('album')">Album
      <fa-icon icon="chevron-up" v-if="sortBy == 'album' && sortDirection == 'asc'" />
      <fa-icon icon="chevron-down" v-if="sortBy == 'album' && sortDirection == 'desc'" /></a>
    </th>
    <th style="width: 20%">
      <a @click="change_sort('genre')">Genre
      <fa-icon icon="chevron-up" v-if="sortBy == 'genre' && sortDirection == 'asc'" />
      <fa-icon icon="chevron-down" v-if="sortBy == 'genre' && sortDirection == 'desc'" /></a>
    </th>
  </thead>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      sortBy: '',
      sortDirection: 'asc'
    }
  },
  watch: {
    songs () {
      this.sort_songs()
    }
  },
  methods: {
    change_sort (column) {
      if (this.sortBy === column && this.sortDirection === 'asc') {
        this.sortDirection = 'desc'
      } else {
        this.sortDirection = 'asc'
      }

      this.sortBy = column

      this.sort_songs() // <<<< !!!
    },
    sort_songs (column) {
      if (this.sortBy === "") {
        this.$emit('sortedSongs', this.songs)
        return
      }

      let sortModifier = (this.sortDirection === 'asc') ? 1 : -1

      let sortedSongs = this.songs.slice().sort((a, b) => {
        let colA = a[this.sortBy].toUpperCase()
        let colB = b[this.sortBy].toUpperCase()

        if (colA < colB) {
          return -1 * sortModifier
        }
        if (colA > colB) {
          return 1 * sortModifier
        }

        return 0
      })

      this.$emit('sortedSongs', sortedSongs)
    }
  }
}
</script>

<style>

</style>
