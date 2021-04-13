#import <React/RCTBridgeModule.h>
#import <React/RCTBridge.h>
#import <EZOpenSDKFramework/EZPlayer.h>
#import "EzvizviewHeaders/EzvizviewViewManager.h"

@implementation EzvizviewViewManager

@synthesize playerView;
@synthesize bridge = _bridge;

//MARK: 定义供JS使用的组件名
RCT_EXTERN void RCTRegisterModule(Class);
+ (NSString *)moduleName
{
  return @"RCTEzvizView";
}
+ (void)load
{
  RCTRegisterModule(self);
}

//MARK: 定义组件的属性

RCT_EXPORT_VIEW_PROPERTY(deviceSerial, NSString);
RCT_EXPORT_VIEW_PROPERTY(cameraNo, NSInteger);
RCT_EXPORT_VIEW_PROPERTY(verifyCode, NSString);

- (UIView *)view
{
    self.playerView = [[EzvizPlayerView alloc] init];
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

@end
