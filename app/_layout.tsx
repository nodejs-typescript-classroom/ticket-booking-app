import { AuthenticationProvider } from '@/context/AuthContext';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {RootSiblingParent} from 'react-native-root-siblings';
export default function Root() {
  return (
    <RootSiblingParent>
      <StatusBar style='dark' />
      <AuthenticationProvider>
        <Slot />
      </AuthenticationProvider>
    </RootSiblingParent>   
  );
}
