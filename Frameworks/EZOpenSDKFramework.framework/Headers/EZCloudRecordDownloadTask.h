//
//  EZCloudRecordDownloadTask.h
//  EZOpenSDK
//
//  Created by yuqian on 2019/7/2.
//  Copyright © 2019 Ezviz. All rights reserved.
//

#import "EZRecordDownloadTask.h"

NS_ASSUME_NONNULL_BEGIN

@class EZCloudRecordFile;

@interface EZCloudRecordDownloadTask : EZRecordDownloadTask

/**
 云存储录像下载任务初始化。
 下载的录像为PS文件，如需转换MP4，请自行调用EZVideoTransformer类的转封装方法
 
 @param taskID 下载任务唯一标识ID
 @param recordFile 云存储录像文件
 @param verifyCode 设备验证码
 @param savePath 下载存储路径
 @return 初始化成功返回实例，失败返回nil
 */
- (instancetype) initTaskWithID:(NSUInteger)taskID
                cloudRecordFile:(EZCloudRecordFile *)recordFile
                     verifyCode:(NSString *)verifyCode
                       savePath:(NSString *)savePath;

@end

NS_ASSUME_NONNULL_END
