//
//  EzvizModule.m
//  react-native-ezvizview
//
//  Created by Bran on 2021/4/9.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import <CoreLocation/CoreLocation.h>
#import <EZOpenSDKFramework/EZOpenSDK.h>
#import <EZOpenSDKFramework/EZAccessToken.h>
#import <EZOpenSDKFramework/EZProbeDeviceInfo.h>

#define EZOPENSDK [EZOpenSDK class]

@interface RNEzvizview : NSObject<RCTBridgeModule>

@property (nonatomic, strong) CLLocationManager *locationmanager;

@end

@implementation RNEzvizview

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setAccessToken: (NSString *) accessToken)
{
    [EZOPENSDK setAccessToken:accessToken];
}

RCT_EXPORT_METHOD(decryptData: (NSArray *) encryptData
                  verifyCode: (NSString *)verifyCode
                  resolver: (RCTPromiseResolveBlock) resolver
                  rejector: (RCTPromiseRejectBlock) rejector)
{
    NSMutableData *mutableData = [[NSMutableData alloc] initWithCapacity:[encryptData count]];
    for (NSNumber *number in encryptData) {
        char byte = [number charValue];
        [mutableData appendBytes:&byte length:1];
    }
    NSData *decryptedData = [EZOPENSDK decryptData:mutableData verifyCode:verifyCode];
    if(decryptedData) {
        NSString *base64Url = [decryptedData base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
        resolver(@[base64Url]);
    } else {
        rejector(@"get decryptedData nil", @"retuen error", nil);
    }
}

RCT_EXPORT_METHOD(stopConfigWifi)
{
    [EZOPENSDK stopConfigWifi];
}

RCT_EXPORT_METHOD(probeDeviceInfo: (NSString *) deviceSerial
                  deviceType: (NSString *) deviceType
                  resolver: (RCTPromiseResolveBlock) resolver
                  rejector: (RCTPromiseRejectBlock) rejector)
{
    [EZOPENSDK probeDeviceInfo:deviceSerial deviceType:deviceType completion:^(EZProbeDeviceInfo *deviceInfo, NSError *error) {
        if(error)
        {
            if(error.code == EZ_HTTPS_DEVICE_ADDED_MYSELF)
            {
                resolver(@{@"message": @"已添加过此设备", @"isAbleToAdd": @NO, @"isNeedToConfigWifi": @NO});
            }
            else if (error.code == EZ_HTTPS_DEVICE_ONLINE_ADDED)
            {
                resolver(@{@"message": @"已被别人添加", @"isAbleToAdd": @NO, @"isNeedToConfigWifi": @NO});
            }
            else if (error.code == EZ_HTTPS_DEVICE_OFFLINE_NOT_ADDED ||
                      error.code == EZ_HTTPS_DEVICE_NOT_EXISTS ||
                      error.code == EZ_HTTPS_DEVICE_OFFLINE_IS_ADDED ||
                      error.code == EZ_HTTPS_DEVICE_OFFLINE_IS_ADDED_MYSELF)
            {
                resolver(@{@"message": @"设备不在线，需要配网", @"isAbleToAdd": @YES, @"isNeedToConfigWifi": @YES});
            }
        }
        else
        {
            resolver(@{@"message": @"设备已在线，可进行添加设备操作", @"isAbleToAdd": @YES, @"isNeedToConfigWifi": @NO});
        }
    }];
}

RCT_EXPORT_METHOD(
                  configWifi: (NSString *) deviceSerial
                  deviceType: (NSString *) deviceType
                  verifyCode: (NSString *) verifyCode
                  wifiSSID: (NSString *) wifiSSID
                  wifiPassword: (NSString *) wifiPassword
                  resolver: (RCTPromiseResolveBlock) resolver
                  rejector: (RCTPromiseRejectBlock) rejector
                  )
{
    [EZOPENSDK probeDeviceInfo:deviceSerial deviceType:deviceType completion:^(EZProbeDeviceInfo *deviceInfo, NSError *error) {
       if(error)
       {
           if (error.code == EZ_HTTPS_DEVICE_ONLINE_ADDED)
           {
               NSLog(@"此设备已被别人添加");
               resolver(@{@"message": @"此设备已被别人添加", @"isAbleToAdd": @NO});
           }
           else if (error.code == EZ_HTTPS_DEVICE_OFFLINE_NOT_ADDED ||
                    error.code == EZ_HTTPS_DEVICE_NOT_EXISTS ||
                    error.code == EZ_HTTPS_DEVICE_OFFLINE_IS_ADDED ||
                    error.code == EZ_HTTPS_DEVICE_OFFLINE_IS_ADDED_MYSELF)
           {
               if(deviceInfo)
               {
                   NSInteger mode = 0;
                   mode |= deviceInfo.supportWifi == 3?EZWiFiConfigSmart:0;
                   mode |= deviceInfo.supportSoundWave == 1?EZWiFiConfigWave:0;
                   [EZOPENSDK startConfigWifi:wifiSSID
                                     password:wifiPassword
                                 deviceSerial:deviceSerial
                                         mode:mode
                                 deviceStatus:^(EZWifiConfigStatus status, NSString *deviceSerial) {
                       if(status == DEVICE_WIFI_CONNECTING)
                       {
                           NSLog(@"设备正在连接wifi");
                       }
                       else if (status == DEVICE_WIFI_CONNECTED)
                       {
                           NSLog(@"设备连接wifi成功");
                       }
                       else if (status == DEVICE_PLATFORM_REGISTED)
                       {
                           resolver(@{@"message": @"设备注册平台成功, 可进行添加设备操作", @"isAbleToAdd": @YES});
                       }
                   }];
               }
               else
               {
                   NSLog(@"根据设备闪灯情况选择合适的配网方式");
               }
           }
           else
           {
               NSLog(@"查询失败，网络不给力，可进行重试");
               resolver(@{@"message": @"设备查询失败，网络不给力，可进行重试", @"isAbleToAdd": @NO});
           }
       } else
       {
           NSLog(@"设备已在线，可进行添加设备操作");
           resolver(@{@"message": @"设备已在线，可进行添加设备操作", @"isAbleToAdd": @YES});
       }
    }];
}

@end
