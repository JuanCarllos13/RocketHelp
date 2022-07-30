import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from 'native-base'
import { SignOut } from 'phosphor-react-native'
import { ChatTeardropText } from 'phosphor-react-native'

import Logo from '../../assets/logo_secondary.svg'
import { Filter } from '../../Components/Filter'
import { Order, OrderProps } from '../../Components/Order'
import { Button } from '../../Components/Button'
import { Alert } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import { dateFormat } from '../../utils/firestoreDateFormat'
import { Loading } from '../../Components/Loading/index'


export function Home() {
  const { colors } = useTheme()
  const navigation = useNavigation()
  const [isLoading, setIsloading] = useState(true)
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
  const [orders, setOrders] = useState<OrderProps[]>([])

  function handleNewOrder() {
    navigation.navigate('Register')
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('Details', { orderId })
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error)
        return Alert.alert('Não foi possível sair')
      })
  }

  useEffect(() => {
    setIsloading(true);

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const { patrimony, description, status, created_at } = doc.data();

          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at)
          }
        });

        setOrders(data);
        setIsloading(false);
      });

    return subscriber;
  }, [statusSelected]);


  return (
    <VStack flex={1} pb={6} bg={'gray.700'} >

      <HStack
        w={'full'}
        bg={'gray.600'}
        justifyContent='space-between'
        alignItems={'center'}
        pt={'12'}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack w={'full'} mt={8} mb={4} justifyContent='space-between' alignItems={'center'}>
          <Heading color={'gray.100'}>
            Solicitações
          </Heading>
          <Text color={'gray.200'}>
            {orders.length}
          </Text>
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            title='Em andamento'
            type='open'
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />

          <Filter
            title='Finalizados'
            type='closed'
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />

        </HStack>

        {
          isLoading ? <Loading /> :
            <FlatList
              data={orders}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListEmptyComponent={() => (
                <Center>
                  <ChatTeardropText color={colors.gray[300]} size={40} />
                  <Text
                    color={'gray.300'}
                    fontSize={'xl'}
                    mt={6}
                    textAlign='center'
                  >
                    Você ainda não possui{'\n'}
                    solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizados'}
                  </Text>
                </Center>
              )}
            />}
      </VStack>

      <Button
        title='Nova Solicitação'
        ml={5}
        mr={5}
        onPress={handleNewOrder}
      />
    </VStack>
  )
}