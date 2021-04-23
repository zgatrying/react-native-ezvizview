import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import EzvizView, {
  IPCDefenceType,
  PTZ_POZITION,
  setDefence,
  setPTZ,
  Speed,
  stopPTZ,
} from 'react-native-ezvizview';
import type { RootStackParamList } from '../App';

type RealPlayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RealPlay'
>;

type RealPlayScreenRouteProp = RouteProp<RootStackParamList, 'RealPlay'>;

type Props = {
  route: RealPlayScreenRouteProp;
  navigation: RealPlayScreenNavigationProp;
};

export default function RealyPlayScreen({ route }: Props) {
  const [direction, setDirection] = useState<PTZ_POZITION | '停'>('停');
  const routeParams = route.params;
  const { accessToken, deviceSerial, verifyCode, cameraNo } = routeParams;
  console.log(accessToken, deviceSerial, verifyCode, cameraNo);
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <Text style={[styles.text, styles.subTitle]}>实时预览</Text>
        <EzvizView
          deviceSerial={deviceSerial}
          cameraNo={cameraNo}
          verifyCode={verifyCode}
          style={styles.box}
        />
        <Text style={[styles.text, styles.subTitle]}>云台控制</Text>
        <Text style={styles.text}>移动方向：{direction}</Text>
        <Text style={[styles.text, styles.hightLightHint]}>
          注意：在做其他操作前必须先按停
        </Text>
        <Button
          onPress={() => {
            setPTZ({
              accessToken,
              deviceSerial: deviceSerial,
              channelNo: cameraNo,
              speed: Speed.MID,
              direction: PTZ_POZITION.UP,
            });
            setDirection(PTZ_POZITION.UP);
          }}
          title="上"
        />
        <Button
          onPress={() => {
            setPTZ({
              accessToken,
              deviceSerial: deviceSerial,
              channelNo: cameraNo,
              speed: Speed.MID,
              direction: PTZ_POZITION.DOWN,
            });
            setDirection(PTZ_POZITION.DOWN);
          }}
          title="下"
        />
        <Button
          onPress={() => {
            if (direction !== '停') {
              stopPTZ({
                accessToken,
                deviceSerial: deviceSerial,
                channelNo: cameraNo,
                direction: direction,
              });
            }
          }}
          title="停"
        />
        <Button
          onPress={() => {
            setPTZ({
              accessToken,
              deviceSerial: deviceSerial,
              channelNo: cameraNo,
              speed: Speed.MID,
              direction: PTZ_POZITION.LEFT,
            });
            setDirection(PTZ_POZITION.LEFT);
          }}
          title="左"
        />
        <Button
          onPress={() => {
            setPTZ({
              accessToken,
              deviceSerial: deviceSerial,
              channelNo: cameraNo,
              speed: Speed.MID,
              direction: PTZ_POZITION.RIGHT,
            });
            setDirection(PTZ_POZITION.RIGHT);
          }}
          title="右"
        />
        <Text style={[styles.text, styles.subTitle]}>布撤防</Text>
        <Button
          title="布防"
          onPress={() => {
            setDefence({
              accessToken,
              deviceSerial,
              isDefence: IPCDefenceType.DEPLOY,
            });
          }}
        />
        <Button
          title="撤防"
          onPress={() => {
            setDefence({
              accessToken,
              deviceSerial,
              isDefence: IPCDefenceType.DISARM,
            });
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: '100%',
    height: 230,
    backgroundColor: '#000',
  },
  button: {
    width: '100%',
    marginVertical: 4,
  },
  subTitle: {
    paddingVertical: 4,
    backgroundColor: '#ffffff',
    color: '#000000',
    textAlign: 'center',
  },
  text: {
    color: '#000000',
    textAlign: 'left',
    width: '100%',
  },
  hightLightHint: {
    color: 'red',
    fontWeight: 'bold',
  },
});
