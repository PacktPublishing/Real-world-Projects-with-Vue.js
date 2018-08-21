<template>
  <section class="section container">
    <div class="tabs is-fullwidth">
      <ul>
        <li :class="{ 'is-active': step == 1 }"><a>1. Information</a></li>
        <li :class="{ 'is-active': step == 2 }"><a>2. Payment &amp; Shipping</a></li>
        <li :class="{ 'is-active': step == 3 }"><a>3. Confirmation</a></li>
      </ul>
    </div>

    <div class="columns">
      <div class="column is-8 is-offset-2">
        <form @submit.prevent="nextStep" v-if="step == 1">
          <h1 class="title">Your information</h1>

          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" type="text" v-model="customer.name" placeholder="Your name" v-validate="'required'" name="name">
              <p class="help is-danger">{{ errors.first('name') }}</p>
            </div>
          </div>

          <div class="field">
            <label class="label">Address</label>
            <div class="control">
              <input class="input" type="text" v-model="customer.address" placeholder="Example address 128/48" name="address" v-validate="'required'">
              <p class="help is-danger">{{ errors.first('address') }}</p>
            </div>
          </div>

          <div class="field">
            <label class="label">Country</label>
            <country-select @select="updateCountry" :selectedCountry="customer.country" />
          </div>

          <div class="field">
            <label class="label">City</label>
            <div class="control">
              <input class="input" type="text" v-model="customer.city" placeholder="Marshmellow Town" v-validate="'required'" name="city">
              <p class="help is-danger">{{ errors.first('city') }}</p>
            </div>
          </div>

          <div class="field">
            <label class="label">Postcode</label>
            <div class="control">
              <input class="input" type="text" v-model="customer.postcode" placeholder="12345" v-validate="'required'" name="postcode">
              <p class="help is-danger">{{ errors.first('postcode') }}</p>
            </div>
          </div>

          <div class="field">
            <label class="label">Email Address</label>
            <div class="control">
              <input class="input" type="email" v-model="customer.email" placeholder="your@email.address" v-validate="'required|email'" name="email">
              <p class="help is-danger">{{ errors.first('email') }}</p>
            </div>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button class="button is-link">Continue to shipping &amp; payment</button>
            </div>
          </div>
        </form>

        <form @submit.prevent="nextStep" v-if="step == 2" class="columns is-multiline">
          <div class="column is-third">
            <div class="box">
              <h2 class="title is-4">Shipping</h2>

              <div class="control">
                <p v-for="( shippingOption, index ) in shippingOptions" :key="index">
                  <label class="radio">
                    <input type="radio" name="shipping" :value="index" v-model="shipping" v-validate="'required|excluded:-1'">
                    {{ shippingOption.name }} (+{{ shippingOption.price }} EUR)
                  </label>
                </p>

                <p class="help is-danger">{{ errors.first('shipping') }}</p>
              </div>
            </div>
          </div>

          <div class="column is-third">
            <div class="box">
              <h2 class="title is-4">Payment</h2>

              <div class="control">
                <p v-for="( paymentOption, index ) in paymentOptions" :key="index">
                <label class="radio">
                  <input type="radio" :value="index" v-model="payment" name="payment" v-validate="'required|excluded:-1'">
                  {{ paymentOption.name }}
                </label>
                </p>
              </div>
            </div>
          </div>

          <div class="column is-third">
            <div class="box">
              <h2 class="title is-4">Total</h2>
              <p>Cart: {{ totalItems | price }}</p>
              <p>Incl. shipping and payment: {{ total | price }}</p>
            </div>
          </div>
          
          <div class="field is-grouped column is-12">
            <div class="control">
              <button class="button is-link">Continue to confirmation</button>
            </div>
          </div>
        </form>

        <form v-if="step == 3" class="columns is-multiline" @submit.prevent="checkout">
          <cart viewOnly />

          <div class="column is-third">
            <h2 class="title is-5">Shipping</h2>
            <p>{{ selectedShipping.name }}</p>
            <p>{{ selectedShipping.price | price }}</p>
          </div>
          <div class="column is-third">
            <h2 class="title is-5">Payment</h2>
            <p>{{ selectedPayment.name }}</p>
            <p>{{ selectedPayment.price | price }}</p>
          </div>

          <div class="column is-third">
            <h2 class="title is-4">Total {{ total | price }}</h2>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button class="button is-link">Confirm order</button>
            </div>
          </div>
        </form>

        <div v-if="step == 4">
          <h1 class="title">Thank you for your order!</h1>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CS from '@/components/CountrySelect'
import Cart from '@/components/Cart'

export default {
  components: {
    countrySelect: CS,
    cart: Cart
  },
  data () {
    return {
      step: 2,
      customer: this.$store.state.customer,

      shippingOptions: [
        { name: 'Postal Service', price: 10 },
        { name: 'Pickup', price: 0 }
      ],
      paymentOptions: [
        { name: 'Cash on delivery', price: 0 }
      ]
    }
  },
  computed: {
    total () { return this.$store.getters.total },
    totalItemms () { return this.$store.getters.totalItemms },
    shipping: {
      get () {
        return this.shippingOptions.findIndex(s => s.name === this.$store.state.shipping.name)
      },
      set (value) {
        this.$store.commit('SET_SHIPPING', this.shippingOptions[value])
      }
    },
    selectedShipping () {
      return this.shippingOptions[this.shipping]
    },
    payment: {
      get () {
        return this.paymentOptions.findIndex(s => s.name === this.$store.state.payment.name)
      },
      set (value) {
        this.$store.commit('SET_PAYMENT', this.paymentOptions[value])
      }
    },
    selectedPayment () {
      return this.paymentOptions[this.payment]
    }
  },
  watch: {
    customer: {
      handler (customer) {
        this.$store.commit('SET_CUSTOMER', customer)
      },
      deep: true
    }
  },
  methods: {
    updateCountry (country) {
      this.$set(this.customer, 'country', country)
    },
    nextStep () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.step += 1
        }
      })
    },
    checkout () {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.$store.dispatch('addOrder').then(() => this.step = 4 )
        }
      })
    }
  }
}
</script>

<style>

</style>
