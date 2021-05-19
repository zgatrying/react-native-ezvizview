//
//  EZCloudFile.h
//  EzvizOpenSDK
//
//  Created by DeJohn Dong on 15/9/17.
//  Copyright (c) 2015年 Ezviz. All rights reserved.
//

#import <Foundation/Foundation.h>

/// 此类为云存储录像文件对象
@interface EZCloudRecordFile : NSObject

/// 设备序列号
@property (nonatomic, copy) NSString *deviceSerial;
/// 设备通道号
@property (nonatomic, assign) NSInteger cameraNo;
/// 云存储录像文件Id
@property (nonatomic, copy) NSString *fileId;
/// 云存储录像文件开始时间
@property (nonatomic, strong) NSDate *startTime;
/// 云存储录像文件结束时间
@property (nonatomic, strong) NSDate *stopTime;
/// 云存储录像截图地址
@property (nonatomic, copy) NSString *coverPic;
/// 云存储录像下载地址
@property (nonatomic, copy) NSString *downloadPath;
/// 云存储图片加密密码，如果是[NSNull null]或者nil指针则图片不加密
@property (nonatomic, copy) NSString *encryption;

@property (nonatomic, assign) int32_t istorageVersion; //云存储类别:1 单文件存储模式；2 连续存储模式；3 待定
@property (nonatomic, assign) int32_t videoType;//云存储录像类型，默认为0，表示不属于云存储录像

@end
