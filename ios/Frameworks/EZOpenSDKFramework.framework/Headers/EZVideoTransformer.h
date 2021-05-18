//
//  EZVideoTransformer.h
//  EZOpenSDK
//
//  Created by yuqian on 2019/6/17.
//  Copyright © 2019 Ezviz. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum {
    
    EZVideoTransformerTypeMP4,
    
} EZVideoTransformerType;

@interface EZVideoTransformer : NSObject

/// 本地PS文件转换为MP4文件
/// @param psPath ps文件路径
/// @param targetPath mp4文件路径
/// @param type 转换类型
/// @param key 设备验证码
/// @param succBlock 成功回调
/// @param processBlock 进度回调
/// @param failBlock 失败回调
+ (void)videoTransFormerPSPath:(NSString *)psPath
                        toPath:(NSString *)targetPath
                          type:(EZVideoTransformerType)type
                       withKey:(NSString *)key
                     succBlock:(void (^)())succBlock
                  processBlock:(void(^)(int rate))processBlock
                     failBlock:(void(^)(int errCode))failBlock;

@end

NS_ASSUME_NONNULL_END
