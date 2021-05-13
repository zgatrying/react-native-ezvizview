import { RouteProp, useIsFocused } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import useAsyncEffect from 'use-async-effect';
import { DeviceInfo, getDeviceInfo } from '../api';
import type { RootStackParamList } from '../App';
import Divider from '../components/Divider';

type ScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'ScanResult'
>;

type ScreenRoute = RouteProp<RootStackParamList, 'ScanResult'>;

type Props = {
  route: ScreenRoute;
  navigation: ScreenNavigationProps;
};

export default function ScanResultScreen({ route, navigation }: Props) {
  const routeParams = route.params;
  const { accessToken, deviceSerial, verifyCode, deviceType } = routeParams;
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | undefined>(
    undefined
  );

  const isFocused = useIsFocused();

  useAsyncEffect(async () => {
    let info = await getDeviceInfo({
      accessToken,
      deviceSerial,
    });
    setDeviceInfo(info);
    if (info === undefined) {
      navigation.setOptions({
        title: '添加设备',
      });
    } else {
      navigation.setOptions({
        title: '设备详情',
      });
    }
  }, [isFocused]);

  return (
    <View>
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
          <Text>设备序列号：{deviceSerial}</Text>
          <Text>设备型号：{deviceType}</Text>
          <Text>设备验证码：{verifyCode}</Text>
          <Text>
            是否已绑定：{deviceInfo !== undefined ? '已绑定' : '未绑定'}
          </Text>
          {deviceInfo !== undefined && (
            <Text>是否在线：{deviceInfo.status === 0 ? '不在线' : '在线'}</Text>
          )}
        </View>

        {(deviceInfo === undefined ||
          (deviceInfo && deviceInfo.status === 0)) && (
          <Button
            title="下一步"
            onPress={() => {
              navigation.navigate('AutoWifiConfig', {
                deviceSerial,
                deviceType,
                validateCode: verifyCode,
                accessToken,
              });
            }}
          />
        )}
        {deviceInfo && deviceInfo.status === 1 && (
          <View>
            <Divider />
            <Button
              title="前往查看摄像机实时画面"
              onPress={() => {
                navigation.navigate('RealPlay', {
                  accessToken,
                  deviceSerial,
                  verifyCode,
                  cameraNo: 1,
                });
              }}
            />
            <Divider />
            <Button
              title="前往查看摄像机告警消息列表"
              onPress={() => {
                navigation.navigate('AlarmList', {
                  accessToken,
                  deviceSerial,
                  verifyCode,
                  cameraNo: 1,
                });
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
