import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "bypass-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bypass.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bypass-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bypass.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:bypass",
};

let app, auth, googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();

  googleProvider.setCustomParameters({
    prompt: "select_account",
  });
} catch (error) {
  console.warn("Firebase não configurado corretamente. Autenticação Google desabilitada.", error);
  // Criar objetos mock para evitar erros
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider };
export default app;
