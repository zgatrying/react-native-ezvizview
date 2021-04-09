#import <React/RCTViewManager.h>
#import <EZOpenSDKFramework/EZPlayer.h>

@interface EzvizviewViewManager : RCTViewManager<EZPlayerDelegate>

@property (nonatomic, strong) UIView *signView;
-(void) pause:(nonnull NSNumber *)reactTag;
-(void) replay:(nonnull NSNumber *)reactTag;
-(void) createPlayer:(nonnull NSNumber *)reactTag;
-(void) releasePlayer:(nonnull NSNumber *)reactTag;
@end

@implementation EzvizviewViewManager

@synthesize signView;
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

- (UIView *)view
{
    self.signView = [[UIView alloc] init];
    return signView;
}

//MARK: 定义组件的属性

RCT_EXPORT_VIEW_PROPERTY(deviceSerial, NSString);
RCT_EXPORT_VIEW_PROPERTY(cameraNo, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(verifyCode, NSString);

//RCT_CUSTOM_VIEW_PROPERTY(deviceSerial, NSString, UIView)
//{
//    NSLog(@"set deviceSerial");
//}
//
//RCT_CUSTOM_VIEW_PROPERTY(cameraNo, NSInt, UIView)
//{
//    NSLog(@"set cameraNo");
//}
//
//RCT_CUSTOM_VIEW_PROPERTY(verifyCode, NSString, UIView)
//{
//    NSLog(@"set verifyCode");
//}
//
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

/**
 *  播放器播放失败错误回调
 *
 *  @param player 播放器对象
 *  @param error  播放器错误
 */
- (void)player:(EZPlayer *)player didPlayFailed:(NSError *)error
{
    
}

/**
 *  播放器消息回调
 *
 *  @param player      播放器对象
 *  @param messageCode 播放器消息码，请对照EZOpenSDK头文件中的EZMessageCode使用
 */
- (void)player:(EZPlayer *)player didReceivedMessage:(NSInteger)messageCode
{
    
}

@end
