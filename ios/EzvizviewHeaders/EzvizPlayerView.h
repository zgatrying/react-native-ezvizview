//
//  EzvizPlayerView.h
//  react-native-ezvizview
//
//  Created by Bran on 2021/4/13.
//

#import <UIKit/UIKit.h>
#import <React/RCTView.h>
#import <React/RCTBridge.h>
#import <EZOpenSDKFramework/EZPlayer.h>

@interface EzvizPlayerView: RCTView<EZPlayerDelegate>

- (void)createPlayer;
- (void)releasePlayer;
- (void)startRealPlay;
- (void)pause;

@property (nonatomic, copy) RCTDirectEventBlock onLoad;
@property (nonatomic, copy) RCTDirectEventBlock onPlaySuccess;
@property (nonatomic, copy) RCTDirectEventBlock onPlayFailed;

- (void)setDeviceSerial:(NSString *) deviceSerial;
- (void)setCameraNo:(NSInteger) cameraNo;
- (void)setVerifyCode:(NSString *) verifyCode;

@end
