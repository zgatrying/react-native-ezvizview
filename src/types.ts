/**
 * 用途：定义type或类等信息
 * created by bran on 2021/03/24
 */

import type { NativeSyntheticEvent, ViewStyle } from 'react-native';
import type { ErrorCode } from './constant';

export type EzvizviewProps = {
  style?: ViewStyle;
  deviceSerial: string;
  cameraNo: number;
  verifyCode: string;
  onPlaySuccess?: () => void;
  onPlayFailed?: (event: onPlayFailedEvent) => void;
  onPressFullScreen?: () => void;
  showTopControlBar?: boolean; //是否显示顶部操作栏（放置了一个切换到横屏状态的按钮）
};

export type EzvizPlaybackViewProps = {
  style?: ViewStyle;
  deviceSerial: string;
  cameraNo: number;
  verifyCode: string;
  startTime: string;
  endTime: string;
  onPlaySuccess?: () => void;
  onPlayFailed?: (event: onPlayFailedEvent) => void;
  onCompletion?: () => void;
  onPressFullScreen?: () => void;
  showTopControlBar?: boolean; //是否显示顶部操作栏（放置了一个切换到横屏状态的按钮）
};

export type EzvizViewState = {
  isPlaying: boolean;
  isLoading: boolean;
  isLoadError: boolean;
  showControlView: boolean;
  hasCreated: boolean;
  errorHintTxt: string;
};

export type EzvizPlaybackViewState = {
  isPlaying: boolean;
  isLoading: boolean;
  isLoadError: boolean;
  hasCompletion: boolean;
  showControlView: boolean;
  hasCreated: boolean;
  errorHintTxt: string;
};

export type onPlayFailedNativeEvent = NativeSyntheticEvent<onPlayFailedEvent>;

export type onPlayFailedEvent = {
  errorCode: ErrorCode;
};
