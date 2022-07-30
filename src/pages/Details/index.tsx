import { HStack, Text, VStack, useTheme, ScrollView } from 'native-base';
import { Header } from '../../Components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { OrderProps } from '../../Components/Order';
import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore'
import { OrderFirestoreDTO } from '../../DTOs/OrderDTOs';
import { dateFormat } from '../../utils/firestoreDateFormat';
import { Loading } from '../../Components/Loading'
import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard } from 'phosphor-react-native'
import { CartDetails } from '../../Components/CartDetails';
import { Input } from '../../Components/input';
import { Button } from '../../Components/Button';
import { Alert } from 'react-native';

type RoutesParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string
  closed_at: string
}


export function Details() {
  const [isLoading, setIsloading] = useState(true)
  const [solution, setSolution] = useState('')
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)
  const route = useRoute()
  const { orderId } = route.params as RoutesParams
  const { colors } = useTheme()
  const navigation = useNavigation()


  function handleOrderClose() {
    if (!solution) {
      Alert.alert('Solicitação', 'Informe a solução')
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        Alert.alert('Solicitação encerrada')
        navigation.goBack()
      })
      .catch((error) => {
        console.log(error)
        Alert.alert('Não foi possível encerrar a solicitação')
      })
  }


  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { description, patrimony, status, closed_at, created_at, solution } = doc.data()

        const closed = closed_at ? dateFormat(closed_at) : null

        setOrder({
          id: doc.id,
          patrimony,
          description,
          solution,
          closed_at: closed,
          when: dateFormat(created_at),
          status,
        })
        setIsloading(false)

      })
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg={'gray.700'}>
      <Header title='Solicitações' />

      <HStack bg={'gray.500'} justifyContent='center' p={4}>
        {
          order.status === 'closed' ?
            <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }
        <Text
          fontSize={'sm'}
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform={'uppercase'}
        >
          {
            order.status === 'closed' ? 'Finalizado' : 'Em andamento'
          }
        </Text>
      </HStack>

      <ScrollView
        mx={5}
        showsVerticalScrollIndicator={false}
      >
        <CartDetails
          title='Equipamento'
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
        />

        <CartDetails
          title='Descrição do Problema'
          description={`Patrimônio ${order.description}`}
          icon={Clipboard}
        />

        <CartDetails
          title='Solução'
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed_at && `Encerrado em ${order.closed_at}`}
        >

          {
            order.status === 'open' &&
            <Input
              placeholder='Descrição do Problema'
              onChangeText={setSolution}
              h={24}
              textAlignVertical='top'
              multiline
            />
          }

        </CartDetails>

      </ScrollView>

      {
        !order.closed_at &&
        <Button
          title='Encerrar solicitação'
          m={5}
          onPress={handleOrderClose}
        />
      }


    </VStack>
  );
}