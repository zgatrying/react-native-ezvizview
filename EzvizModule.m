//
//  EzvizModule.m
//  react-native-ezvizview
//
//  Created by Bran on 2021/4/9.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <EZOpenSDKFramework/EZOpenSDK.h>
#import <EZOpenSDKFramework/EZAccessToken.h>

#define EZOPENSDK [EZOpenSDK class]

@interface RNEzvizview : NSObject<RCTBridgeModule>
@end

@implementation RNEzvizview

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initSDK: (BOOL) debug
                  appKey:(NSString *) appKey
                  resolver: (RCTPromiseResolveBlock) resolver
                  rejector: (RCTPromiseRejectBlock) rejector)
{
    [EZOPENSDK setDebugLogEnable:debug];
    [EZOPENSDK initLibWithAppKey:appKey];
    resolver(@[]);
}

RCT_EXPORT_METHOD(getAccessToken: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
{
    NSString *accessToken = [EZOPENSDK getAccesstoken];
    NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
    if(accessToken != nil) {
        [result setObject:accessToken forKey:@"accessToken"];
        resolve(result);
    } else {
        reject(@"get accessToken fail", @"retuen nothing", nil);
    }
}

RCT_EXPORT_METHOD(openLoginPage)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [EZOpenSDK openLoginPage:^(EZAccessToken *accessToken) {
            if (accessToken != nil) {
                RCTLog(@"get accessToken success");
                [EZOPENSDK setAccessToken:accessToken.accessToken];
            }
        }];
    });
}

@end
