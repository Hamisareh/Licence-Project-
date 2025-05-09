


import { RegisterProvider } from '../context/RegisterContext';
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <RegisterProvider>
      <Slot />
    </RegisterProvider>
  );
}
