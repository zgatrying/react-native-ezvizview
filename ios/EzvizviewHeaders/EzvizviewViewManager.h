//
//  EzvizviewViewManager.h
//  Pods
//
//  Created by Mac on 2021/4/13.
//
#import <React/RCTViewManager.h>
#import "EzvizPlayerView.h"

@class EzvizPlayerView;

@interface EzvizviewViewManager : RCTViewManager

@property (nonatomic, strong) EzvizPlayerView *playerView;

-(void) pause:(nonnull NSNumber *)reactTag;
-(void) replay:(nonnull NSNumber *)reactTag;
-(void) createPlayer:(nonnull NSNumber *)reactTag;
-(void) releasePlayer:(nonnull NSNumber *)reactTag;

@end
