import type { RouteProp } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAsyncEffect } from 'use-async-effect';
import { BindDevice, getDeveloperBindDeviceList } from '../api';
import type { RootStackParamList } from '../App';

type DeviceListScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'DeviceList'
>;

type DeviceListScreenRoute = RouteProp<RootStackParamList, 'DeviceList'>;

type Props = {
  route: DeviceListScreenRoute;
  navigation: DeviceListScreenNavigationProps;
};

export default function DeviceListScreen({ route, navigation }: Props) {
  const routeParams = route.params;
  const { accessToken } = routeParams;
  const [deviceList, setDeviceList] = useState<BindDevice[]>([]);

  useAsyncEffect(async () => {
    let list = await getDeveloperBindDeviceList({ accessToken });
    console.log('已绑定设备列表:', list);
    setDeviceList(list);
  }, [accessToken]);

  return (
    <View>
      {deviceList.map((device) => (
        <TouchableOpacity
          key={device.id}
          style={{
            marginVertical: 6,
            paddingVertical: 12,
            marginHorizontal: 24,
            paddingHorizontal: 24,
            backgroundColor: '#fff',
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.navigate('DeviceInfo', {
              accessToken,
              deviceSerial: device.deviceSerial,
            });
          }}
        >
          <View>
            <Text>绑定时间: {new Date(device.addTime).toString()}</Text>
            <Text>设备名称：{device.deviceName}</Text>
            <Text>设备序列号：{device.deviceSerial}</Text>
            <Text>布撤防状态：{device.defence === 0 ? '撤防' : '布防'}</Text>
            <Text>是否在线：{device.status === 0 ? '不在线' : '在线'}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
