import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function ScanTicketScreen() {
  const navigation = useNavigation();
  useEffect(()=>{
    navigation.setOptions({
      headerTitle: 'Scan Ticket'
    })
  }, [navigation])
  return <></>;
}