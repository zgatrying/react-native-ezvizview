import type { RouteProp } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { useAsyncEffect } from 'use-async-effect';
import { DeviceInfo, getDeviceInfo } from '../api';
import type { RootStackParamList } from '../App';

type DeviceInfoScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'DeviceInfo'
>;

type DeviceInfoScreenRoute = RouteProp<RootStackParamList, 'DeviceInfo'>;

type Props = {
  route: DeviceInfoScreenRoute;
  navigation: DeviceInfoScreenNavigationProps;
};

export default function DeviceInfoScreen({ route, navigation }: Props) {
  const routeParams = route.params;
  const { accessToken, deviceSerial } = routeParams;
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>();

  useAsyncEffect(async () => {
    let deviceInfoData = await getDeviceInfo({
      accessToken,
      deviceSerial,
    });
    console.log('单个设备信息：', deviceInfoData);
    setDeviceInfo(deviceInfoData);
  }, [accessToken, deviceSerial]);

  let alarmSoundText = '';
  if (deviceInfo) {
    switch (deviceInfo.alarmSoundMode) {
      case 0:
        alarmSoundText = '短叫';
        break;
      case 1:
        alarmSoundText = '长叫';
        break;
      case 2:
        alarmSoundText = '静音';
        break;
    }
  }

  return (
    <View>
      {deviceInfo && (
        <View>
          <View
            style={{
              marginVertical: 6,
              paddingVertical: 12,
              marginHorizontal: 24,
              paddingHorizontal: 24,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}
          >
            <Text>设备名称：{deviceInfo.deviceName}</Text>
            <Text>设备序列号：{deviceInfo.deviceSerial}</Text>
            <Text>设备型号：{deviceInfo.model}</Text>
            <Text>是否在线：{deviceInfo.status === 0 ? '不在线' : '在线'}</Text>
            <Text>
              是否加密：{deviceInfo.isEncrypt === 0 ? '不加密' : '加密'}
            </Text>
            <Text>
              布撤防状态：{deviceInfo.defence === 0 ? '撤防' : '布防'}
            </Text>
            <Text>告警声音模式：{alarmSoundText}</Text>
            <Text>网络类型：{deviceInfo.netType}</Text>
            <Text>
              下线通知：{deviceInfo.offlineNotify === 0 ? '不通知' : '通知'}
            </Text>
            <Text>信号强度：{deviceInfo.signal}</Text>
          </View>

          {deviceInfo.netType === 'wireless' && deviceInfo.status === 0 && (
            <Button
              title="前往无线配网"
              onPress={() => {
                navigation.navigate('AutoWifiConfig', {
                  deviceSerial: deviceInfo.deviceSerial,
                  deviceType: deviceInfo.model,
                });
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}
