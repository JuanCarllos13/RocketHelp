import React from 'react';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { NativeBaseProvider, StatusBar } from "native-base";
import { SignIn } from './src/pages/Sigin';
import { THEME } from './src/styles/theme'
import { Loading } from './src/Components/Loading'
import { Home } from './src/pages/home';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular, Roboto_700Bold
  })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar 
      barStyle='light-content'
      backgroundColor={'transparent'}
      translucent
      />
      {fontsLoaded ? <Home /> : <Loading />}
    </NativeBaseProvider>
  );
}


