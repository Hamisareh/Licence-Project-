import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { router } from 'expo-router';

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 1,
      bounciness: 15,
    }).start();

    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b0a82" />
      <Animated.Text style={[styles.title, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.stage}>Stage</Text>
        <Text style={styles.flow}>Flow</Text>
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000041', // foncé
    backgroundImage: 'linear-gradient(180deg,rgba(7, 11, 59, 0.79) 0%,hsla(242, 88.00%, 22.90%, 0.74) 100%)',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stage: {
    color: '#ffffff',
  },
  flow: {
    color: '#ff7b00',
  },
  subtitle: {
    marginTop: 20,
    fontSize: 16,
    color: '#e0e0ff',
  },
});
