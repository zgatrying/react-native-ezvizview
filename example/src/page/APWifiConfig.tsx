import type { RouteProp } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Switch, Text, TextInput, View } from 'react-native';
import {
  probeDeviceInfo,
  startAPConfigWifi,
  stopAPConfigWifi,
} from 'react-native-ezvizview';
import { addDevice } from '../api';
import type { RootStackParamList } from '../App';
import useAsyncEffect from 'use-async-effect';

type ScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'APWifiConfig'
>;

type ScreenRoute = RouteProp<RootStackParamList, 'APWifiConfig'>;

type Props = {
  route: ScreenRoute;
  navigation: ScreenNavigationProps;
};

export default function APWifiConfigScreen({ route, navigation }: Props) {
  const routeParams = route.params;
  const { accessToken, deviceSerial, deviceType, validateCode } = routeParams;
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [isOnConfig, setIsOnConfig] = useState(false);
  const [countDownTimeout, setCountDownTimeout] = useState(60);
  const [isTimeout, setIsTimeout] = useState(false);
  const [confirmLinkAP, setConfirmLinkAP] = useState(false);
  const [startToCheckStatus, setStartToCheckStatus] = useState(false);

  const deviceHotspotSSID = `EZVIZ_${deviceSerial}`; //"EZVIZ_"+设备序列号
  const deviceHotspotPwd = `EZVIZ_${validateCode}`; //"EZVIZ_"+设备验证码
  useEffect(() => {
    return () => {
      stopAPConfigWifi();
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
        stopAPConfigWifi();
      }
    }
  }, [isOnConfig, countDownTimeout]);

  const handleAddDevice = useCallback(async () => {
    let res = await addDevice({
      accessToken,
      deviceSerial,
      validateCode,
    });
    console.log('添加设备接口回调', res);
    if (res.data.code === '200') {
      Alert.alert('设备添加成功', '', [
        {
          text: '确定',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
      setCountDownTimeout(60);
      setIsOnConfig(false);
      checkOnlineTimer.current && clearInterval(checkOnlineTimer.current);
    }
  }, [accessToken, deviceSerial, navigation, validateCode]);

  const handleConfigWifi = useCallback(async () => {
    if (wifiSSID.trim() !== '') {
      setIsOnConfig(true);
      await startAPConfigWifi(
        wifiSSID,
        wifiPassword,
        deviceSerial,
        validateCode
      );
      setStartToCheckStatus(true);
    }
  }, [deviceSerial, wifiSSID, wifiPassword, validateCode]);

  const checkOnlineTimer = useRef<NodeJS.Timer | null>(null);
  const checkCount = useRef(0);
  const MAX_CHECK_ONLINE_COUNT = 20;

  useAsyncEffect(async () => {
    if (startToCheckStatus) {
      checkOnlineTimer.current = setInterval(async () => {
        checkCount.current += 1;
        console.log(`第${checkCount.current}次检查设备状态`);
        if (checkCount.current > MAX_CHECK_ONLINE_COUNT) {
          checkOnlineTimer.current && clearInterval(checkOnlineTimer.current);
        } else {
          let res = await probeDeviceInfo(deviceSerial, deviceType);
          if (res.isAbleToAdd && !res.isNeedToConfigWifi) {
            handleAddDevice();
          }
        }
      }, 3000);
    }
    return () => {
      checkOnlineTimer.current && clearInterval(checkOnlineTimer.current);
    };
  }, [startToCheckStatus]);

  return (
    <View
      style={{
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 30,
      }}
    >
      <View>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18,
            lineHeight: 24,
          }}
        >
          请连接设备AP热点，SSID：{deviceHotspotSSID}, password：
          {deviceHotspotPwd}
        </Text>
      </View>
      <View
        style={{
          marginVertical: 48,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff' }}>确认已连接设备AP热点</Text>
        <Switch
          value={confirmLinkAP}
          onValueChange={(v) => setConfirmLinkAP(v)}
        />
      </View>

      <View
        style={{
          backgroundColor: '#fff',
        }}
      >
        <Text
          style={{
            color: '#000',
            fontSize: 16,
            textAlign: 'center',
            borderBottomWidth: 1,
          }}
        >
          路由器Wifi的SSID与密码
        </Text>

        <TextInput
          style={{
            paddingHorizontal: 12,
            marginVertical: 12,
          }}
          placeholder="请输入路由器SSID"
          value={wifiSSID}
          onChangeText={(v) => setWifiSSID(v)}
        />

        <TextInput
          style={{
            paddingHorizontal: 12,
            marginVertical: 12,
          }}
          placeholder="请输入路由器wifi密码"
          value={wifiPassword}
          onChangeText={(v) => setWifiPassword(v)}
        />
      </View>

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
        <Button title="配网超时，点击重试" onPress={handleConfigWifi} />
      ) : (
        <Button
          disabled={!confirmLinkAP || wifiSSID.trim() === ''}
          title="开始配网"
          onPress={handleConfigWifi}
        />
      )}
    </View>
  );
}
