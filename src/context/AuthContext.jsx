import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  signInWithPopup
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { syncUserProfile } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up
  const signup = (email, password, name, phone = '') => {
    return createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      // Also update the profile with the name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      const token = await userCredential.user.getIdToken();
      await syncUserProfile({ email, name, phone }, token);
      return userCredential;
    });
  };

  // Log in
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const loginWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    const token = await user.getIdToken();
    // Sync with backend (in case it's a first time login, it will create profile)
    await syncUserProfile({
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL
    }, token);
    return userCredential;
  };

  // Log out
  const logout = () => {
    return signOut(auth);
  };

  // Update Password
  const changePassword = (newPassword) => {
    if (auth.currentUser) {
      return updatePassword(auth.currentUser, newPassword);
    }
    return Promise.reject(new Error("No user is logged in"));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // If user logs in, we might want to get their custom profile from our MongoDB
      if (user) {
        user.getIdToken().then((token) => {
          localStorage.setItem('authToken', token);
        });
      } else {
        localStorage.removeItem('authToken');
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loginWithGoogle,
    changePassword,
    updateProfile: (profileData) => {
      return updateProfile(auth.currentUser, profileData);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
