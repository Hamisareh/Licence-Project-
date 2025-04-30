import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native';
import '../i18n'; 


export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
  );
}
