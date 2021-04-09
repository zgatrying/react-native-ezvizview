import { useFocusEffect } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { getEzAccessToken, openLoginPage } from 'react-native-ezvizview';
import { TextInput } from 'react-native-gesture-handler';
import type { RootStackParamList } from '../App';
import Divider from '../components/Divider';

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

export default function WelcomeScreen({ navigation }: Props) {
  const [accessToken, setAccessToken] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('C23525387');
  const [verifyCode, setVerifyCode] = useState('ZSRKBA');
  const [cameraNo, setCameraNo] = useState<number>(1);
  useFocusEffect(
    React.useCallback(() => {
      getEzAccessToken().then((res) => {
        console.log(res);
        setAccessToken(res.accessToken);
      });
      return () => {};
    }, [])
  );
  return (
    <View>
      {accessToken == '' ? (
        <View>
          <Button
            title="打开h5登录页"
            onPress={() => {
              openLoginPage();
            }}
          />
          <Text>
            问题说明：从h5登录页返回时，不会刷新该页面，需要重新载入一遍app
          </Text>
        </View>
      ) : (
        <View>
          <View
            style={{
              marginVertical: 12,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>萤石设备序列号: </Text>
              <TextInput
                value={deviceSerial}
                onChange={(e) => setDeviceSerial(e.nativeEvent.text)}
                style={{
                  color: '#ffffff',
                  marginVertical: 4,
                  backgroundColor: '#000000',
                  paddingHorizontal: 12,
                }}
                placeholderTextColor="#ffffff"
                keyboardType="default"
                placeholder="请输入萤石设备序列号"
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>萤石设备验证码: </Text>
              <TextInput
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.nativeEvent.text)}
                style={{
                  color: '#ffffff',
                  marginVertical: 4,
                  backgroundColor: '#000000',
                  paddingHorizontal: 12,
                }}
                placeholderTextColor="#ffffff"
                keyboardType="default"
                placeholder="请输入萤石设备验证码"
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>萤石设备通道号: </Text>
              <TextInput
                value={`${cameraNo}`}
                onChange={(e) => {
                  if (!isNaN(Number(e.nativeEvent.text))) {
                    setCameraNo(Number(e.nativeEvent.text));
                  }
                }}
                style={{
                  color: '#ffffff',
                  marginVertical: 4,
                  backgroundColor: '#000000',
                  paddingHorizontal: 12,
                }}
                placeholderTextColor="#ffffff"
                keyboardType="numeric"
                placeholder="请输入萤石设备通道号"
              />
            </View>
          </View>
          <Button
            title="查看摄像机实时画面"
            onPress={() => {
              if (accessToken) {
                navigation.navigate('RealPlay', {
                  accessToken,
                  deviceSerial,
                  cameraNo,
                  verifyCode,
                });
              } else {
                openLoginPage();
              }
            }}
          />
          <Divider />
          <Button
            title="查看告警信息列表"
            onPress={() => {
              navigation.navigate('AlarmList', {
                accessToken,
                deviceSerial,
                cameraNo,
                verifyCode,
              });
            }}
          />
        </View>
      )}
    </View>
  );
}
