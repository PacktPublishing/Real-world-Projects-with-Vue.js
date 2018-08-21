<template>
  <nav class="panel">
    <p class="panel-block" v-bind:class="{'is-active': selectedPlaylistSlug === undefined}">
      <router-link to="/">All songs</router-link>
    </p>
    
    <p class="panel-heading">Playlists</p>

    <template v-for="(playlist, index) in playlists">
      <div class="panel-block playlist-item" v-bind:key="playlist.slug" v-bind:class="{'is-active': selectedPlaylistSlug === playlist.slug}">
        <router-link v-if="!playlist.editing" :to="'/playlist/' + playlist.slug" class="panel-block"><span class="panel-icon"><fa-icon icon="book" /></span> {{ playlist.name }}</router-link>
        <form class="panel-block" v-if="playlist.editing" @submit.prevent="edit_playlist(index)">
          <div class="field has-addons">
            <input type="text" class="input" v-model="playlist.name">
            <p class="control"><button type="submit" class="button is-success"><fa-icon icon="check" /></button></p>
          </div>
        </form>
        
        <span>
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              <a aria-haspopup="true" aria-controls="dropdown-menu"><fa-icon icon="chevron-down" /></a>
            </div>
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <a class="dropdown-item" title="Rename playlist" @click="edit_playlist(index)"><fa-icon icon="edit" /> Rename</a>
                <a class="dropdown-item" title="Delete playlist" @click="delete_playlist(index)"><fa-icon icon="trash-alt" /> Delete</a>
              </div>
            </div>
          </div>

          <template v-if="addingEnabled">
            <a v-if="!playlist.adding" @click="add_songs(index)" title="Add songs"><fa-icon icon="plus" /></a>
            <a v-if="playlist.adding" @click="add_songs(index)" title="Disable adding songs"><fa-icon icon="check-square" /></a>
          </template>
        </span>
      </div>
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
        editing: false,
        songs: []
      })

      this.newPlaylistName = ''
    },
    add_songs (index) {
      this.playlists[index].adding = !this.playlists[index].adding

      this.$emit('setActivePlaylists', this.playlists.filter(pl => pl.adding === true))
    },
    delete_playlist (index) {
      this.playlists.splice(index, 1)
    },
    edit_playlist (index) {
      this.playlists[index].editing = !this.playlists[index].editing
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
          this.playlists[index].editing = false
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
