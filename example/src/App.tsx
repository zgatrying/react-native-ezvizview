import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RealyPlayScreen from './page/RealPlayScreen';
import WelcomeScreen from './page/WelcomeScreen';
import AlarmListScreen from './page/AlarmListScreen';
import PlaybackScreen from './page/PlaybackScreen';
import type { DeviceAlarmListItem } from 'src/ys_api';
import DeviceListScreen from './page/DeviceListScreen';
import DeviceInfoScreen from './page/DeviceInfoScreen';
import AutoWifiConfigScreen from './page/AutoWifiConfig';
import ScanScreen from './page/ScanScreen';

const Stack = createStackNavigator();

type EzvizTestInfo = {
  accessToken: string;
  deviceSerial: string;
  cameraNo: number;
  verifyCode: string;
};

export type RootStackParamList = {
  Welcome: undefined;
  RealPlay: EzvizTestInfo;
  AlarmList: EzvizTestInfo;
  Playback: EzvizTestInfo & {
    alarmInfo: DeviceAlarmListItem;
  };
  DeviceList: {
    accessToken: string;
  };
  DeviceInfo: {
    accessToken: string;
    deviceSerial: string;
  };
  AutoWifiConfig: {
    deviceSerial: string;
    deviceType: string;
  };
  ScanScreen: undefined;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          options={{ title: '萤石RN库功能演示' }}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="RealPlay"
          options={{ title: '实时预览' }}
          component={RealyPlayScreen}
        />
        <Stack.Screen
          name="AlarmList"
          options={{ title: '设备告警消息列表' }}
          component={AlarmListScreen}
        />
        <Stack.Screen
          name="Playback"
          options={{ title: '回放' }}
          component={PlaybackScreen}
        />
        <Stack.Screen
          name="DeviceList"
          options={{ title: '已添加设备列表' }}
          component={DeviceListScreen}
        />
        <Stack.Screen
          name="DeviceInfo"
          options={{ title: '已添加设备信息页' }}
          component={DeviceInfoScreen}
        />
        <Stack.Screen
          name="AutoWifiConfig"
          options={{ title: '设备配网' }}
          component={AutoWifiConfigScreen}
        />
        <Stack.Screen
          name="ScanScreen"
          options={{ title: '扫一扫' }}
          component={ScanScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
