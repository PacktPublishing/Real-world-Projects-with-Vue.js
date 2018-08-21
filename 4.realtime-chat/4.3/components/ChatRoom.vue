<template>
  <div class="section container is-fluid">
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
</template>

<script>
import { FirebaseDb } from '@/library/Database'
import moment from 'moment'

export default {
  filters: {
    time (timestamp) {
      return moment.unix(timestamp).format('DD.MM.YYYY HH:mm:ss')
    }
  },
  data () {
    return {
      messages: [],
      activeRoom: {
        name: 'General',
        slug: 'general'
      },
      chatMessage: '',
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
    initializeRoom () {
      FirebaseDb.ref('messages/' + this.activeRoom.slug).on('child_added', (data) => {
        this.messages.push(data.val())
      })
    }
  },
  created () {
    this.initializeRoom()
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
