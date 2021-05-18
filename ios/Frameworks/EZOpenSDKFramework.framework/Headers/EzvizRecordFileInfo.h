//
//  EzvizRecordFileInfo.h
//  EzvizOpenSDK
//
//  Created by linyong on 2017/5/5.
//  Copyright © 2017年 Ezviz. All rights reserved.
//

#import <Foundation/Foundation.h>

///录像文件信息
@interface EzvizRecordFileInfo : NSObject

///设备序列号
@property (nonatomic,copy) NSString *deviceSerial;

///设备通道号
@property (nonatomic,assign) NSInteger channelNo;

///回放源，0-系统自动选择，1-云存储，2-本地录像
@property (nonatomic,assign) NSInteger recType;

///文件开始时间
@property (nonatomic,strong) NSDate *startTime;

///文件结束时间
@property (nonatomic,strong) NSDate *endTime;

///文件类型0：目录1：视频文件2：图片文件3：音频文件
@property (nonatomic,assign) NSInteger fileType;

///是否加密0--不加密,1--加密
@property (nonatomic,assign) NSInteger crypt;

///验证码MD5值
@property (nonatomic,copy) NSString *keyChecksum;

///文件ID
@property (nonatomic,copy) NSString *fileId;

///封面图片地址
@property (nonatomic,copy) NSString *coverPic;

///下载路径
@property (nonatomic,copy) NSString *downloadPath;

@end
