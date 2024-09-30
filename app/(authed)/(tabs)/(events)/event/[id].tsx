import { Button } from '@/components/Button';
import DateTimePicker from '@/components/DatetimePicker';
import { Input } from '@/components/Input';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Text } from '@/components/Text';
import { VStack } from '@/components/VStack';
import { eventService } from '@/services/event';
import { Event } from '@/types/event';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-root-toast';

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState<Event|null>(null);
  function updateField(field: keyof Event, value: string|Date) {
    setEventData(prev => ({
      ...prev!,
      [field]: value
    }))
  }
  const onDelete = useCallback(async() => {
    if(!eventData) {
      return;
    }
    try {
      Alert.alert('Delete Event', 'Are you sure you want to delete this event?',[{
        text: 'Cancel',
      }, {
        text: 'Delete', onPress: async () => {
          setIsSubmitting(true);
          await eventService.deleteOne(id as string);
          router.back();
        }
      }]);
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
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  }, [eventData, id]);
  async function onSubmitChanges() {
    if(!eventData) {
      return
    }
    try {
      setIsSubmitting(true);
      await eventService.updateOne(eventData.id, 
        eventData.name, 
        eventData.location, 
        eventData.startDate);
      router.back();
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
    } finally {
      setIsSubmitting(false);
    }
  }
  const fetchEvent = async ()=> {
    try {
      setIsSubmitting(true);
      const response = await eventService.getOne(id as string);
      setEventData(response.data);
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
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  };
  useFocusEffect(useCallback(()=>{
    fetchEvent()
  }, []))
  useEffect(()=>{
    navigation.setOptions({
      headerTitle: '',
      headerRight: ()=> headerRight(onDelete)
    })
  }, [navigation, onDelete])
  return (
    <VStack m={20} flex={1} gap={30}>
      <VStack gap={5}>
        <Text ml={10} fontSize={14} color='gray'>
          Name
        </Text>
        <Input
          value={eventData?.name}
          onChangeText={(value)=>updateField('name', value)}
          placeholder='Name'
          placeholderTextColor='darkgray'
          h={48}
          p={14}
        />
      </VStack>
      <VStack gap={5}>
        <Text ml={10} fontSize={14} color='gray'>
          Location
        </Text>
        <Input
          value={eventData?.location}
          onChangeText={(value)=>updateField('location', value)}
          placeholder='Location'
          placeholderTextColor='darkgray'
          h={48}
          p={14}
        />
      </VStack>
      <VStack gap={5}>
        <Text ml={10} fontSize={14} color='gray'>
          Date
        </Text>
        <DateTimePicker 
          onChange={(value)=>updateField('startDate', value || new Date())}
          currentDate={new Date(eventData?.startDate|| new Date())}
        />
      </VStack>
      <Button
        mt={'auto'}
        isLoading={isSubmitting}
        disabled={isSubmitting}
        onPress={onSubmitChanges}
      >
        Save Change
      </Button>
    </VStack>
  );
}

const headerRight = (onPress: VoidFunction) => {
  return <TabBarIcon size={30} onPress={onPress} name='trash'/>
}