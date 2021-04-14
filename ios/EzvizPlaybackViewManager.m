//
//  EzvizPlaybackViewManager.m
//  react-native-ezvizview
//
//  Created by Mac on 2021/4/9.
//

#import <React/RCTViewManager.h>
#import <EZOpenSDKFramework/EZPlayer.h>

@interface EzvizPlaybackViewManager : RCTViewManager

@property (nonatomic, strong) UIView *signView;
-(void) pause:(nonnull NSNumber *)reactTag;
-(void) replay:(nonnull NSNumber *)reactTag;
-(void) createPlayer:(nonnull NSNumber *)reactTag;
-(void) releasePlayer:(nonnull NSNumber *)reactTag;
@end

@implementation EzvizPlaybackViewManager

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

@synthesize signView;

- (UIView *)view
{
    self.signView = [[UIView alloc] init];
    return signView;
}

RCT_EXPORT_METHOD(pause: (nonnull NSNumber *) reactTag)
{
    RCTLog(@"native pause");
}

RCT_EXPORT_METHOD(replay: (nonnull NSNumber *) reactTag)
{
    RCTLog(@"native replay");
}

RCT_EXPORT_METHOD(createPlayer: (nonnull NSNumber *) reactTag)
{
    RCTLog(@"native createPlayer");
}

RCT_EXPORT_METHOD(releasePlayer: (nonnull NSNumber *) reactTag)
{
    RCTLog(@"native releasePlayer");
}

@end
