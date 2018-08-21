<template>
  <div class="columns">
    <div class="column is-3">
      <playlists addingEnabled @setActivePlaylists="set_active_playlists" />
    </div>

    <div class="column is-9">
      <h2 class="subtitle" v-if="activePlaylists.length > 0">Adding songs to
        <template v-for="(pl, index) in activePlaylists">
          <span class="has-text-weight-bold" v-bind:key="index">{{ pl.name }}<template v-if="index + 1 < activePlaylists.length">, </template></span></template>. Click on a song title to add it to your playlists.
      </h2>

      <search :songs="songs" @filteredSongs="filter_songs" />

      <table class="table is-fullwidth is-striped is-narrow is-hoverable">
        <sort :songs="filteredSongs" @sortedSongs="sort_songs" />

        <paginated :items="sortedSongs">
          <template slot="add_title" slot-scope="songList" v-if="activePlaylists.length > 0"><a @click="add_song(songList.song, $event.target)"><fa-icon icon="plus" /></a></template>
        </paginated>
      </table>
    </div>
  </div>
</template>

<script>
import MusicData from '@/assets/list.json'

import MusicSearch        from '@/components/MusicSearch'
import MusicSort          from '@/components/MusicSort'
import PaginatedTableBody from '@/components/PaginatedTableBody'
import Playlists          from '@/components/Playlists'

export default {
  components: {
    'search':    MusicSearch,
    'sort':      MusicSort,
    'paginated': PaginatedTableBody,
    'playlists': Playlists
  },
  data () {
    return {
      songs: MusicData,
      filteredSongs: MusicData,
      sortedSongs: MusicData,

      activePlaylists: []
    }
  },
  methods: {
    filter_songs (data) {
      this.filteredSongs = data
    },
    sort_songs (data) {
      this.sortedSongs = data
    },
    set_active_playlists (playlists) {
      this.activePlaylists = playlists
    },
    add_song (song, e) {
      e.closest("tr").classList.add('flash')
      setTimeout(() => e.closest("tr").classList.remove('flash'), 1000)

      this.activePlaylists.forEach((pl, index) => {
        this.activePlaylists[index].songs.push(song)
      })
    }
  }
}
</script>

<style scoped>
</style>
