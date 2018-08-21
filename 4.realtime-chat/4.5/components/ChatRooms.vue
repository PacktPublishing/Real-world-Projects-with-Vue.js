<template>
  <aside class="menu">
    <p class="menu-label">Rooms</p>

    <ul class="menu-list">
      <li v-for="room in rooms" :key="room.slug"><router-link :to="'/chat/' + room.slug" :class="{ 'is-active': selectedChatRoomSlug === room.slug }">{{ room.name }}</router-link></li>
    </ul>

    <hr>
    <p v-if="!addingRoom"><a class="button is-primary" @click="addingRoom = true"><fa-icon icon="plus" /> Create new channel</a></p>

    <form @submit.prevent="addRoom" v-if="addingRoom">
      <div class="field has-addons">
        <input type="text" class="input" placeholder="New playlist" v-model="newRoomName">
        <p class="control"><button type="submit" class="button is-success"><fa-icon icon="plus" /> Add</button></p>
      </div>
    </form>
  </aside>
</template>

<script>
import { FirebaseDb } from '@/library/Database'

export default {
  props: {
    selectedChatRoomSlug: {
      type: String,
      required: true,
      default: 'general'
    }
  },
  data () {
    return {
      rooms: [{
        name: 'General',
        slug: 'general',
        owner: null
      }],
      addingRoom: false,

      newRoomName: ''
    }
  },
  computed: {
    uid () { return this.$store.state.uid }
  },
  watch: {
    selectedChatRoomSlug (slug, oldSlug) {
      this.$emit('setActiveRoom', this.rooms.find(room => room.slug === slug), this.rooms.find(room => room.slug === oldSlug))
    }
  },
  methods: {
    addRoom () {
      if (this.newRoomName === '') {
        return
      }

      let newRoom = {
        name: this.newRoomName,
        slug: this.slugify(this.newRoomName),
        owner: this.uid
      }

      FirebaseDb.ref('rooms/' + newRoom.slug).set(newRoom)

      this.newRoomName = ''
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
    FirebaseDb.ref('rooms').on('child_added', (data) => {
      this.rooms.push(data.val())

      if (this.selectedChatRoomSlug === data.val().slug) {
        this.$emit('setActiveRoom', this.rooms.find(room => room.slug === data.val().slug))
      }
    })

    FirebaseDb.ref('rooms').on('child_removed', (data) => {
      this.rooms.splice(this.rooms.findIndex(room => room.slug === data.val().slug), 1)
    })

    if (this.selectedChatRoomSlug === 'general') {
      this.$emit('setActiveRoom', this.rooms.find(room => room.slug === this.selectedChatRoomSlug))
    }
  }
}
</script>

<style>

</style>
