//
//  EZRecordDownloadTask.h
//  EZOpenSDK
//
//  Created by yuqian on 2019/7/2.
//  Copyright © 2019 Ezviz. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, EZRecordDownloaderStatus)
{
    EZRecordDownloaderStatusStart = 1,          //开始下载
    EZRecordDownloaderStatusFinish = 2,         //录像下载结束
    EZRecordDownloaderStatusMoreToken = 3,
};

typedef enum : NSUInteger {
    EZRecordDownloadTaskWaitting,
    EZRecordDownloadTaskDownloading,
    EZRecordDownloadTaskCompleting,
} EZRecordDownloadTaskStatus;

@interface EZRecordDownloadTask : NSObject

/**
 每个下载任务的唯一标识
 */
@property (nonatomic, assign) NSUInteger taskID;


@property (nonatomic, assign) EZRecordDownloadTaskStatus taskStatus;

/**
 本地存放路径
 */
@property (nonatomic,strong) NSString *saveFilePath;

/**
 结束回调
 */
@property (nonatomic, copy) void(^finshed)(EZRecordDownloaderStatus statusCode);

/**
 失败回调
 */
@property (nonatomic, copy) void(^failed)(NSError *error);

/**
 开始下载

 @return 成功0，失败-1
 */
- (int)startRecordDownload;

/**
 结束下载，清理资源
 */
- (void)stopRecordDownload;

/**
 设置下载回调
 
 @param finshed 结束回调
 @param failed 失败回调
 */
- (void) setDownloadCallBackWithFinshed:(void(^)(EZRecordDownloaderStatus statusCode))finshed
                                 failed:(void(^)(NSError *error))failed;
@end

NS_ASSUME_NONNULL_END
