import { onAuthStateChanged, signInWithCustomToken, signOut, Unsubscribe, User } from "firebase/auth";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OpenAPI } from "../client";
import { auth } from "../utils/firebase";
import { setLocalStorage } from "../utils/localStorage";
import { useSearchParams } from "react-router";

interface AuthContextInterface {
  loading: boolean;
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  logout: () => Promise<void>
}

const AuthContext = createContext({} as AuthContextInterface);

export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export default function AuthContextProvider(props: AuthContextProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    await signOut(auth)
  }

  const setTokenToLocal = async (user?: User | null) => {
    const mainUser = user || currentUser
    if (!mainUser) {
      return null
    }
    const token = await mainUser.getIdToken()
    setLocalStorage("TOKEN", token)
    return token
  }

  useEffect(() => {
    if (currentUser) {
      OpenAPI.TOKEN = async (e) => {
        const token = await setTokenToLocal()
        return token!
      }
    } else if (searchParams.has("token")) {
      const token = searchParams.get("token")
      if (token) {
        signInWithCustomToken(auth, token)
      }
    }
  }, [currentUser, searchParams.has("token")])

  useEffect(() => {
    const unsubscribeAuthChanged = (() => {
      let unsubscribe: Unsubscribe | null = null;
      if (auth) {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          setCurrentUser(user);
          OpenAPI.TOKEN = async (e) => {
            const token = await setTokenToLocal(user)
            return token!
          }
          setLoading(false);
        });
      }
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    })();

    return () => {
      unsubscribeAuthChanged();
    };
  }, []);

  const contextValue = useMemo(() => {
    return {
      loading,
      currentUser,
      setCurrentUser,
      logout
    };
  }, [loading, currentUser, setCurrentUser]);

  return (
    <>
      <AuthContext.Provider value={contextValue}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
}
