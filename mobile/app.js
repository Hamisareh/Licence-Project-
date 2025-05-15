import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './app/screens/SplashScreen';
import LoginScreen from './app/screens/LoginScreen';
import HomeScreen from './app/screens/HomeScreen';
import ForgotPassword from '../app/ForgotPassword';
import VerifyCode from '../app/VerifyCode';
import ChangePassword from '../app/ChangePassword';
import ProfileScreen from '../app/ProfileScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        {/* Ajoutez ces écrans */}
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: 'Mot de passe oublié' }} />
        <Stack.Screen name="VerifyCode" component={VerifyCode} options={{ title: 'Vérification du code' }} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ title: 'Nouveau mot de passe' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
