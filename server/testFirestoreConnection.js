import firestore from './firebaseAdmin.js';

export const testFirestoreConnection = async () => {
  try {
    // Try to write a test doc to a "test" collection
    const testDocRef = firestore.collection('test').doc('connectionTest');

    await testDocRef.set({
      message: 'Firestore connection successful',
      timestamp: new Date().toISOString(),
    });

    // Read it back
    const docSnapshot = await testDocRef.get();

    if (docSnapshot.exists) {
      console.log('✅ Firestore connection test succeeded:', docSnapshot.data());
    } else {
      console.log('❌ Firestore test document not found');
    }
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
  }
};
