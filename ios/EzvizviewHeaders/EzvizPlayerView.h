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

- (void)setDeviceSerial:(NSString *) deviceSerial;
- (void)setCameraNo:(NSInteger) cameraNo;
- (void)setVerifyCode:(NSString *) verifyCode;

@end
