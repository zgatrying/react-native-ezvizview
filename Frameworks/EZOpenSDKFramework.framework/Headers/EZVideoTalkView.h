//
//  EZVideoTalkView.h
//  EZVideoTalk
//
//  Created by Harper Kan on 2020/12/5.
//  Copyright © 2020 hikvision. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface EZVideoTalkView : UIView
- (AVSampleBufferDisplayLayer *)videoLayer;
@end

NS_ASSUME_NONNULL_END
