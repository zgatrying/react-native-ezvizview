/**
 * 用途：播放器组件-回放录像
 * created by bran on 2021/03/23
 */

import React, { Component, ReactChild, ReactChildren } from 'react';
import { findNodeHandle, UIManager, View } from 'react-native';
import Loading from './components/Loading';
import PlayControl from './components/PlayControl';
import { EzvizPlayerControlCommand } from './constant';
import { RCTEzvizPlaybackView } from './NativeComponents';
import type {
  EzvizPlaybackViewProps,
  EzvizPlaybackViewState,
  onPlayFailedNativeEvent,
} from './types';
import { getHintByErrorCodeType } from './utils';

export default class EzvizPlaybackView extends Component<
  EzvizPlaybackViewProps,
  EzvizPlaybackViewState
> {
  state: EzvizPlaybackViewState = {
    isLoading: false,
    isPlaying: false,
    isLoadError: false,
    hasCreated: false,
    showControlView: true,
    hasCompletion: false,
    errorHintTxt: '',
  };

  _rctRzvizView: any;

  componentWillUnmount() {
    if (this.state.hasCreated) {
      this.releaselayer();
    }
  }

  //@ts-ignore
  _setRoot = (node) => {
    if (node) {
      this._rctRzvizView = node;
      this.createPlaer();
    }
  };

  _sendCommand(command: string) {
    if (this._rctRzvizView) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._rctRzvizView),
        //@ts-ignore
        UIManager.getViewManagerConfig('RCTEzvizPlaybackView').Commands[
          command
        ],
        []
      );
    }
  }

  startPlayer() {
    if (this.state.hasCreated) {
      if (this.state.hasCompletion) {
        this.rePlay();
      } else {
        this.resumePlay();
      }
    } else {
      this.createPlaer();
    }
  }

  createPlaer() {
    this.setState({
      hasCreated: true,
      isLoading: true,
    });
    this._sendCommand(EzvizPlayerControlCommand.CREATE_PLAYER);
  }

  releaselayer() {
    this._sendCommand(EzvizPlayerControlCommand.RELEASE_PLAYER);
  }

  rePlay() {
    this.setState({
      hasCompletion: false,
      isPlaying: false,
      isLoading: true,
    });
    this._sendCommand(EzvizPlayerControlCommand.REPLAY);
  }

  resumePlay() {
    this.setState({
      isLoading: false,
      isPlaying: true,
    });
    this._sendCommand(EzvizPlayerControlCommand.RESUME);
  }

  pause() {
    this.setState({
      isLoading: false,
      isPlaying: false,
    });
    this._sendCommand(EzvizPlayerControlCommand.PAUSE);
  }

  _onPlaySuccess = () => {
    console.log('_onPlaySuccess');
    this.setState({ isLoading: false, isPlaying: true });
    this.props.onPlaySuccess && this.props.onPlaySuccess();
  };
  _onPlayFailed = ({ nativeEvent }: onPlayFailedNativeEvent) => {
    console.log('_onPlayFailed', nativeEvent);
    const errorHint: string = getHintByErrorCodeType(nativeEvent.errorCode);
    this.setState({
      isLoading: false,
      isPlaying: false,
      isLoadError: true,
      hasCompletion: true,
      errorHintTxt: errorHint,
    });
    this.props.onPlayFailed && this.props.onPlayFailed(nativeEvent);
  };
  _onCompletion = () => {
    console.log('_onCompletion');
    this.setState({
      isPlaying: false,
      isLoading: false,
      hasCompletion: true,
      showControlView: true,
    });
    this.props.onCompletion && this.props.onCompletion();
  };

  renderWithMask(children: ReactChildren | ReactChild) {
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </View>
    );
  }

  _toggleShowControlView = () => {
    this.setState({
      showControlView: !this.state.showControlView,
    });
  };

  render() {
    const {
      style,
      deviceSerial,
      cameraNo,
      verifyCode,
      startTime,
      endTime,
      onPressFullScreen,
    } = this.props;
    const { isLoading, isPlaying, showControlView } = this.state;
    return (
      <View
        onStartShouldSetResponder={() => true}
        onResponderStart={this._toggleShowControlView}
        style={[
          {
            position: 'relative',
            backgroundColor: '#000',
          },
          style,
        ]}
      >
        <RCTEzvizPlaybackView
          style={{
            width: '100%',
            flex: 1,
          }}
          ref={this._setRoot}
          deviceSerial={deviceSerial}
          cameraNo={cameraNo}
          verifyCode={verifyCode}
          startTime={startTime}
          endTime={endTime}
          onPlaySuccess={this._onPlaySuccess}
          onPlayFailed={this._onPlayFailed}
          onCompletion={this._onCompletion}
        />
        {isLoading && this.renderWithMask(<Loading />)}
        <PlayControl
          visible={showControlView}
          isPlaying={isPlaying}
          onPause={() => this.pause()}
          onPlay={() => this.startPlayer()}
          onReplay={() => this.rePlay()}
          onPressFullScreen={onPressFullScreen}
        />
      </View>
    );
  }
}
