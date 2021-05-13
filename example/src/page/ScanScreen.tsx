import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Sound from 'react-native-sound';
import type { RootStackParamList } from '../App';

type ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ScanScreen'
>;

type ScreenRouteProp = RouteProp<RootStackParamList, 'ScanScreen'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export default class ScanScreen extends PureComponent<Props> {
  camera: any;
  whoosh: Sound | undefined;
  accessToken: string = '';

  componentDidMount() {
    const routeParams = this.props.route.params;
    const { accessToken } = routeParams;
    this.accessToken = accessToken;
    let whoosh = new Sound('scan.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          whoosh.getDuration() +
          'number of channels: ' +
          whoosh.getNumberOfChannels()
      );
      this.whoosh = whoosh;
    });
  }

  isOnBarCodeRead: boolean = false;
  _onBarCodeRead = ({ data }: { data: string }) => {
    if (!this.isOnBarCodeRead) {
      this.isOnBarCodeRead = true;
      // Play the sound with an onEnd callback
      this.whoosh &&
        this.whoosh.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
          setTimeout(() => {
            let infoArr = data
              .replace(/\r/gi, ',')
              .split(',')
              .filter((item) => item.trim() !== '');
            console.log('设备识别号', infoArr[1]);
            console.log('设备验证码', infoArr[2]);
            console.log('设备型号', infoArr[3]);
            this.props.navigation.navigate('ScanResult', {
              accessToken: this.accessToken,
              deviceSerial: infoArr[1],
              verifyCode: infoArr[2],
              deviceType: infoArr[3],
            });
            //为了增加识别的间隔，延迟500ms才将标志位设为false
            this.isOnBarCodeRead = false;
          }, 500);
        });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          onBarCodeRead={this._onBarCodeRead}
          captureAudio={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
