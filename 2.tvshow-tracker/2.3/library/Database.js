import Firebase from 'firebase/app'
import 'firebase/firestore'

const config = {}

let App = Firebase.initializeApp(config)
let Firestore = App.firestore()
Firestore.settings({ timestampsInSnapshots: true })

export default {
  set_data (subscriptions) {
    Firestore.collection('subscriptions').doc('shows').set({ subscriptions })
  },
  get_data () {
    return Firestore.collection('subscriptions').doc('shows').get()
  }
}
