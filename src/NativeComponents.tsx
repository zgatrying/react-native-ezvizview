import {
  HostComponent,
  NativeSyntheticEvent,
  requireNativeComponent,
  ViewStyle,
} from 'react-native';
import type { onPlayFailedEvent } from './types';

export type RCTEzvizViewProps = {
  style?: ViewStyle;
  deviceSerial: string;
  cameraNo: number;
  verifyCode: string;
  onPlaySuccess: () => void;
  onPlayFailed: (event: NativeSyntheticEvent<onPlayFailedEvent>) => void;
  onLoad: () => void;
};

export type RCTEzvizPlaybackViewProps = {
  style?: ViewStyle;
  deviceSerial: string;
  cameraNo: number;
  verifyCode: string;
  startTime: string;
  endTime: string;
  onPlaySuccess: () => void;
  onPlayFailed: (event: NativeSyntheticEvent<onPlayFailedEvent>) => void;
  onCompletion: () => void;
};

/*global globalThis*/
export type GlobalThisWithRCT = typeof globalThis & {
  RCTEzvizView: HostComponent<RCTEzvizViewProps>;
  RCTEzvizPlaybackView: HostComponent<RCTEzvizPlaybackViewProps>;
};

/*global globalThis*/
const newglobalThis = globalThis as GlobalThisWithRCT;

//避免在使用热重载情况下，修改代码时rn弹出的报错提示：Tried to register two views with the same name RCTEzvizView
if (!newglobalThis['RCTEzvizView']) {
  newglobalThis['RCTEzvizView'] = requireNativeComponent<RCTEzvizViewProps>(
    'RCTEzvizView'
  );
}

//避免在使用热重载情况下，修改代码时rn弹出的报错提示：Tried to register two views with the same name
if (!newglobalThis['RCTEzvizPlaybackView']) {
  newglobalThis[
    'RCTEzvizPlaybackView'
  ] = requireNativeComponent<RCTEzvizPlaybackViewProps>('RCTEzvizPlaybackView');
}

export const RCTEzvizView: HostComponent<RCTEzvizViewProps> =
  newglobalThis['RCTEzvizView'];

export const RCTEzvizPlaybackView: HostComponent<RCTEzvizPlaybackViewProps> =
  newglobalThis['RCTEzvizPlaybackView'];
