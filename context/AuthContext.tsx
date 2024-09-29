import { userService } from '@/services/user';
import { AuthResponse, RegisterResponse, User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-root-toast';

interface AuthContextProps {
  isLoggedIn: boolean;
  isLoadingAuth: boolean;
  authenticate: (authMode: 'login'|'register', email: string, password: string) => Promise<void>;
  logout: VoidFunction;
  user: User | null;
}

const AuthContext = createContext({} as AuthContextProps);
// Create custom useAuth
export function useAuth() {
  return useContext(AuthContext);
}
export function AuthenticationProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [user, setUser] = useState<User|null>(null);
  useEffect(()=> {
    async function checkIfLoggedIn() {
      const [token, user] = await Promise.all([
        AsyncStorage.getItem('access_token'),
        AsyncStorage.getItem('user')]);
      if (token && user) {
        setIsLoggedIn(true);
        setUser(JSON.parse(user));
        router.replace("(authed)")
      } else {
        setIsLoggedIn(false);
      }
    }
    checkIfLoggedIn()
  }, []);
  async function authenticate(authMode: 'login'|'register', email: string, password: string):Promise<void> {
    try {
      setIsLoadingAuth(true);
      const response = await userService[authMode]({email, password});
      if (response) {
        if (authMode == 'login') {
          const authData: AuthResponse = response as unknown as AuthResponse;
          const {user, access_token, refresh_token} = authData.data;
          await Promise.all([
            AsyncStorage.setItem('access_token', access_token),
            AsyncStorage.setItem('refresh_token', refresh_token),
            AsyncStorage.setItem('user', JSON.stringify(user))
          ]);
          setUser(user);
          router.replace("(authed)");
          setIsLoggedIn(true);
        } else {
          const registerResp = response as RegisterResponse;
          const { message } = registerResp;
          const { id } = registerResp.data;
          const toast: Toast = Toast.show(message, {
            duration: Toast.durations.LONG,
          });
          setTimeout(function hideToast() {
            Toast.hide(toast);
          }, 1500);
        }
      }
    } catch (error: unknown) {
      const err: Error = error as Error;
      setIsLoggedIn(false);
      const message = err?.message?? 'unknown server error';
      const toast: Toast = Toast.show(message, {
        duration: Toast.durations.LONG,
        textColor: 'red',
        backgroundColor: 'orange'
      });
      setTimeout(function hideToast() {
        Toast.hide(toast);
      }, 1500);
    } finally {
      setIsLoadingAuth(false);
    }
  }
  async function logout() {
    setIsLoggedIn(false);
    await Promise.all([
      AsyncStorage.removeItem('access_token'),
      AsyncStorage.removeItem('refresh_token'),
      AsyncStorage.removeItem('user')
    ]);
    setUser(null);
  }
  return (
    <AuthContext.Provider
     value={{
      isLoggedIn,
      isLoadingAuth,
      authenticate,
      user,
      logout,
     }}
    >
      {children}
    </AuthContext.Provider>
  ) 
}