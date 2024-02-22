import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
} from 'firebase/analytics'
import { config } from '@/config/app-config'

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
}

const app = initializeApp(firebaseConfig)

let analytics = null

isAnalyticsSupported().then((value) => {
  if (value) {
    analytics = getAnalytics(app)
  }
})

const firebase_auth = getAuth(app)
const firebase_storage = getStorage(app)

export { firebase_auth, firebase_storage, analytics }
