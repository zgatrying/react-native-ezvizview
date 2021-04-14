/**
 * 用途：播放器组件-实时预览
 * created by bran on 2021/03/23
 */

import React, { Component, ReactChild, ReactChildren } from 'react';
import { findNodeHandle, UIManager, View } from 'react-native';
import Loading from './components/Loading';
import PlayControl from './components/PlayControl';
import { EzvizPlayerControlCommand } from './constant';
import { RCTEzvizView } from './NativeComponents';
import type {
  EzvizviewProps,
  EzvizViewState,
  onPlayFailedNativeEvent,
} from './types';
import { getHintByErrorCodeType } from './utils';

export default class EzvizView extends Component<
  EzvizviewProps,
  EzvizViewState
> {
  state: EzvizViewState = {
    isLoading: false,
    isPlaying: false,
    showControlView: true,
    hasCreated: false,
    isLoadError: false,
    errorHintTxt: '',
  };

  _rctRzvizView: any;

  componentWillUnmount() {
    if (this.state.hasCreated) {
      this.releasePlayer();
    }
  }

  //@ts-ignore
  _setRoot = (node) => {
    if (node) {
      this._rctRzvizView = node;

      // 由于ios端触发ref回调时，prop属性还未赋值到原生组件，因此不再在ref回调中执行播放动作。
      // this.startPlayer();
    }
  };

  _sendCommand(command: string) {
    if (this._rctRzvizView) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this._rctRzvizView),
        //@ts-ignore
        UIManager.getViewManagerConfig('RCTEzvizView').Commands[command],
        []
      );
    }
  }

  releasePlayer() {
    this._sendCommand(EzvizPlayerControlCommand.RELEASE_PLAYER);
  }

  startPlayer() {
    if (this.state.hasCreated) {
      this.rePlay();
    } else {
      this.createPlaer();
    }
  }

  createPlaer() {
    this.setState({
      isLoading: true,
      hasCreated: true,
    });
    this._sendCommand(EzvizPlayerControlCommand.CREATE_PLAYER);
  }

  rePlay() {
    const { isPlaying } = this.state;
    if (!isPlaying) {
      this.setState({
        isPlaying: false,
        isLoading: true,
      });
      this._sendCommand(EzvizPlayerControlCommand.REPLAY);
    }
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
    this.setState({
      isLoading: false,
      isPlaying: true,
    });
    this.props.onPlaySuccess && this.props.onPlaySuccess();
  };
  _onPlayFailed = ({ nativeEvent }: onPlayFailedNativeEvent) => {
    console.log('_onPlayFailed', nativeEvent);
    const errorHint: string = getHintByErrorCodeType(nativeEvent.errorCode);
    this.setState({
      errorHintTxt: errorHint,
      isLoading: false,
      isPlaying: false,
      isLoadError: true,
    });
    this.props.onPlayFailed && this.props.onPlayFailed(nativeEvent);
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
      onPressFullScreen,
    } = this.props;
    const { isLoading, isPlaying, showControlView } = this.state;
    return (
      <View
        style={[
          {
            position: 'relative',
            backgroundColor: '#000',
          },
          style,
        ]}
        onStartShouldSetResponder={() => true}
        onResponderStart={this._toggleShowControlView}
      >
        <RCTEzvizView
          ref={this._setRoot}
          style={{
            width: '100%',
            flex: 1,
          }}
          deviceSerial={deviceSerial}
          cameraNo={cameraNo}
          verifyCode={verifyCode}
          onPlaySuccess={this._onPlaySuccess}
          onPlayFailed={this._onPlayFailed}
          onLoad={() => this.startPlayer()}
        />
        {isLoading && this.renderWithMask(<Loading />)}
        <PlayControl
          visible={showControlView}
          isPlaying={isPlaying}
          onPause={() => this.pause()}
          onPlay={() => this.startPlayer()}
          onPressFullScreen={onPressFullScreen}
        />
      </View>
    );
  }
}
