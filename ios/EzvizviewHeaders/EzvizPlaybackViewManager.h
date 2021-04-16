//
//  EzvizPlaybackViewManager.h
//  react-native-ezvizview
//
//  Created by Mac on 2021/4/14.
//

#import <React/RCTViewManager.h>
#import "EzvizPlaybackView.h"

@interface EzvizPlaybackViewManager : RCTViewManager

@property (nonatomic, strong) EzvizPlaybackView *playerView;

-(void) pause:(nonnull NSNumber *)reactTag;
-(void) replay:(nonnull NSNumber *)reactTag;
-(void) resumePlay:(nonnull NSNumber *)reactTag;
-(void) createPlayer:(nonnull NSNumber *)reactTag;
-(void) releasePlayer:(nonnull NSNumber *)reactTag;

@end
