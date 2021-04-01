import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  onPause: () => void;
  onPlay: () => void;
  onReplay?: () => void;
  onPressFullScreen?: () => void;
  isPlaying: boolean;
};

export default function PlayControl({
  visible,
  onPause,
  onPlay,
  onReplay,
  onPressFullScreen,
  isPlaying,
}: Props) {
  const PlayStopImgSource = isPlaying
    ? require('../assets/btn_stop_n.png')
    : require('../assets/btn_play_n.png');
  if (!visible) return null;
  return (
    <View
      onStartShouldSetResponder={() => true}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 40,
        backgroundColor: '#000000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => {
            if (isPlaying) {
              onPause();
            } else {
              onPlay();
            }
          }}
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={PlayStopImgSource}
            resizeMethod="auto"
            resizeMode="center"
          />
        </TouchableOpacity>
        {onReplay && (
          <TouchableOpacity style={{ padding: 10 }} onPress={() => onReplay()}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../assets/btn_replay.png')}
              resizeMode="stretch"
              resizeMethod="auto"
            />
          </TouchableOpacity>
        )}
      </View>

      <View>
        {onPressFullScreen && (
          <TouchableOpacity style={{ padding: 10 }} onPress={onPressFullScreen}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require('../assets/btn_full.png')}
              resizeMethod="auto"
              resizeMode="center"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
