<template>
  <div>
    <search :is_subscribed="is_subscribed" @subscribe="subscribe" />

    <section class="section">
      <div class="columns">
        <div class="column is-3">
          <nav class="panel">
            <p class="panel-heading">Shows</p>

            <div class="panel-block show-item" v-for="show in subscriptions" :key="show.id">
              <router-link :to="'/shows/' + show.id">{{ show.name }}</router-link>

              <div>
                <a @click="subscribe(show)"><fa-icon icon="times" /></a>
              </div>
            </div>
          </nav>
        </div>

        <div class="column is-9">
          <h1 class="title is-3">Your schedule</h1>

          <p v-if="subscriptions.length == 0">You don't have any subscriptions yet. Search for shows above, then subscribe!</p>

          <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>Show</th>
                <th>Episode</th>
              </tr>
            </thead>
            
            <template v-for="date in scheduleDates">
              <thead :key="date">
                <tr>
                  <th colspan="2">{{ date }}</th>
                </tr>
              </thead>
              <tbody :key="date">
                <tr v-for="show in schedule[date]" :key="show.episode.id">
                  <td>{{ show.show.name }}</td>
                  <td>{{ show.episode.season }}x{{ show.episode.number }}: {{ show.episode.name }}</td>
                </tr>
              </tbody>
            </template>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment   from 'moment'
import Fetch    from '@/library/Fetch'
import Database from '@/library/Database'

import ShowSearch from '@/components/ShowSearch'

export default {
  components: {
    'search': ShowSearch
  },
  data () {
    return {
      subscriptions: [],
      schedule: {}
    }
  },
  computed: {
    scheduleDates () {
      return Object.keys(this.schedule).sort((a, b) => moment(a).isBefore(b))
    }
  },
  watch: {
    subscriptions (data) {
      this.get_schedule()
      Database.set_data(data)
    }
  },
  methods: {
    is_subscribed (show) {
      return this.subscriptions.findIndex(e => e.id === show.id) !== -1
    },
    subscribe (show) {
      if (this.is_subscribed(show)) {
        return this.subscriptions.splice(this.subscriptions.findIndex(e => e.id === show.id), 1)
      }
      this.subscriptions.push(show)
    },
    get_schedule () {
      this.schedule = {}
      
      this.subscriptions.forEach(show => {
        Fetch.get('shows/' + show.id +  '/episodes')
        .then(resp => {
          resp.forEach(episode => {
            if (moment().subtract(7, 'days').isBefore(episode.airdate)) {
              if (this.schedule[episode.airdate] === undefined) this.$set(this.schedule, episode.airdate, [])
              
              this.schedule[episode.airdate].push({
                episode,
                show
              })
            }
          })
        })
      })
    }
  },
  created () {
    Database.get_data()
    .then(result => {
      this.subscriptions = result.data().subscriptions
    })
  }
}
</script>

<style>
.show-item {
  justify-content: space-between
}
</style>
