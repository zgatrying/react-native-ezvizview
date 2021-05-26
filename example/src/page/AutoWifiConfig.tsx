import type { RouteProp } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Platform, Text, View } from 'react-native';
import {
  probeDeviceInfo,
  requestWhenInUseAuthorization,
  startConfigWifi,
  stopConfigWifi,
} from 'react-native-ezvizview';
import { TextInput } from 'react-native-gesture-handler';
import { addDevice } from '../api';
import type { RootStackParamList } from '../App';
import useAsyncEffect from 'use-async-effect';

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
  const [isOnConfig, setIsOnConfig] = useState(false);
  const [countDownTimeout, setCountDownTimeout] = useState(60);
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      requestWhenInUseAuthorization().then((granted) => {
        if (granted) {
          console.log('已获取定位权限');
        } else {
          console.log('获取定位权限失败');
          Alert.alert('提示', '请在设置中允许App使用定位权限后重试!', [
            {
              text: '确定',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        }
      });
    }
    return () => {
      stopConfigWifi();
    };
  }, [navigation]);

  useAsyncEffect(async () => {
    if (isOnConfig) {
      if (countDownTimeout > 0) {
        setTimeout(() => {
          setCountDownTimeout(countDownTimeout - 1);
        }, 1000);
      } else {
        setIsTimeout(true);
        setIsOnConfig(false);
        setCountDownTimeout(60);
        stopConfigWifi();
        let res = await probeDeviceInfo(deviceSerial, deviceType);
        console.log(
          '-->未接收到注册平台消息，超时后检查设备状态判断是否添加设备'
        );
        if (res.isAbleToAdd && !res.isNeedToConfigWifi) {
          handleAddDevice();
        }
      }
    }
  }, [isOnConfig, countDownTimeout]);

  const handleAddDevice = useCallback(async () => {
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
  }, [accessToken, deviceSerial, navigation, validateCode]);

  const handleConfigWifi = useCallback(async () => {
    if (ssid.trim() !== '') {
      setIsOnConfig(true);
      try {
        await startConfigWifi(deviceSerial, deviceType, ssid, password);
        console.log('------->>正常接收到注册平台消息，添加设备');
        await handleAddDevice();
        setIsOnConfig(false);
      } catch (error) {
        console.log('error', error.message);
      }
    }
  }, [deviceSerial, deviceType, handleAddDevice, password, ssid]);

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
          height: 40,
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
          height: 40,
          backgroundColor: '#fff',
          borderWidth: 2,
          paddingHorizontal: 12,
          marginBottom: 24,
        }}
        placeholder="请输入wifi密码，没有可不填"
        value={password}
        onChangeText={(v) => setPassword(v)}
      />
      {isOnConfig ? (
        <Text
          style={{
            marginVertical: 50,
            color: '#fff',
          }}
        >
          正在配网...，倒计时：{countDownTimeout}
        </Text>
      ) : isTimeout ? (
        <Button
          title="配网超时，点击重试"
          disabled={ssid.trim() === ''}
          onPress={handleConfigWifi}
        />
      ) : (
        <Button
          title="开始配网"
          disabled={ssid.trim() === ''}
          onPress={handleConfigWifi}
        />
      )}
    </View>
  );
}
