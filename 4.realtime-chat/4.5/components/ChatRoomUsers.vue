<template>
  <aside class="menu">
    <p class="menu-label">Online now</p>
    <ul class="menu-list">
      <li v-for="user in users" :key="user.uid">
        <p>{{ user.name }} <fa-icon icon="crown" v-if="isOwner(user.uid)" />
          <span class="is-pulled-right" v-if="isOwner(uid) && uid != user.uid">
            <a class="is-pulled-left" @click="kickUser(user)"><fa-icon icon="times-circle" /></a>
          </span>
        </p>
      </li>
    </ul>
  </aside>
</template>

<script>
import { FirebaseDb } from '@/library/Database'

export default {
  props: {
    activeRoom: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      users: []
    }
  },
  computed: {
    username () { return this.$store.state.username },
    uid () { return this.$store.state.uid }
  },
  watch: {
    activeRoom (room, oldRoom) {
      this.changeRoom(room, oldRoom)
    }
  },
  methods: {
    changeRoom (room, oldRoom = null) {
      this.users = []

      if (oldRoom.slug !== undefined) {
        FirebaseDb.ref('users_rooms').child(oldRoom.slug).off()
        FirebaseDb.ref('users_rooms').child(oldRoom.slug).child(this.uid).remove()
      }

      FirebaseDb.ref('users_rooms').child(room.slug).child(this.uid).set({
        name: this.username,
        uid: this.uid
      })
      FirebaseDb.ref('users_rooms').child(room.slug).child(this.uid).onDisconnect().remove()

      FirebaseDb.ref('users_rooms').child(room.slug).on('child_added', (data) => {
        this.users.push({
          name: data.val().name,
          uid: data.key
        })
      })

      FirebaseDb.ref('users_rooms').child(room.slug).on('child_removed', (data) => {
        this.users.splice(this.users.findIndex(user => user.uid === data.key), 1)

        if (data.key === this.uid) {
          this.$emit('kicked')
        }
      })
    },
    isOwner (uid) {
      return this.activeRoom.owner === uid
    },
    kickUser (user) {
      FirebaseDb.ref('users_rooms').child(this.activeRoom.slug).child(user.uid).remove()
    }
  }
}
</script>

<style scoped>
li p {
  padding: 0.5em;
}
</style>
