<template>
  <nav class="panel">
    <a class="panel-block" v-bind:class="{'is-active': selectedPlaylistSlug === undefined}">
      <router-link to="/">All songs</router-link>
    </a>
    
    <p class="panel-heading">Playlists</p>

    <template v-for="(playlist, index) in playlists">
      <p class="panel-block" v-bind:key="playlist.slug" v-bind:class="{'is-active': selectedPlaylistSlug === playlist.slug}">
        <router-link :to="'/playlist/' + playlist.slug"><span class="panel-icon"><fa-icon icon="book" /></span> {{ playlist.name }}</router-link>
      </p>
    </template>

    <div class="panel-block">
      <form @submit.prevent="add_playlist">
        <div class="field has-addons">
          <input type="text" class="input" placeholder="New playlist" v-model="newPlaylistName">
          <p class="control"><button type="submit" class="button is-success"><fa-icon icon="plus" /> Add</button></p>
        </div>
      </form>
    </div>
  </nav>
</template>

<script>
import localforage from 'localforage'

export default {
  props: {
    setPlaylist: {
      type: Function,
      required: false
    },
    selectedPlaylistSlug: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      newPlaylistName: '',
      playlists: []
    }
  },
  watch: {
    playlists: {
      handler (playlists) {
        localforage.setItem('playlists', playlists)
      },
      deep: true
    },
    selectedPlaylistSlug (slug) {
      this.setPlaylist(this.playlists.find(pl => {
        return pl.slug === slug
      }))
    }
  },
  methods: {
    add_playlist () {
      this.playlists.push({
        name: this.newPlaylistName,
        slug: this.slugify(this.newPlaylistName),
        songs: []
      })

      this.newPlaylistName = ''
    },
    slugify (name) {
      return name.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')         // Replace spaces with -
        .replace(/&/g, '-and-')       // Replace & with 'and'
        .replace(/[^\w-]+/g, '')      // Remove all non-word chars
        .replace(/--+/g, '-')         // Replace multiple - with single -
    }
  },
  created () {
    localforage.getItem('playlists')
    .then(data => {
      if (data !== null) {
        this.playlists = data
      }
    })
    .then(() => {
      if (this.selectedPlaylistSlug !== undefined) {
        this.setPlaylist(this.playlists.find(pl => {
          return pl.slug === this.selectedPlaylistSlug
        }))
      }
    })
  }
}
</script>

<style>

</style>
