import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASVyXFlzMLXCLEnktbSzGNm82KSqG_G7w",
  authDomain: "rpg-multiplayer-system.firebaseapp.com",
  projectId: "rpg-multiplayer-system",
  storageBucket: "rpg-multiplayer-system.firebasestorage.app",
  messagingSenderId: "614775769148",
  appId: "1:614775769148:web:14c1ccc6ea1c5cba169b39",
  measurementId: "G-C70EMXRHDY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.firebaseApp = app;
window.auth = auth;
window.db = db;
