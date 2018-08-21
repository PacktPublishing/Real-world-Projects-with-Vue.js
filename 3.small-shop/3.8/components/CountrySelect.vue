<template>
  <div class="select">
    <select @change="$emit('select', $event.target.value)">
      <option v-for="country in countries" :key="country.code" :value="country.code" :selected="country.code == selectedCountry">{{ country.name }}</option>
    </select>
  </div>
</template>

<script>
import countries from '@/assets/countries.json'

export default {
  props: {
    selectedCountry: {
      type: String,
      default: 'DE'
    }
  },
  data () {
    return {
      countries
    }
  }
}
</script>

<style>

</style>
