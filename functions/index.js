import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export  const getUsers = functions.https.onRequest(async (req, res) => {
  try {

    const usersSnapshot = await admin.firestore().collection('users').get();


    const usersList = usersSnapshot.docs.map(doc => doc.data());

    
    res.status(200).json(usersList);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).send('Error fetching users');
  }
});
