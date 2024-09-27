import { Redirect, Stack } from 'expo-router';

export default function AppLayout() {
  // check from context if user is logged in
  const isLogggedIn = true;
  if (!isLogggedIn) {
    return <Redirect href="/login" />
  }
  return <Stack screenOptions={{ headerShown: false }} />
}