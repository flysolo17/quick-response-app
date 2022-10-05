import { CircularProgress } from "@mui/material";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../config/config";
import { userConverter, Users } from "../model/Users";
import { doc, getDoc } from "firebase/firestore";
interface IAuthContextProps {
  currentUser: User | null;
  type: string;
  users: Users | null;
}

const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: any;
}

const AuthProvider: React.FunctionComponent<AuthProviderProps> = (props) => {
  const { children } = props;
  const [currentUser, setCurrentuser] = useState<User | null>(null);
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  async function checkUser(params: User | null) {
    if (params != null) {
      const docRef = doc(firestore, "Users", params.uid).withConverter(
        userConverter
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const users = docSnap.data();
        setUser(users);
        setType(users.type);
      }
    }
    setLoading(false);
    setCurrentuser(params);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((users) => {
      checkUser(users);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser: currentUser,
    type: type,
    users: user,
  };
  if (loading) return <CircularProgress />;
  return (
    <>
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthProvider;
