//
//  EzvizPlaybackView.h
//  react-native-ezvizview
//
//  Created by Mac on 2021/4/14.
//

#import <UIKit/UIKit.h>
#import <React/RCTView.h>
#import <React/RCTBridge.h>
#import <EZOpenSDKFramework/EZPlayer.h>

@interface EzvizPlaybackView: RCTView<EZPlayerDelegate>

- (void)createPlayer;
- (void)releasePlayer;
- (void)resumePlay;
- (void)rePlay;
- (void)pause;

@property (nonatomic, copy) RCTDirectEventBlock onLoad;
@property (nonatomic, copy) RCTDirectEventBlock onPlaySuccess;
@property (nonatomic, copy) RCTDirectEventBlock onPlayFailed;

- (void)setDeviceSerial:(NSString *) deviceSerial;
- (void)setCameraNo:(NSInteger) cameraNo;
- (void)setVerifyCode:(NSString *) verifyCode;
- (void)setStartTime:(NSString *) startTime;
- (void)setEndTime:(NSString *) endTime;

@end
