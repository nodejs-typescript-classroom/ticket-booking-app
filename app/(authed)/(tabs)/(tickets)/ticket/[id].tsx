import { Text } from '@/components/Text';
import { VStack } from '@/components/VStack';
import { ticketService } from '@/services/ticket';
import { Ticket } from '@/types/ticket';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image } from 'react-native';
import Toast from 'react-native-root-toast';

export default function TicketDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [ticket, setTicket] = useState<Ticket|null>(null);
  const [qrcode, setQrCode] = useState<string|null>(null);
  async function fetchTicket() {
    try {
      const {data} = await ticketService.getOne(id as string);
      setTicket(data.ticket);
      setQrCode(data.qrcode);
    } catch(error) {
      const err: Error = error as Error;
      const message = err?.message?? 'unknown server error';
      const toast: Toast = Toast.show(message, {
        duration: Toast.durations.LONG,
        textColor: 'red',
        backgroundColor: 'orange'
      });
      setTimeout(function hideToast() {
        Toast.hide(toast);
      }, 1500);
      router.back();
    }
  }
  useFocusEffect(useCallback(() => { fetchTicket()}, []));
  useEffect(()=>{
    navigation.setOptions({
      headerTitle: ''
    });
  }, [navigation])
  if (!ticket) return null;
  return (
    <VStack
      alignItems='center'
      m={20}
      p={20}
      gap={20}
      flex={1}
      style={{
        backgroundColor: 'white',
        borderRadius: 20,
      }}
    >
      <Text fontSize={50} bold>{ticket.event.name}</Text>
      <Text fontSize={20} bold>{ticket.event.location}</Text>
      <Text fontSize={16} color='gray'>{new Date(ticket.event.startDate).toLocaleString()}</Text>
      <Image
        style={{
          borderRadius: 20
        }} 
        width={300}
        height={300}
        source={{uri: `data:image/png;base64,${qrcode}`}}
      />
    </VStack>
  );
}