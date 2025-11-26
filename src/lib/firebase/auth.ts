import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "./config";
import { createUserProfile } from "./firestore";

export async function signUp(
  email: string,
  password: string
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Send email verification
  await sendEmailVerification(userCredential.user);

  // Create initial user profile in Firestore
  await createUserProfile(userCredential.user.uid, {
    email: userCredential.user.email || email,
  });

  return userCredential;
}

export async function signIn(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");

  const userCredential = await signInWithPopup(auth, provider);

  // Create/update user profile with Google info
  await createUserProfile(userCredential.user.uid, {
    email: userCredential.user.email || "",
    displayName: userCredential.user.displayName || "",
    avatarId: userCredential.user.photoURL || "avatar-1",
  });

  return userCredential;
}

export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

export async function resendVerificationEmail(user: User): Promise<void> {
  return sendEmailVerification(user);
}
