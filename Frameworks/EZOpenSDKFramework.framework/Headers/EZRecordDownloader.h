//
//  EZRecordDownloader.h
//  EZOpenSDK
//
//  Created by yuqian on 2019/7/2.
//  Copyright © 2019 Ezviz. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@class EZRecordDownloadTask;

@interface EZRecordDownloader : NSObject


/// 下载任务队列
@property (nonatomic, strong, readonly) NSMutableArray *tasks;

/**
 初始化单例
 
 @return 单例
 */
+ (instancetype) shareInstane;

/**
 添加下载任务，并开始下载
 任务下载并发数量限制，最高支持 10 个任务并行下载
 设备录像下载：依赖设备所支持的最高路数限制
 
 
 @param task 下载任务
 @return 是否加入队列成功  0 开始下载 -1 任务为空   -2 任务已在下载 
 */
- (int) addDownloadTask:(EZRecordDownloadTask *)task;

/**
 停止下载任务，并清除下载列表中的任务。下载结束或失败均要执行，清理资源
 
 @param task 下载任务
 @return 是否移除队列成功
 */
- (int) stopDownloadTask:(EZRecordDownloadTask *)task;

@end

NS_ASSUME_NONNULL_END
