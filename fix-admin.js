import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import fs from "fs";

const localConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const firebaseConfig = {
  apiKey: localConfig.apiKey,
  projectId: localConfig.projectId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, localConfig.firestoreDatabaseId);

async function fix() {
  const q = query(collection(db, "users"), where("email", "==", "sh2305895@gmail.com"));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    console.log("Admin not found.");
  } else {
    for (const d of snapshot.docs) {
      console.log("Deleting old admin doc:", d.id);
      await deleteDoc(doc(db, "users", d.id));
    }
    console.log("Deleted old admin record. User can now register fresh.");
  }
  process.exit(0);
}
fix();
