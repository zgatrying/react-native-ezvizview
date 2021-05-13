import type { RouteProp } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Alert, Button, View } from 'react-native';
import { configWifi } from 'react-native-ezvizview';
import { TextInput } from 'react-native-gesture-handler';
import { addDevice } from '../api';
import type { RootStackParamList } from '../App';

type ScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'AutoWifiConfig'
>;

type ScreenRoute = RouteProp<RootStackParamList, 'AutoWifiConfig'>;

type Props = {
  route: ScreenRoute;
  navigation: ScreenNavigationProps;
};

export default function AutoWifiConfigScreen({ route, navigation }: Props) {
  const routeParams = route.params;
  const { accessToken, deviceSerial, deviceType, validateCode } = routeParams;
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  console.log('deviceSerial', deviceSerial);
  return (
    <View
      style={{
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 30,
      }}
    >
      <TextInput
        style={{
          backgroundColor: '#fff',
          borderWidth: 2,
          paddingHorizontal: 12,
        }}
        placeholder="请输入wifi名称"
        value={ssid}
        onChangeText={(v) => setSsid(v)}
      />
      <TextInput
        style={{
          backgroundColor: '#fff',
          borderWidth: 2,
          paddingHorizontal: 12,
          marginBottom: 24,
        }}
        placeholder="请输入wifi密码，没有可不填"
        value={password}
        onChangeText={(v) => setPassword(v)}
      />
      <Button
        title="确定"
        disabled={ssid.trim() === ''}
        onPress={async () => {
          if (ssid.trim() !== '') {
            try {
              await configWifi(
                deviceSerial,
                deviceType,
                validateCode,
                ssid,
                password
              );
              await addDevice({
                accessToken,
                deviceSerial,
                validateCode,
              });
              Alert.alert('设备添加成功', '', [
                {
                  text: '确定',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ]);
            } catch (error) {
              Alert.alert('配网失败', error.message);
            }
          }
        }}
      />
    </View>
  );
}
