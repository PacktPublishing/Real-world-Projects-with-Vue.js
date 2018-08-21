<template>
  <div class="columns">
    <div class="column is-3">
      <playlists />
    </div>

    <div class="column is-9">
      <table class="table is-fullwidth is-striped is-hoverable is-narrow">
        <sort :songs="songs" @sortedSongs="sort_songs" />

        <paginated :items="sortedSongs" />
      </table>
    </div>
  </div>
</template>

<script>
import MusicData from '@/assets/list.json'

import MusicSort          from '@/components/MusicSort'
import PaginatedTableBody from '@/components/PaginatedTableBody'

import Playlists from '@/components/Playlists'

export default {
  components: {
    'sort':      MusicSort,
    'paginated': PaginatedTableBody,
    'playlists': Playlists
  },
  data () {
    return {
      songs: MusicData,
      sortedSongs: MusicData
    }
  },
  methods: {
    sort_songs (data) {
      this.sortedSongs = data
    }
  }
}
</script>

<style>

</style>
