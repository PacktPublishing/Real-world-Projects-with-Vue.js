import Firebase from 'firebase/app'
import 'firebase/firestore'
import moment from 'moment'

const config = {}

let App = Firebase.initializeApp(config)
let Firestore = App.firestore()
Firestore.settings({ timestampsInSnapshots: true })

export let FirebaseApp = App

export default {
  add_product (product) {
    return Firestore.collection('products').add(product)
  },
  save_product (id, product) {
    return Firestore.collection('products').doc(id).set(product)
  },
  delete_product (id) {
    return Firestore.collection('products').doc(id).delete()
  },
  get_products () {
    return Firestore.collection('products').get()
  },
  get_product (id) {
    return Firestore.collection('products').doc(id).get()
  },
  add_order (order) {
    if (order.timestamp === undefined) {
      order.timestamp = moment().format()
    }

    return Firestore.collection('orders').add(order)
  }
}
