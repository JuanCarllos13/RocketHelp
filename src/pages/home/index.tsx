import React, { useState } from 'react'
import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
  FlatList
} from 'native-base'
import { SignOut } from 'phosphor-react-native'

import Logo from '../../assets/logo_secondary.svg'
import { Filter } from '../../Components/Filter'
import { Order, OrderProps } from '../../Components/Order'
import { Button } from '../../Components/Button'


export function Home() {
  const { colors } = useTheme()
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open')
  const [orders, setOrders] = useState<OrderProps[]>([
    {
    id: '123',
    patrimony: '3427398',
    when: '18/07/2022 as 10:00',
    status: 'open'
  },
  {
    id: '123',
    patrimony: '3427398',
    when: '18/07/2022 as 10:00',
    status: 'open'
  }
])

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
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack w={'full'} mt={8} mb={4} justifyContent='space-between' alignItems={'center'}>
          <Heading color={'gray.100'}>
            Solicitações
          </Heading>
          <Text color={'gray.200'}>
            3
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

        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Order data={item}/>}
        />
      </VStack>

      <Button
      title='Nova Solicitação'
      ml={5}
      mr={5}
      />
    </VStack>
  )
}