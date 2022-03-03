import * as admin from 'firebase-admin'

export const verifyIdToken = async (token: string) => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(
        require('/Users/arai/Downloads/praha-challenge-4da00-firebase-adminsdk-62lrg-38ecec40b8.json'),
      ),
    })
  }
  return await admin.auth().verifyIdToken(token, true)
}
