<template>
  <div>
    <section class="hero is-success is-medium">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-1">
            Ye Artisinal Bread Shoppe
          </h1>
          <h2 class="subtitle is-1">
            Homemade breads for ridiculous prices
          </h2>
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="columns is-multiline">
        <div class="column is-4" v-for="(product, id) in products" :key="id">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <router-link :to="'/product/' + id"><img :src="product.image" :alt="product.name"></router-link>
              </figure>
            </div>

            <div class="card-content">
              <p class="title is-5">{{ product.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import db from '@/library/Database'

export default {
  data () {
    return {
      products: {}
    }
  },
  created () {
    db.get_products()
    .then((products) => {
      let tempProducts = {}

      products.forEach(product => {
        tempProducts[product.id] = product.data()
      })

      this.products = tempProducts
    })
  }
}
</script>

<style>
.hero {
  background: linear-gradient(
      rgba(0, 0, 0, 0.35), 
      rgba(0, 0, 0, 0.35)
    ), url('../assets/background.jpg')
    center;
  font-family: 'Amatic SC', cursive;
}

.hero .title {
  font-size: 7rem;
  font-weight: normal;
}
</style>
