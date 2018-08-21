<template>
  <div class="columns">
    <div class="column is-3">
      <playlists :selectedPlaylistSlug="selectedPlaylistSlug" @setPlaylist="set_playlist" />
    </div>

    <div class="column is-9">
      <table class="table is-fullwidth is-striped is-narrow is-hoverable">
        <sort :songs="songs" @sortedSongs="sort_songs" />

        <paginated :items="sortedSongs"></paginated>
      </table>
    </div>
  </div>
</template>

<script>
import MusicSort          from '@/components/MusicSort'
import PaginatedTableBody from '@/components/PaginatedTableBody'
import Playlists          from '@/components/Playlists'

export default {
  components: {
    'sort':      MusicSort,
    'paginated': PaginatedTableBody,
    'playlists': Playlists
  },
  data () {
    return {
      selectedPlaylist: {},
      selectedPlaylistSlug: this.$route.params.slug,
      songs: [],
      sortedSongs: []
    }
  },
  methods: {
    sort_songs (data) {
      this.sortedSongs = data
    },
    set_playlist (playlist) {
      this.selectedPlaylist = playlist
      this.songs = playlist.songs
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.selectedPlaylistSlug = to.params.slug
    next()
  }
}
</script>

<style>

</style>
