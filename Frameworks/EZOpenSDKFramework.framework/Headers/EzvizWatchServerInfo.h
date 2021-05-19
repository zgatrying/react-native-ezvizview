//
//  EzvizWatchServerInfo.h
//  EzvizOpenSDK
//
//  Created by yuqian on 2020/3/2.
//  Copyright © 2020 Hikvision. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface EzvizWatchServerInfo : NSObject

@property (nonatomic, copy) NSString *domain;
@property (nonatomic, copy) NSString *externalIp;
@property (nonatomic, assign) int 	forceStreamType;
@property (nonatomic, copy) NSString *idcType;
@property (nonatomic, copy) NSString *internalIp;
@property (nonatomic, assign) int isBackup;
@property (nonatomic, copy) NSString *memo;
@property (nonatomic, assign) int port;

@end

NS_ASSUME_NONNULL_END
