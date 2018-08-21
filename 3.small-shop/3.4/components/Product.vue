<template>
  <section class="section container">
    <div class="columns box">
      <div class="column is-8">
        <img :src="product.image" :alt="product.name">

        <p>{{ product.description }}</p>
      </div>
      <div class="column is-4">
        <h1 class="title">{{ product.name }}</h1>

        <form @submit.prevent="addToCart">
          <table class="table is-borderless is-hoverable is-compact">
            <thead>
              <tr>
                <th></th>
                <th>Size</th>
                <th>Weight</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(size, i) in product.sizes" :key="i">
                <td><input type="radio" name="size" :value="i" v-model="pickedSize" /></td>
                <td>{{ size.name }}</td>
                <td>{{ size.weight }} g</td>
                <td>{{ size.price | price }}</td>
              </tr>
            </tbody>
          </table>

          <div class="field">
            <label>Quantity</label>
            <input type="number" class="input" min="1" v-model="quantity" />
          </div>
          <div class="field">
            <label>Total</label>
            <p>{{ total | price }}</p>
          </div>
          <button type="submit" class="button is-success"><fa-icon icon="cart-plus" /> Add to cart</button>
        </form>

      </div>
    </div>
  </section>
</template>

<script>
import db from '@/library/Database'

export default {
  data () {
    return {
      product: {},
      quantity: 1,
      pickedSize: 0
    }
  },
  computed: {
    total () {
      if (this.product.sizes === undefined) return 0

      return this.product.sizes[this.pickedSize].price * this.quantity
    }
  },
  methods: {
    addToCart () {
    }
  },
  created () {
    db.get_product(this.$route.params.id)
    .then(product => {
      this.product = product.data()
    })
  }
}
</script>

<style scoped>
img {
  margin: -32px;
  margin-bottom: 1.5em;
}

p {
  font-size: 1.1em;
}
</style>
