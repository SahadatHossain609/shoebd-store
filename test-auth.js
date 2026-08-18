import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import fs from "fs";

const localConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const firebaseConfig = {
  apiKey: localConfig.apiKey,
  authDomain: localConfig.authDomain,
  projectId: localConfig.projectId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

createUserWithEmailAndPassword(auth, "test" + Date.now() + "@example.com", "password123")
  .then((user) => {
    console.log("Success:", user.user.uid);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error.code, error.message);
    process.exit(1);
  });
