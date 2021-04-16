//
//  EzvizPlaybackView.m
//  react-native-ezvizview
//
//  Created by Mac on 2021/4/14.
//

#import <UIKit/UIKit.h>
#import <EZOpenSDKFramework/EZPlayer.h>
#import <EZOpenSDKFramework/EZOpenSDK.h>
#import <EZOpenSDKFramework/EZDeviceRecordFile.h>
#import "EzvizviewHeaders/EzvizPlaybackView.h"

#define EZOPENSDK [EZOpenSDK class]

@implementation EzvizPlaybackView {
    NSString *_deviceSerial;
    NSInteger _cameraNo;
    NSString *_verifyCode;
    NSDate *_startTime;
    NSDate *_endTime;
    EZPlayer *_player;
    EZDeviceRecordFile *_deviceRecord;
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
        NSLog(@"init");
        _deviceRecord = [[EZDeviceRecordFile alloc] init];
        [_deviceRecord setStartTime:_startTime];
        [_deviceRecord setStopTime:_endTime];
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

- (void)setStartTime:(NSString *)startTime {
//    _startTime = startTime;
    NSTimeZone * GTMZone = [NSTimeZone localTimeZone];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"yyyy-MM-dd HH:mm:ss";
    [dateFormatter setTimeZone:GTMZone];
    
    _startTime = [dateFormatter dateFromString:startTime];
    NSLog(@"EzvizPlayerView set startTime %@ from %@", _startTime, startTime);
}

- (void)setEndTime:(NSString *)endTime {
//    _endTime = endTime;
    NSTimeZone * GTMZone = [NSTimeZone localTimeZone];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    dateFormatter.dateFormat = @"yyyy-MM-dd HH:mm:ss";
    [dateFormatter setTimeZone:GTMZone];
    
    _endTime = [dateFormatter dateFromString:endTime];
    NSLog(@"EzvizPlayerView set endTime %@ from %@", _endTime, endTime);
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
        [_player startPlaybackFromDevice:_deviceRecord];
        NSLog(@"%@ start play 序列号：%@-通道号：%ld", self.class, _deviceSerial, (long)_cameraNo);
    }
}

- (void)releasePlayer
{
    NSLog(@"%@ release player", self.class);
    [EZOPENSDK releasePlayer:_player];
}

- (void)rePlay
{
    NSLog(@"%@ rePlay", self.class);
    if(_isPlaying) {
        [_player stopPlayback];
    }
    _isPlaying = YES;
    [_player startPlaybackFromDevice:_deviceRecord];
}

- (void)resumePlay
{
    if(!_isPlaying)
    {
        NSLog(@"%@ start play", self.class);
        [_player resumePlayback];
    }
}

- (void)pause
{
    if(_isPlaying)
    {
        NSLog(@"%@ stop play", self.class);
        [_player pausePlayback];
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
            [_player stopPlayback];
        }
    }
    //提示JS播放失败
    self.onPlayFailed(@{@"errorCode": @(error.code)});
}

- (void)player:(EZPlayer *)player didReceivedMessage:(NSInteger)messageCode
{
    NSLog(@"player: %@, didReceivedMessage: %d", player, (int)messageCode);
    if (messageCode == PLAYER_PLAYBACK_START) {
        _isPlaying = YES;
        self.onPlaySuccess(@{});
        if(!_isOpenSound)
        {
            [_player closeSound];
        }
    }
}

@end
