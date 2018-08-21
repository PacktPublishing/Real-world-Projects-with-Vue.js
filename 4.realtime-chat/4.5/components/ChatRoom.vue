<template>
  <div class="section container is-fluid">
    <div class="columns">
      <div class="column is-2"><rooms :selectedChatRoomSlug="selectedChatRoomSlug" @setActiveRoom="setActiveRoom" /></div>
      <div class="column is-8">
        <div class="chat-window">
          <div class="chat-history">
            <div class="chat-message" v-for="(message, i) in messages" :key="i">
              <div class="chat-message-meta">
                <p class="timestamp">{{ message.timestamp | time }}</p>
                <p class="user-name">{{ message.name }}</p>
              </div>
              <p>{{ message.message }}</p>
            </div>
          </div>
        </div>
        <div class="chat-actions">
          <form @submit.prevent="sendMessage">
            <div class="field has-addons">
              <p class="control is-expanded">
                <input v-model="chatMessage" type="text" placeholder="Your message" class="input" />
              </p>
              <button type="submit" class="button"><fa-icon icon="location-arrow" /></button>
            </div>
          </form>
        </div>
      </div>
      <div class="column is-2">
        <a class="button" @click="signout"><fa-icon icon="sign-out-alt" /> Sign out</a>
        <hr>
        <users :activeRoom="activeRoom" @kicked="kicked" />
      </div>
    </div>
  </div>
</template>

<script>
import { FirebaseDb, FirebaseAuth } from '@/library/Database'
import moment from 'moment'

import ChatRooms from '@/components/ChatRooms'
import ChatRoomUsers from '@/components/ChatRoomUsers'

export default {
  components: {
    rooms: ChatRooms,
    users: ChatRoomUsers
  },
  filters: {
    time (timestamp) {
      return moment.unix(timestamp).format('DD.MM.YYYY HH:mm:ss')
    }
  },
  data () {
    return {
      messages: [],
      activeRoom: {},
      chatMessage: '',

      selectedChatRoomSlug: this.$route.params.slug
    }
  },
  computed: {
    username () { return this.$store.state.username },
    uid () { return this.$store.state.uid }
  },
  methods: {
    sendMessage () {
      FirebaseDb.ref('messages/' + this.activeRoom.slug).push({
        userId: this.uid,
        name: this.username,
        message: this.chatMessage,
        timestamp: moment().unix()
      })

      this.chatMessage = ''
    },
    signout () {
      FirebaseAuth.signOut().then(() => {
        this.$router.push('/')
      })
    },
    setActiveRoom (room, oldRoom) {
      this.activeRoom = room
      this.initializeRoom(oldRoom)
    },
    initializeRoom (oldRoom = null) {
      this.messages = []

      if (oldRoom !== null) {
        FirebaseDb.ref('messages/' + oldRoom.slug).off()
      }

      FirebaseDb.ref('messages/' + this.activeRoom.slug).on('child_added', (data) => {
        this.messages.push(data.val())
      })
    },
    kicked () {
      this.$router.push('/chat/general')
    }
  },
  created () {
    this.initializeRoom()
  },
  beforeRouteUpdate (to, from, next) {
    this.selectedChatRoomSlug = to.params.slug
    next()
  }
}
</script>

<style scoped>
.chat-window {
  height: calc(100vh - 132px);
}

.chat-history {
  max-height: 100%;
  overflow-y: auto;
}

.chat-message {
  margin-bottom: 1em
}
.chat-message-meta, .chat-message-meta * {
  float: left;
}
.timestamp {
  margin-right: 0.5em;
  color: #999;
  font-size: 80%;
}
.user-name {
  font-weight: bold;
  margin-right: 1em;
}
</style>
