<template>
  <tbody>
    <template v-for="(song, index) in paginatedItems">
    <tr v-bind:key="index">
      <td>{{ song.artist }}</td>
      <td>{{ song.title }}</td>
      <td>{{ song.album }}</td>
      <td>{{ song.genre }}</td>
    </tr>
    </template>
  </tbody>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    per_page: {
      type: Number,
      required: false,
      default: 50
    }
  },
  data () {
    return {
      page: 1
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.items.length / this.per_page)
    },
    paginatedItems () {
      return this.items.slice(0, this.page * this.per_page)
    }
  },
  created () {
    window.addEventListener('scroll', e => {
      if (this.page >= this.totalPages) return
      if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100) {
        this.page++
      }
    })
  },
  watch: {
    items () {
      this.page = 1
    }
  }
}
</script>
