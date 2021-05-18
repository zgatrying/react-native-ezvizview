//
//  EZPlayerExParamInfo.h
//  EzvizOpenSDK
//
//  Created by linyong on 2018/4/2.
//  Copyright © 2018年 Ezviz. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum
{
    EZPLAYER_STREAM_DEFAULT = 0,//默认
    EZPLAYER_STREAM_MAIN,//主码流
    EZPLAYER_STREAM_SUB,//子码流
    EZPLAYER_STREAM_MAX
}EZPlayerStreamType;

typedef enum
{
    EZPLAYER_TRANS_DEFAULT = 0, //默认
    EZPLAYER_TRANS_EZVIZ,//萤石私有流媒体
    EZPLAYER_TRANS_RTMP,//RTMP
    EZPLAYER_TRANS_MAX
}EZPlayerTransportType;

@interface EZPlayerExParamInfo : NSObject

@property (nonatomic,copy) NSString *vtduIp; ///vtdu服务器ip
@property (nonatomic,assign) NSInteger vtduPort; //vtdu端口号
@property (nonatomic) EZPlayerStreamType streamMode; ///默认为0，主码流为1，子码流为2
@property (nonatomic,assign) EZPlayerTransportType protocolType; ///传输协议，默认为0

@end
