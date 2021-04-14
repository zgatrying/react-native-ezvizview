//
//  EzvizPlayerView.m
//  react-native-ezvizview
//
//  Created by Bran on 2021/4/9.
//
#import <UIKit/UIKit.h>
#import <EZOpenSDKFramework/EZPlayer.h>
#import <EZOpenSDKFramework/EZOpenSDK.h>
#import "EzvizviewHeaders/EzvizPlayerView.h"

#define EZOPENSDK [EZOpenSDK class]

@implementation EzvizPlayerView {
    NSString *_deviceSerial;
    NSInteger _cameraNo;
    NSString *_verifyCode;
    EZPlayer *_player;
    BOOL _isPlaying;
    BOOL _isOpenSound;
    BOOL _loaded;
}

- (instancetype)init
{
    self = [super init];
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    if(!_loaded) {
        NSLog(@"load subviews");
        self.onLoad(@{});
    }
    _loaded = true;
}

- (void)setDeviceSerial:(NSString *) deviceSerial {
    _deviceSerial = deviceSerial;
    NSLog(@"EzvizPlayerView set DeviceSerial %@", deviceSerial);
}

- (void)setCameraNo:(NSInteger) cameraNo {
    _cameraNo = cameraNo;
    NSLog(@"EzvizPlayerView set cameraNo %ld", (long)cameraNo);
}

- (void)setVerifyCode:(NSString *) verifyCode {
    _verifyCode = verifyCode;
    NSLog(@"EzvizPlayerView set VerifyCode %@", verifyCode);
}

#pragma mark - used by JS

- (void)createPlayer
{
    if(_player == nil && _deviceSerial != nil && _cameraNo != -1)
    {
        _player = [EZOpenSDK createPlayerWithDeviceSerial:_deviceSerial cameraNo:_cameraNo];
        _player.delegate = self;
        _isOpenSound = YES;
        [_player setPlayVerifyCode:_verifyCode];
        [_player setPlayerView:self];
        [_player startRealPlay];
        NSLog(@"%@ start play 序列号：%@-通道号：%ld", self.class, _deviceSerial, (long)_cameraNo);
    }
}

- (void)releasePlayer
{
    NSLog(@"%@ release player", self.class);
    [EZOPENSDK releasePlayer:_player];
}

- (void)startRealPlay
{
    if(!_isPlaying)
    {
        NSLog(@"%@ start play", self.class);
        [_player startRealPlay];
    }
}

- (void)pause
{
    if(_isPlaying)
    {
        NSLog(@"%@ stop play", self.class);
        [_player stopRealPlay];
        _isPlaying = !_isPlaying;
    }
}

#pragma mark - handle player event

- (void)player:(EZPlayer *)player didPlayFailed:(NSError *)error
{
    NSLog(@"player: %@, didPlayFailed: %@", player, error);
    //如果是需要验证码或者是验证码错误
    if (error.code == EZ_SDK_NEED_VALIDATECODE) {
        
    }
    else if (error.code == EZ_SDK_VALIDATECODE_NOT_MATCH)
    {
        
    }
    else
    {
        if([player isEqual:_player])
        {
            [_player stopRealPlay];
        }
    }
    //提示JS播放失败
    self.onPlayFailed(@{@"errorCode": @(error.code)});
}

- (void)player:(EZPlayer *)player didReceivedMessage:(NSInteger)messageCode
{
    NSLog(@"player: %@, didReceivedMessage: %d", player, (int)messageCode);
    if (messageCode == PLAYER_REALPLAY_START) {
        _isPlaying = YES;
        self.onPlaySuccess(@{});
        if(!_isOpenSound)
        {
            [_player closeSound];
        }
    }
    else if (messageCode == PLAYER_NET_CHANGED)
    {
        [_player stopRealPlay];
        [_player startRealPlay];
    }
}

@end
