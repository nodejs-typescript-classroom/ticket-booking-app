import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { VStack } from '@/components/VStack';
import { ticketService } from '@/services/ticket';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Vibration } from 'react-native';

export default function ScanTicketScreen() {
  const navigation = useNavigation();
  const [permssion, requestPermission] = useCameraPermissions();
  const [scanningEnabled, setScanningEnabled] = useState(true);
  useEffect(()=>{
    navigation.setOptions({
      headerTitle: 'Scan Ticket'
    })
  }, [navigation])
  if (!permssion) {
    return (
      <VStack flex={1} justifyContent='center' alignItems='center'>
        <ActivityIndicator size='large'/>
      </VStack>
    )
  }
  if (!permssion.granted) {
    return (
      <VStack gap={20} flex={1} justifyContent='center' alignItems='center'>
        <Text>Camera access is required to scan tickets.</Text>
        <Button onPress={requestPermission}>Allow Camera Access</Button>
      </VStack>
    )
  }
  async function onBarcodeScanned({data}: BarcodeScanningResult) {
    if (!scanningEnabled) return;
    try {
      Vibration.vibrate();
      setScanningEnabled(false);
      const jsonData = JSON.parse(data);
      const [ticketId, userId ] = [jsonData['ticket_id'], jsonData['user_id']];
      await ticketService.validateOne(ticketId, userId);
      Alert.alert('Success', `Ticket with id ${ticketId} validate successs`, [{
        text: 'Scan Next',
        onPress: () => {
          setScanningEnabled(true);
        }
      }]);
      router.back()
    } catch (error) {
      Alert.alert('Error', 'Failed to validate ticket please try again', [
        {
          text: 'Scan Next',
          onPress: () => {
            setScanningEnabled(true);
          }
        }
      ]);
    } 
  }
  return (
    <CameraView
      style={{flex: 1}}
      facing='back'
      onBarcodeScanned={onBarcodeScanned}
      barcodeScannerSettings={{barcodeTypes: ['qr']}}
    />
  );
}