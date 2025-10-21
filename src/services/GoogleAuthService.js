import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

class GoogleAuthService {
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Obtém o ID Token do Firebase/Google
      const idToken = await user.getIdToken();

      return {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        emailVerified: user.emailVerified,
        idToken: idToken, // Token OAuth do Google
      };
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      throw this.handleAuthError(error);
    }
  }
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  }
  getCurrentUser() {
    return auth.currentUser;
  }
  handleAuthError(error) {
    const errorMessages = {
      "auth/popup-closed-by-user": "Login cancelado. Você fechou a janela de autenticação.",
      "auth/cancelled-popup-request": "Solicitação de login cancelada.",
      "auth/popup-blocked": "Pop-up bloqueado pelo navegador. Por favor, permita pop-ups para este site.",
      "auth/account-exists-with-different-credential": "Já existe uma conta com este email usando outro método de login.",
      "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
      "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
      "auth/user-disabled": "Esta conta foi desabilitada.",
    };

    const message = errorMessages[error.code] || "Erro ao fazer login com Google. Tente novamente.";
    
    return {
      code: error.code,
      message,
      originalError: error,
    };
  }
}

export default new GoogleAuthService();
