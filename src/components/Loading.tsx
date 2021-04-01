import React, { Component } from 'react';
import { Animated, Easing, ImageStyle } from 'react-native';

type Props = {
  style?: ImageStyle;
};

type State = {
  rotateAnim: Animated.Value;
};

export default class Loading extends Component<Props, State> {
  state = {
    rotateAnim: new Animated.Value(0),
  };

  componentDidMount() {
    this.rotateImage();
    this.state.rotateAnim.addListener(this.handleRotateChange);
  }

  componentWillUnmount() {
    this.state.rotateAnim.removeAllListeners();
  }

  handleRotateChange = ({ value }: { value: number }) => {
    if (value == 1) {
      this.state.rotateAnim.setValue(0);
      this.rotateImage();
    }
  };

  rotateImage() {
    Animated.timing(this.state.rotateAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.Image
        style={[
          {
            width: 48,
            height: 48,
            transform: [
              {
                rotate: this.state.rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
          this.props.style,
        ]}
        source={require('../assets/common_refresh.png')}
      />
    );
  }
}
