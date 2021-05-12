import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { setEzAccessToken } from 'react-native-ezvizview';
import { TextInput } from 'react-native-gesture-handler';
import { getAccessToken } from '../api';
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
  const [deviceSerial, setDeviceSerial] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [cameraNo, setCameraNo] = useState<number>(1);
  return (
    <View>
      {accessToken === '' ? (
        <View>
          <Button
            title="获取AccessToken"
            onPress={async () => {
              //获取AccessToken并设置AccessToken
              const developerAccessToken = await getAccessToken();
              if (developerAccessToken) {
                setAccessToken(developerAccessToken);
                setEzAccessToken(developerAccessToken);
              }
            }}
          />
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
            disabled={deviceSerial.trim() === '' || verifyCode.trim() === ''}
            title="查看摄像机实时画面"
            onPress={() => {
              if (accessToken) {
                navigation.navigate('RealPlay', {
                  accessToken,
                  deviceSerial,
                  cameraNo,
                  verifyCode,
                });
              }
            }}
          />
          <Divider />
          <Button
            disabled={deviceSerial.trim() === '' || verifyCode.trim() === ''}
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
          <Divider />
          <Button
            title="查看已添加设备列表"
            onPress={() => {
              navigation.navigate('DeviceList', {
                accessToken,
              });
            }}
          />
          <Divider />
          <Button
            title="扫码添加设备"
            onPress={() => {
              navigation.navigate('ScanScreen');
            }}
          />
        </View>
      )}
    </View>
  );
}
