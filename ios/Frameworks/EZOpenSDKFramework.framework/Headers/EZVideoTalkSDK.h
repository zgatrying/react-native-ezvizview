//
//  EZVideoTalkSDK.h
//  EZOpenSDK
//
//  Created by yuqian on 2020/3/14.
//  Copyright © 2020 Hikvision. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum : NSUInteger {
    EZVideoTalkMessageUnkown,
    EZVideoTalkMessageRoomCreated,      //创建房间成功
    EZVideoTalkMessagePeerEnteredRoom,  //目前未使用，用于多方
    EZVideoTalkMessagePeerLeaveRoom,    //目前未使用，用于多方
    EZVideoTalkMessageStartInputData,   //链接建立成功，开始推流
    EZVideoTalkMessageTransferData,     //透传消息
} EZVideoTalkMessageType;


typedef NS_OPTIONS(NSUInteger, EZVideoTalkCaptureType) {
    EZVideoTalkCaptureNone = 1 << 0,
    EZVideoTalkCaptureVideo = 1 << 1,
    EZVideoTalkCaptureAudio = 1 << 2,
};


@class EZVideoTalkSDK, EZVideoTalkParam, EZMediaSessionVideoParam, EZVideoTalkView;

@protocol EZVideoTalkSDKDelegate<NSObject>

- (void)videoTalk:(EZVideoTalkSDK *)client didReceivedError:(int32_t)errorCode;

/**
 回调消息

 @param client client
 @param messageCode 消息码 参见EZBAVMessage
 @param msg 透传消息，
    如果是EZVideoTalkMessagePeerEnteredRoom和EZVideoTalkMessagePeerLeaveRoom消息，msg是{@"clientID":@(9527),@"clientName":@"张三"}
        如果消息是 EZVideoTalkMessageTransferData msg是 msg是{@"content":@"实际的透传消息"}
 */
- (void)videoTalk:(EZVideoTalkSDK *)client didReceivedMessage:(EZVideoTalkMessageType)messageCode msg:(NSDictionary *)msg;


// 回调消息 bavclient log回调
//
// @param client client
// @param msg 透传消息
// */
//- (void)bavClient:(EZVideoTalk *)client didReceivedBavClientLogMsg:(NSString*)msg;

/**
 显示回调，首次画面出来以及后续画面尺寸发生变化时回调

 @param client client
 @param width 画面宽度
 @param height 画面高度
 */
- (void)videoTalk:(EZVideoTalkSDK *)client didDisplayWidth:(int32_t)width height:(int32_t)height ofRemoteClient:(int)clientID;


@end

@interface EZVideoTalkSDK : NSObject

@property (nonatomic, assign, readonly) int32_t roomID;
@property (nonatomic, weak) id<EZVideoTalkSDKDelegate> delegate;

#pragma mark - SDK
/**
SDK初始化

 @param param 必填 配置参数
 @param localWin 本地窗口
 
 @return 返回值
 */
- (instancetype)initWithParam:(EZMediaSessionVideoParam *)param
                  localWindow:(EZVideoTalkView *)localWin;

/// 设置远程窗口
/// 1.必须在拿到远端客户端加入的消息后设置；
/// 2.必须在主线程调用；
/// 3.结束后需要将window只为nil；
/// @param remoteWin  远端窗口
/// @param clientID 加入的客户端的ID
- (int32_t)setRemoteWindow:(UIView * _Nullable)remoteWin ofClient:(int32_t)clientID;

/**
 开始双向音视频对讲，耗时接口，默认 EZVideoTalkCaptureVideo | EZVideoTalkCaptureAudio 同时开启
 */
- (void)startWithBAVParam:(EZVideoTalkParam *)param;

/**
 开始双向音视频对讲，耗时接口
 @param param 必填 配置参数
 @param type 采集类型
 */
- (void)startWithBAVParam:(EZVideoTalkParam *)param type:(EZVideoTalkCaptureType)type;

/**
 停止双向音视频对讲
 */
- (void)stop;

/// 本地采集的音频或者是视频配置，可以在音视频通话过程中切换
/// @param type EZMediaCaptureSessionType
- (int32_t)configCaptureType:(EZVideoTalkCaptureType)type;

/// 开启声音，接收到EZVideoTalkMessageStartInputData消息后调用
/// @param open 开关状态
/// @param clientId clientId
- (int32_t) openSound:(BOOL)open forClient:(int32_t)clientId;

/**
 切换对讲时使用的摄像头，默认采用前置 同步接口

 @param backCameraSelected YES:选择后置，NO:选择前置
 @return 成功返回 noErr，失败返回错误码
 */
- (int32_t)switchCamera:(BOOL)backCameraSelected;

#pragma mark - 日志调试
/**
 日志设置
 
 @param enable 是否打印日志
 @param logCallback 日志回调，上层自定义处理
 */
+ (void)setDebugLogEnable:(BOOL)enable withLogCallback:(void(^)(NSString *logStr))logCallback;

/**
 打开对端码流抓取

 @param enble 是否打开
 */
+(void)setDebugVideoLog:(BOOL)enble;

/**
 获取sdk版本信息

 @return 版本号
 */
+ (NSString*)getVersion;

@end

NS_ASSUME_NONNULL_END
