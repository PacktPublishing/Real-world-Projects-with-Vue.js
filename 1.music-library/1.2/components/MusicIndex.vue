<template>
  <table class="table is-fullwidth is-striped is-hoverable is-narrow">
    <thead>
      <th style="width: 30%"><a @click="change_sort('artist')">Artist
        <fa-icon icon="chevron-up" v-if="sortBy == 'artist' && sortDirection == 'asc'" />
        <fa-icon icon="chevron-down" v-if="sortBy == 'artist' && sortDirection == 'desc'" /></a></th>
      <th style="width: 30%"><a @click="change_sort('title')">Title
        <fa-icon icon="chevron-up" v-if="sortBy == 'title' && sortDirection == 'asc'" />
        <fa-icon icon="chevron-down" v-if="sortBy == 'title' && sortDirection == 'desc'" /></a></th>
      <th style="width: 20%"><a @click="change_sort('album')">Album
        <fa-icon icon="chevron-up" v-if="sortBy == 'album' && sortDirection == 'asc'" />
        <fa-icon icon="chevron-down" v-if="sortBy == 'album' && sortDirection == 'desc'" /></a></th>
      <th style="width: 20%"><a @click="change_sort('genre')">Genre
        <fa-icon icon="chevron-up" v-if="sortBy == 'genre' && sortDirection == 'asc'" />
        <fa-icon icon="chevron-down" v-if="sortBy == 'genre' && sortDirection == 'desc'" /></a></th>
    </thead>

    <tbody v-for="(song, index) in sortedSongs" v-bind:key="index">
      <tr>
        <td>{{ song.artist }}</td>
        <td>{{ song.title }}</td>
        <td>{{ song.album }}</td>
        <td>{{ song.genre }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import MusicData from '@/assets/list.json'

export default {
  data () {
    return {
      songs: MusicData,
      sortBy: '',
      sortDirection: 'asc'
    }
  },
  computed: {
    sortedSongs () {
      if (this.sortBy === '') {
        return this.songs
      }

      let sortModifier = (this.sortDirection === 'asc') ? 1 : -1

      return this.songs.slice().sort((a, b) => {
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
    }
  }
}
</script>

<style>

</style>
