import { config } from '@/config/app-config'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

const firebaseAdminConfig = {
  credential: cert({
    projectId: config.projectId,
    clientEmail: config.client_email,
    privateKey: config.pvt_key,
  }),
}

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig)
  }
}
