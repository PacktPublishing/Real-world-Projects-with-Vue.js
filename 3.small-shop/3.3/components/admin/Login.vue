<template>
  <form @submit.prevent="login" class="container">
    <div class="field">
      <label class="label">Email</label>
      <div class="control">
        <input class="input" v-model="email" type="email">
      </div>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input class="input" v-model="password" type="password">
      </div>
    </div>
    <p v-if="error">{{ error }}</p>
    <div class="control">
      <button class="button is-primary" type="submit">Submit</button>
    </div>
  </form>
</template>

<script>
import 'firebase/auth'
import { FirebaseApp } from '@/library/Database'

let auth = FirebaseApp.auth()

export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    login () {
      auth.signInWithEmailAndPassword(this.email, this.password)
      .catch((error) => {
        this.error = error.message
      })

      auth.onAuthStateChanged((user) => {
        if (user) {
          this.$router.push('/admin/products')
        }
      })
    }
  }
}
</script>

<style>

</style>
