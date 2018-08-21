<template>
  <nav class="panel">
    <p class="panel-block" v-bind:class="{'is-active': selectedPlaylistSlug === undefined}">
      <router-link to="/">All songs</router-link>
    </p>
    
    <p class="panel-heading">Playlists</p>

    <template v-for="(playlist, index) in playlists">
      <p class="panel-block playlist-item" v-bind:key="playlist.slug" v-bind:class="{'is-active': selectedPlaylistSlug === playlist.slug}">
        <router-link :to="'/playlist/' + playlist.slug" class="panel-block"><span class="panel-icon"><fa-icon icon="book" /></span> {{ playlist.name }}</router-link>
        
        <template v-if="addingEnabled">
          <a v-if="!playlist.adding" @click="add_songs(index)" title="Add songs"><fa-icon icon="plus" /></a>
          <a v-if="playlist.adding" @click="add_songs(index)" title="Disable adding songs"><fa-icon icon="check-square" /></a>
        </template>
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
    addingEnabled: {
      type: Boolean,
      default: false,
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
      this.$emit('setPlaylist', this.playlists.find(pl => pl.slug === slug))
    }
  },
  methods: {
    add_playlist () {
      this.playlists.push({
        name: this.newPlaylistName,
        slug: this.slugify(this.newPlaylistName),
        adding: false,
        songs: []
      })

      this.newPlaylistName = ''
    },
    add_songs (index) {
      this.playlists[index].adding = !this.playlists[index].adding

      this.$emit('setActivePlaylists', this.playlists.filter(pl => pl.adding === true))
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

        this.playlists.forEach((pl, index) => {
          this.playlists[index].adding = false
        })
      }
    })
    .then(() => {
      if (this.selectedPlaylistSlug !== undefined) {
        this.$emit('setPlaylist', this.playlists.find(pl => pl.slug === this.selectedPlaylistSlug))
      }
    })
  }
}
</script>

<style>
@media (min-width: 769px) {
  nav {
    position: fixed;
  }
}
@media (max-width: 1215px) {
  nav {
    width: inherit;
  }
}

.playlist-item {
  justify-content: space-between
}
</style>
