<template>
  <table class="table is-fullwidth is-striped is-hoverable is-narrow">
    <sort :songs="songs" @sortedSongs="sort_songs" />

    <paginated :items="sortedSongs" />
  </table>
</template>

<script>
import MusicData from '@/assets/list.json'

import MusicSort          from '@/components/MusicSort'
import PaginatedTableBody from '@/components/PaginatedTableBody'

export default {
  components: {
    'sort':      MusicSort,
    'paginated': PaginatedTableBody
  },
  data () {
    return {
      songs: MusicData
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
