//
//  EzvizPlayerView.m
//  react-native-ezvizview
//
//  Created by Bran on 2021/4/9.
//
#import <UIKit/UIKit.h>
#import <React/RCTView.h>
#import <React/RCTBridge.h>
#import <EZOpenSDKFramework/EZPlayer.h>

@interface EzvizPlayerView: RCTView<EZPlayerDelegate>

@end

@implementation EzvizPlayerView {
    NSString *_deviceSerial;
    NSNumber *_cameraNo;
    NSString *_verifyCode;
    EZPlayer *_player;
}

- (void) dealloc
{
    NSLog(@"%@ dealloc", self.class);
    [EZOPENSDK releasePlayer:_player];
}

- (instancetype)init
{
    _deviceSerial = @"";
    _cameraNo = @-1;
    _verifyCode = @"";
    self = [super init];
    if (self) {
        
    }
    return self;
}

- (void)setDeviceSerial:(NSString *) deviceSerial {
    _deviceSerial = deviceSerial;
}

- (void)setCameraNo:(NSNumber *) cameraNo {
    _cameraNo = cameraNo;
}

- (void)setVerifyCode:(NSString *) verifyCode {
    _verifyCode = verifyCode;
}

@end
