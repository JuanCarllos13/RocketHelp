import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { AppRoutes } from './app.routes'
import { SignIn } from '../pages/Sigin'
import { Loading } from '../Components/Loading'


export function Routes() {
  const [loading, setIsloading] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User>()


  useEffect(() => {
    const subscribe = auth().onAuthStateChanged(response => {
      setIsloading(false)
      setUser(response)
    })
    return subscribe
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <SignIn />}
    </NavigationContainer>
  )

}