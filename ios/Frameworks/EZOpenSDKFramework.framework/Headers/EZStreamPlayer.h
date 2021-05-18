//
//  EZStreamPlayer.h
//  EZOpenSDKFramework
//
//  Created by yuqian on 2020/4/3.
//  Copyright © 2020 Hikvision. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "EZDeviceRecordFile.h"

NS_ASSUME_NONNULL_BEGIN

@class EZStreamPlayer;

typedef enum : NSUInteger {
    EZStreamPlayerMsgTypeUnknown,              //无效类型
    EZStreamPlayerMsgTypeRealPlayStart,        //开启预览成功
    EZStreamPlayerMsgTypeRealPlayClose,        //关闭预览成功
    EZStreamPlayerMsgTypePlayBackStart,        //开启设备回放成功
    EZStreamPlayerMsgTypePlayBackClose,        //关闭设备回放成功
} EZStreamPlayerMsgType;

typedef enum : NSUInteger {
    EZStreamDataTypeUnknown,                   // 无效类型
    EZStreamDataTypeHeader,                    // 接收流头
    EZStreamDataTypeData,                      // 接收数据
    EZStreamDataTypeStreamEnd,                 // 流结束
}EZStreamDataType;


@protocol EZStreamPlayerDelegate <NSObject>

/**
 *  播放器播放失败错误回调
 *
 *  @param player 播放器对象
 *  @param error  播放器错误
 */
- (void)streamPlayer:(EZStreamPlayer *)player didPlayFailed:(NSError *)error;

/**
 *  播放器消息回调
 *
 *  @param player      播放器对象
 *  @param messageCode 播放器消息码
 */
- (void)streamPlayer:(EZStreamPlayer *)player didReceivedMessage:(EZStreamPlayerMsgType)msgType;

/**
 *  码流回调
 *
 *  @param player     播放器对象
 *  @param dataq       码流数据
 */
- (void)streamPlayer:(EZStreamPlayer *)player didReceivedData:(EZStreamDataType)dataType data:(int8_t *)data length:(int)dataLength;

@end

@interface EZStreamPlayer : NSObject

@property (nonatomic, weak) id<EZStreamPlayerDelegate>delegate;

/// 是否让播放器处理进入后台,YES:自动处理;NO:不处理,默认为YES
@property (nonatomic) BOOL backgroundModeByPlayer;


/**
*  根据设备序列号和通道号创建EZPlayer对象
*
*  @param deviceSerial 设备序列号
*  @param cameraNo     通道号
*
*  @return EZStreamPlayer对象
*/
+ (instancetype)createPlayerWithDeviceSerial:(NSString *)deviceSerial cameraNo:(NSInteger)cameraNo;

/**
 *  销毁EZPlayer
 *
 *  @return YES/NO;
 */
- (BOOL)destoryPlayer;

/**
 *  开始播放，异步接口，返回值只是表示操作成功，不代表播放成功
 *
 *  @return YES/NO
 */
- (BOOL)startRealPlay;

/**
 *  停止播放，异步接口
 *
 */
- (void)stopRealPlay;

/**
 *  开始设备回放，异步接口，返回值只是表示操作成功，不代表播放成功
 *
 *  @param deviceFile SD卡文件信息
 *
 *  @return YES/NO
 */
- (BOOL)startDevicePlayback:(EZDeviceRecordFile *)deviceFile;

/// 结束设备回放
- (void)stopDevicePlayback;

/// 设置设备验证码，播放前设置
/// @param verifyCode 设备验证码
- (void) setVerifyCode:(NSString *)verifyCode;

@end

NS_ASSUME_NONNULL_END
