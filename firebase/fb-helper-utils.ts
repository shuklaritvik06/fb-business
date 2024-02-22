import { firebase_auth, firebase_storage } from '@/lib/firebase-client'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const dataUrlToBlob = (dataUrl: string) => {
  const base64String = dataUrl.split(',')[1]
  const mimeString = dataUrl.split(';')[0].slice(5)

  const byteCharacters = atob(base64String)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeString })
}

export const registerUser = async (
  name: string,
  email: string,
  profilePicture: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebase_auth,
      email,
      password
    )
    const user = userCredential.user

    const storageRef = ref(firebase_storage, 'profile_images/' + user.uid)

    const snapshot = await uploadBytes(
      storageRef,
      dataUrlToBlob(profilePicture)
    )

    const downloadURL = await getDownloadURL(snapshot.ref)

    await updateProfile(user, {
      displayName: name,
      photoURL: downloadURL,
    })

    return user
  } catch (error: any) {
    console.error('Error registering user:', error.message)
    throw error
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebase_auth,
      email,
      password
    )
    const user = userCredential.user

    return user
  } catch (error: any) {
    console.error('Error logging in:', error.message)
    throw error
  }
}

export async function signOutUser() {
  return signOut(firebase_auth)
}
