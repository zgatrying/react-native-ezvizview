//
//  EzvizTokenKit.h
//  EzvizOpenSDK
//
//  Created by DeJohn Dong on 15/8/31.
//  Copyright (c) 2015年 Ezviz. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface EZTokenKit : NSObject

@property (nonatomic, readonly) NSString *token;  //获取第一个token
@property (nonatomic, readonly) NSInteger tokenCount; //当前tokenKit里还有多少token的数量

/**
 *  单例方法
 *
 *  @return EZTokenKit对象
 */
+ (instancetype)sharedKit;

/**
 *  设置TokenList数组
 *
 *  @param tokenList token数组
 */
- (void)setTokens:(NSArray *)tokenList;

/**
 *  清空数组
 */
- (void)clearTokens;

/**
 *  预加载取流token
 */
- (void)prepareToken:(void (^)(NSError *error))block;

@end
