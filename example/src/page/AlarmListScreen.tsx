import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  AlarmStatus,
  decryptUrl,
  getDeviceAlarmList,
} from 'react-native-ezvizview';
import type { DeviceAlarmListItem } from 'src/ys_api';
import type { RootStackParamList } from '../App';

type AlarmListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AlarmList'
>;

type AlarmListRouteProp = RouteProp<RootStackParamList, 'AlarmList'>;

type Props = {
  route: AlarmListRouteProp;
  navigation: AlarmListScreenNavigationProp;
};

export default function AlarmListScreen({ route, navigation }: Props) {
  const routeParams = route.params;
  const { accessToken, deviceSerial, verifyCode, cameraNo } = routeParams;
  console.log(deviceSerial, verifyCode, cameraNo);
  const [alarmList, setAlarmList] = useState<Array<DeviceAlarmListItem>>([]);
  useEffect(() => {
    let lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    getDeviceAlarmList({
      deviceSerial,
      accessToken,
      startTime: lastMonthDate.getTime(),
      status: AlarmStatus.TOTAL,
      pageSize: 50,
    }).then((res) => {
      let deviceAlarmList = res.data.data;
      console.log(deviceAlarmList);
      let decryptUrlFuncList = deviceAlarmList.map(async (item) => {
        item.alarmPicUrl = await decryptUrl(item.alarmPicUrl, verifyCode);
        return item;
      });
      Promise.all(decryptUrlFuncList).then((list) => {
        setAlarmList(list);
      });
    });
    return () => {};
  }, [deviceSerial, accessToken, verifyCode]);
  return (
    <ScrollView>
      <View>
        {alarmList.map((item) => {
          return (
            <TouchableWithoutFeedback
              key={item.alarmId}
              onPress={() => {
                navigation.navigate('Playback', {
                  accessToken,
                  deviceSerial,
                  verifyCode,
                  cameraNo,
                  alarmInfo: item,
                });
              }}
            >
              <View
                style={{
                  marginVertical: 12,
                  marginHorizontal: 12,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: item.alarmPicUrl }}
                  style={{
                    width: '100%',
                    height: 200,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  }}
                  resizeMode="stretch"
                  resizeMethod="auto"
                />
                <Text
                  style={{
                    textAlign: 'center',
                    paddingVertical: 12,
                    color: '#ffffff',
                    backgroundColor: '#000000',
                  }}
                >
                  {item.isEncrypt ? '已加密' : '未加密'}- 告警时间:{' '}
                  {new Date(item.alarmTime).toDateString()}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </ScrollView>
  );
}
