//
//  EZMediaSessionVideoParam.h
//  EZBAVClient
//
//  Created by kanhaiping on 2018/7/13.
//  Copyright © 2018年 hikvision. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface EZMediaSessionVideoParam : NSObject
@property (nonatomic, strong, readonly) NSString *resolutionPreset;
@property (nonatomic, assign) NSInteger pixelWidth;
@property (nonatomic, assign) NSInteger pixelHeigth;
@property (nonatomic, assign) NSInteger videoOrientation;//传入 AVCaptureVideoOrientation，默认竖屏
@property (nonatomic, assign) NSInteger encodeKeyFrameInterval;//I帧间隔，单位秒
//@property (nonatomic, assign) BOOL isCrop;
@end
