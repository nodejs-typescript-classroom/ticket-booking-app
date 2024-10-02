import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { HStack } from '@/components/HStack';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Text } from '@/components/Text';
import { VStack } from '@/components/VStack';
import { useAuth } from '@/context/AuthContext';
import { eventService } from '@/services/event';
import { ticketService } from '@/services/ticket';
import { Event } from '@/types/event';
import { UserRole } from '@/types/user';
import { useFocusEffect } from '@react-navigation/native';
import { router, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import Toast from 'react-native-root-toast';

export default function EventsScreen() {
  const {user} = useAuth();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  function onGotoEventPage(id: string) {
    if (user?.role === UserRole.Admin) {
      router.push(`/(events)/event/${id}`);
    }
  }
  async function buyTicket(id: string) {
    try {
      const response = await ticketService.createOne(id, user?.id??'');
      const toast: Toast = Toast.show(response.message, {
        duration: Toast.durations.LONG,
      });
      setTimeout(function hideToast() {
        Toast.hide(toast);
      }, 1500);
      fetchEvents();
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
    }
  }
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventService.getAll();
      setEvents(response.data.events);
    } catch (error) {
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
    } finally {
      setIsLoading(false);
    }
  };
  useFocusEffect(useCallback(()=>{
    fetchEvents()
  }, []))
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Events',
      headerRight: user?.role === UserRole.Admin ? headerRight:null
    });
  }, [navigation, user]);
  return <VStack flex={1} p={20} pb={0} gap={20}>
      <HStack alignItems='center' justifyContent='center'>
        <Text fontSize={18} bold>{events.length} Events</Text>
      </HStack>
      <FlatList
        data={events}
        keyExtractor={({id})=> id}
        onRefresh={fetchEvents}
        refreshing={isLoading}
        ItemSeparatorComponent={()=> <VStack h={20}/>}
        renderItem={({item: event})=> (
          <VStack
            gap={20}
            p={20}
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
            }}
            key={event.id}
          >
            <TouchableOpacity onPress={()=>onGotoEventPage(event.id)}>
              <HStack alignItems='center' justifyContent='space-between'>
                <HStack alignItems='center'>
                  <Text fontSize={26} bold>{event.name}</Text>
                  <Text fontSize={26} bold>|</Text>
                  <Text fontSize={16} bold>{event.location}</Text>
                </HStack>
                {user?.role === UserRole.Admin && <TabBarIcon size={24} name='chevron-forward'/>}
              </HStack>
            </TouchableOpacity>
            <Divider/>
            <HStack justifyContent='space-between'>
              <Text bold fontSize={16} color='gray'> Sold: {event.totalTicketsPurchased}</Text>
              <Text bold fontSize={16} color='green'> Entered: {event.totalTicketsEntered}</Text>
            </HStack>
            {user?.role === UserRole.Attendee && 
              <VStack>
                <Button
                  variant='outlined'
                  disabled={isLoading}
                  onPress={() => buyTicket(event.id)} 
                >
                  Buy Ticket
                </Button>
              </VStack>
            }
            <Text fontSize={13} color='gray'>{event.startDate}</Text>
          </VStack>
        )}
      />
    </VStack>
  ;
}
const headerRight = () => {
  return <TabBarIcon 
    size={32} 
    name='add-circle-outline'
    onPress={()=>router.push('/(events)/new')}
  />
}