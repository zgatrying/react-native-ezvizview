//
//  EZDeviceRecordDownloadTask.h
//  EZOpenSDK
//
//  Created by yuqian on 2019/7/2.
//  Copyright © 2019 Ezviz. All rights reserved.
//

#import "EZRecordDownloadTask.h"

NS_ASSUME_NONNULL_BEGIN

@class EZDeviceRecordFile;

@interface EZDeviceRecordDownloadTask : EZRecordDownloadTask

/**
 sd卡录像下载任务初始化，异步方法
 下载的录像为PS文件，如需转换MP4，请自行调用EZVideoTransformer类的转封装方法
 
 @param taskID 下载任务唯一标识ID
 @param recordFile 设备录像文件
 @param deviceSerial 设备序列号
 @param cameraNo 通道号
 @param verifyCode 设备验证码
 @param savePath 下载存储路径
 @param completion 完成回调，成功返回task，失败返回nil
 */
- (void) initTaskWithID:(NSUInteger)taskID
   DeviceRecordFileInfo:(EZDeviceRecordFile *)recordFile
           deviceSerial:(NSString *)deviceSerial
               cameraNo:(NSInteger)cameraNo
             verifyCode:(NSString *)verifyCode
               savePath:(NSString *)savePath
             completion:(void (^)(EZDeviceRecordDownloadTask *task))completion;

@end

NS_ASSUME_NONNULL_END
