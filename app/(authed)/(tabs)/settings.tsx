import { Button } from '@/components/Button';
import { VStack } from '@/components/VStack';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
  const { logout, refresh, isLoadingAuth } = useAuth();
  return (
    <VStack flex={ 1 } m={ 20 }  gap={30} justifyContent='center'>
      <Button isLoading={isLoadingAuth} onPress={ refresh }>Refresh Session</Button>
      <Button disabled={isLoadingAuth} onPress={ logout }>Logout</Button>
    </VStack>
  );
}