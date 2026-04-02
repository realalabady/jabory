// سكريبت لحفظ مفاتيح تابي
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAOPFLBvLTZ6m0zl2N2kTpk-9M-LsSTglI",
  authDomain: "jabouri-digital-library.firebaseapp.com",
  projectId: "jabouri-digital-library",
  storageBucket: "jabouri-digital-library.firebasestorage.app",
  messagingSenderId: "766538398445",
  appId: "1:766538398445:web:1efd53febe55ed0ce16c32",
  measurementId: "G-41MRFXKXQT"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

const saveTabbySettings = httpsCallable(functions, "tabbySaveSettings");

try {
  const result = await saveTabbySettings({
    publicKey: "pk_019d08c2-bdc5-b2b7-85c0-9fcbf5308a4c",
    secretKey: "sk_019d08c2-bdc5-b2b7-85c0-9fcca6636308"
  });
  console.log("Result:", result.data);
  console.log("✓ تم حفظ مفاتيح تابي بنجاح");
} catch (error) {
  console.error("Error:", error.message);
}
