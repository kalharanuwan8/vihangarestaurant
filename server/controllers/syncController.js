import firestore from '../firebaseAdmin.js';

import User from '../model/User.js';
import Bill from '../model/Bill.js';
import Item from '../model/Item.js';
import TransBill from '../model/TransBill.js';

export const syncAllCollectionsToFirestore = async () => {
  try {
    // 🔄 USERS
    const mongoUsers = await User.find();
    for (const user of mongoUsers) {
      const docRef = firestore.collection('users').doc(user._id.toString());
      const snapshot = await docRef.get();

      const userData = {
        name: user.name || '',
        email: user.email,
        isAdmin: user.isAdmin || false,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (!snapshot.exists) {
        await docRef.set(userData);
        console.log(`✅ Created Firestore user: ${user.email}`);
      } else {
        await docRef.update(userData);
        console.log(`🔄 Updated Firestore user: ${user.email}`);
      }
    }

    // 🔄 ITEMS
    const mongoItems = await Item.find();
    for (const item of mongoItems) {
      const docRef = firestore.collection('items').doc(item._id.toString());
      const snapshot = await docRef.get();

      const itemData = {
        itemCode: item.itemCode,
        itemName: item.itemName,
        category: item.category,
        price: item.price,
        quantity: item.quantity ?? null,
        imagePath: item.imagePath,
        createdAt: item.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: item.updatedAt?.toISOString() || new Date().toISOString(),
      };

      if (!snapshot.exists) {
        await docRef.set(itemData);
        console.log(`✅ Created Firestore item: ${item.itemName}`);
      } else {
        await docRef.update(itemData);
        console.log(`🔄 Updated Firestore item: ${item.itemName}`);
      }
    }

    // 🔄 BILLS
    // 🔄 BILLS
const mongoBills = await Bill.find().lean(); // 👈 convert to plain JS
for (const bill of mongoBills) {
  const docRef = firestore.collection('bills').doc(bill._id.toString());
  const snapshot = await docRef.get();

  const billData = {
    billCode: bill.billCode,
    billItems: bill.billItems.map(item => ({
      item: item.item?.toString() || null, // ensure ID is plain
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      priceAtSale: item.priceAtSale,
    })),
    total: bill.total,
    billType: bill.billType,
    createdAt: bill.createdAt?.toISOString() || new Date().toISOString(),
  };

  if (!snapshot.exists) {
    await docRef.set(billData);
    console.log(`✅ Created Firestore bill: ${bill.billCode}`);
  } else {
    await docRef.update(billData);
    console.log(`🔄 Updated Firestore bill: ${bill.billCode}`);
  }
}

// 🔄 TRANSBILLS
const mongoTransBills = await TransBill.find().lean(); // 👈 convert to plain JS
for (const trans of mongoTransBills) {
  const docRef = firestore.collection('transBills').doc(trans._id.toString());
  const snapshot = await docRef.get();

  const transBillData = {
    billCode: trans.billCode,
    billItems: trans.billItems.map(item => ({
      item: item.item?.toString() || null,
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      priceAtSale: item.priceAtSale,
    })),
    total: trans.total,
    createdAt: trans.createdAt?.toISOString() || new Date().toISOString(),
  };

  if (!snapshot.exists) {
    await docRef.set(transBillData);
    console.log(`✅ Created Firestore transBill: ${trans.billCode}`);
  } else {
    await docRef.update(transBillData);
    console.log(`🔄 Updated Firestore transBill: ${trans.billCode}`);
  }
}


    console.log('✅ All collections synced to Firestore.');
  } catch (err) {
    console.error('❌ Error syncing to Firestore:', err);
  }
};
