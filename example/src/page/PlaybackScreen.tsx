import type { RouteProp } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { EzvizPlaybackView } from 'react-native-ezvizview';
import type { RootStackParamList } from '../App';

type PlaybackScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'Playback'
>;

type PlaybackScreenRoute = RouteProp<RootStackParamList, 'Playback'>;

type Props = {
  route: PlaybackScreenRoute;
  navigation: PlaybackScreenNavigationProps;
};

export default function PlaybackScreen({ route }: Props) {
  const { deviceSerial, verifyCode, cameraNo, alarmInfo } = route.params;
  const startTime = alarmInfo.alarmTime - alarmInfo.preTime * 1000;
  const endTime = alarmInfo.alarmTime + alarmInfo.delayTime * 1000;

  const formatTime = (time: number) => {
    // format: yy-MM-dd HH:mm:ss
    let date = new Date(time);
    let mYear = date.getFullYear();
    let mMonth = date.getMonth();
    let mDate = date.getDate();
    let mHour = date.getHours();
    let mMinutes = date.getMinutes();
    let mSeconds = date.getSeconds();
    const formatNum = (n: number) => {
      return n >= 10 ? `${n}` : `0${n}`;
    };
    return `${mYear}-${formatNum(mMonth + 1)}-${mDate} ${formatNum(
      mHour
    )}:${formatNum(mMinutes)}:${formatNum(mSeconds)}`;
  };

  return (
    <View>
      <View>
        <Text>告警消息ID：{alarmInfo.alarmId}</Text>
        <Text>告警消息类型：{alarmInfo.alarmType}</Text>
        <Text>是否加密：{alarmInfo.isEncrypt}</Text>
        <Text>是否已读：{alarmInfo.isChecked}</Text>
        <Text>存储类型：{alarmInfo.recState}</Text>
        <Text>告警瞬间：</Text>
        <Image
          source={{ uri: alarmInfo.alarmPicUrl }}
          style={{
            width: '100%',
            height: 200,
          }}
          resizeMode="stretch"
          resizeMethod="auto"
        />
        <Text>告警录像回放：</Text>
        <EzvizPlaybackView
          style={{
            width: '100%',
            height: 200,
          }}
          deviceSerial={deviceSerial}
          verifyCode={verifyCode}
          cameraNo={cameraNo}
          startTime={formatTime(startTime)}
          endTime={formatTime(endTime)}
        />
      </View>
    </View>
  );
}
