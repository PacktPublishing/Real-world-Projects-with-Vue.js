<template>
  <div class="columns">
    <div class="column is-8">
      <router-link to="/"><fa-icon icon="angle-double-left" /> back</router-link>

      <section class="content">
        <h1 class="title is-2">{{ details.name }}</h1>
        <div v-html="details.summary"></div>
      </section>

      <div v-for="season in schedule" :key="season.season">
        <h2 class="title is-4">Season {{ season.season }}</h2>

        <table class="table is-striped is-fullwidth">
            <thead>
              <tr>
                <th>Date</th>
                <th>Number</th>
                <th>Title</th>
              </tr>
            </thead>
            
            <tbody>
              <tr v-for="show in season.episodes" :key="show.id">
                <td>{{ show.airdate }}</td>
                <td>{{ show.number }}</td>
                <td>{{ show.name }}</td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>

    <div class="column is-4">
      <img v-if="details.image" :src="details.image.original" :alt="details.name" />
    </div>
  </div>
</template>

<script>
import Fetch from '@/library/Fetch'

export default {
  data () {
    return {
      details: {},
      schedule: {}
    }
  },
  created () {
    Fetch.get('shows/' + this.$route.params.id)
    .then(resp => {
      this.details = resp
    })

    Fetch.get('shows/' + this.$route.params.id + '/episodes')
    .then(resp => {
      let schedule = {}
      resp.reverse().forEach(e => {
        let key = 'season_' + e.season
        if (!schedule[key]) schedule[key] = { episodes: [] }

        schedule[key].season = e.season
        schedule[key].episodes.push(e)
        // >> unshift
      })

      Object.keys(schedule).forEach(s => {
        schedule[s].episodes.sort((a, b) => a.number - b.number)
      })

      this.schedule = schedule
    })
  }
}
</script>

<style scoped>
img {
  margin-right: 1em
}
</style>
