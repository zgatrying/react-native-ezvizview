//
//  EZVideoTalkParam.h
//  EZOpenSDK
//
//  Created by yuqian on 2020/3/14.
//  Copyright © 2020 Hikvision. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface EZVideoTalkParam : NSObject
 
@property (nonatomic, assign) int32_t iCltRole; /**< 必填    0 发起 1 接受 发起端填写0 接受端填写1 拒绝为2 */
@property (nonatomic, assign) int32_t iStreamType;/**< 必选    0 音视频 1 对讲 2 会议*/
@property (nonatomic, assign) int32_t iOtherCltType; /**< 选择    */
@property (nonatomic, assign) int32_t iCltType; /**< 必填    客户端类型 */
@property (nonatomic, strong) NSString *szStsAddr; /**< 必填    服务地址 */
@property (nonatomic, assign) int32_t iStsPort; /**< 必填    服务端口 */
@property (nonatomic, assign) int32_t iRoomId; /**< 选择    需要加入房间号，只有接受端需要填写 */
@property (nonatomic, assign) int32_t iReason; /**< 选择  原因 拒接接听101 无人接听102 */

@property (nonatomic, strong) NSString *szSelfId;  /**< 必填  标识Id */
@property (nonatomic, strong) NSString *szOterId; /**< 选择    手表序列号 */
@property (nonatomic, assign) int32_t iAuthType;  /**< 选择    认证类型 */
@property (nonatomic, strong) NSString *szAuthToken; /**< 必填    认证token */

@property (nonatomic, strong) NSString *szExtensionParas; /**< 选择    扩展字段信息 */
@property (nonatomic, assign) int32_t iChannel;//选填  三方音视频时，IPC设备需要填写
@property (nonatomic, assign) int32_t iDevStreamType;//选填  设备主子码流

@property (nonatomic, assign) BOOL isMultiPartyCall; //是否是多方通话
@property (nonatomic, assign) BOOL isCallingWithDevice; //是否是带有设备的主叫方（多方通话）

@end

NS_ASSUME_NONNULL_END
