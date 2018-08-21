import Firebase from 'firebase/app'
import 'firebase/firestore'
import moment from 'moment'

const config = {}

let App = Firebase.initializeApp(config)
let Firestore = App.firestore()
Firestore.settings({ timestampsInSnapshots: true })

export let FirebaseApp = App

export default {}
