import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home } from '../pages/home'
import { Register } from '../pages/Register'
import { Details } from '../pages/Details'


const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name='home' component={Home} />
      <Screen name='Register' component={Register} />
      <Screen name='Details' component={Details} />
    </Navigator>
  )
}