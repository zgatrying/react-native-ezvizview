import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { setEzAccessToken } from 'react-native-ezvizview';
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
              navigation.navigate('ScanScreen', {
                accessToken,
              });
            }}
          />
        </View>
      )}
    </View>
  );
}
