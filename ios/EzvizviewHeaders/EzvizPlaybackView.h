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
- (void)startRealPlay;
- (void)pause;

@property (nonatomic, copy) RCTBubblingEventBlock onLoad;
@property (nonatomic, copy) RCTBubblingEventBlock onPlaySuccess;
@property (nonatomic, copy) RCTBubblingEventBlock onPlayFailed;

- (void)setDeviceSerial:(NSString *) deviceSerial;
- (void)setCameraNo:(NSInteger) cameraNo;
- (void)setVerifyCode:(NSString *) verifyCode;
- (void)setStartTime:(NSString *) startTime;
- (void)setEndTime:(NSString *) endTime;

@end
