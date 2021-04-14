//
//  EzvizPlaybackViewManager.m
//  react-native-ezvizview
//
//  Created by Mac on 2021/4/9.
//

#import <React/RCTBridgeModule.h>
#import <EZOpenSDKFramework/EZPlayer.h>
#import "EzvizviewHeaders/EzvizPlaybackViewManager.h"
#import "EzvizviewHeaders/EzvizPlaybackView.h"

@implementation EzvizPlaybackViewManager

@synthesize playerView;

//MARK: 定义供JS使用的组件名
RCT_EXTERN void RCTRegisterModule(Class);
+ (NSString *)moduleName
{
  return @"RCTEzvizPlaybackView";
}
+ (void)load
{
  RCTRegisterModule(self);
}

//MARK: 定义组件的属性

RCT_EXPORT_VIEW_PROPERTY(deviceSerial, NSString);
RCT_EXPORT_VIEW_PROPERTY(cameraNo, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(verifyCode, NSString);
RCT_EXPORT_VIEW_PROPERTY(startTime, NSString);
RCT_EXPORT_VIEW_PROPERTY(endTime, NSString);

- (UIView *)view
{
    playerView = [[EzvizPlaybackView alloc] init];
    return playerView;
}

RCT_EXPORT_METHOD(pause: (nonnull NSNumber *) reactTag)
{
    RCTLog(@"native pause");
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.playerView pause];
    });
}

RCT_EXPORT_METHOD(replay: (nonnull NSNumber *) reactTag)
{
    RCTLog(@"native replay");
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.playerView pause];
        [self.playerView startRealPlay];
    });
}

RCT_EXPORT_METHOD(createPlayer: (nonnull NSNumber *) reactTag)
{
    RCTLog(@"native createPlayer");
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.playerView createPlayer];
    });
}

RCT_EXPORT_METHOD(releasePlayer: (nonnull NSNumber *) reactTag)
{
    RCTLog(@"native releasePlayer");
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.playerView releasePlayer];
    });
}

RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPlaySuccess, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPlayFailed, RCTDirectEventBlock)

@end
