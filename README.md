# react-native-ezvizview

基于萤石云 sdk

## 效果预览

<div >
  <image src='./screenshot/realplay.jpeg' style='width: 200px; height: 400px;'>
  <image src='./screenshot/alarmList.jpeg' style='width: 200px; height: 400px;'>
  <image src='./screenshot/playback.jpeg' style='width: 200px; height: 400px;'>
</div>

**Android 端：**

- [x] 实现 EzvizView 原生组件，用于查看实时画面
- [x] 实现 EzvizPlaybackView 原生组件，用于回放录像
- [x] 实现实时预览功能
- [x] 实现云台控制功能
- [x] 实现布撤防功能
- [x] 解密指定设备上的加密过的告警消息图片 url
- [x] 实现声波配网功能
- [x] 实现AP配网功能

**iOS 端**

- [x] 实现 EzvizView 原生组件，用于查看实时画面
- [x] 实现 EzvizPlaybackView 原生组件，用于回放录像
- [x] 实现实时预览功能
- [x] 实现云台控制功能
- [x] 实现布撤防功能
- [x] 解密指定设备上的加密过的告警消息图片 url
- [x] 实现声波配网功能；
- [x] 实现AP配网功能；

## Installation

```sh
npm install --save react-native-ezvizview
```

## Android installation

<details>
  <summary>Android details</summary>

首先，在项目的 AndroidManifest.xml 添加下面的权限：

```xml
  <!--基础功能所需权限-->
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.READ_PHONE_STATE"/>
```

然后配置`app/build.gradle`：

```
    defaultConfig {
       ...
        ndk {
            abiFilters "armeabi-v7a" //自4.8.8版本开始支持arm64-v8a，按需使用
        }
    }
     sourceSets {
        main {
            jniLibs.srcDirs = ['libs']
        }
    }
    dependencies {
      api 'com.ezviz.sdk:ezviz-sdk:4.16.1' //因为在MainApplication.java中需要用到萤石sdk的方法，所以需要配置此项
    }
```

在`android/app/src/.../MainApplication.java`中初始化sdk：

```java
public class MainApplication extends Application implements ReactApplication {
    @Override
  public void onCreate() {
    super.onCreate();

    EZOpenSDK.showSDKLog(true);
    EZOpenSDK.initLib(this, "appkey");

    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager()); // Remove this line if you don't want Flipper enabled
  }
}
```

并且确保 android/app/build.gradle 文件中的 applicationId 与萤石开放平台申请的 bundleId 一致。

最后需要配置`proguard-rules.pro`文件：

<details>
  <summary>目前SDK在打包时不能混淆，请添加以下内容</summary>
  
  
    #========SDK对外接口=======#
    -keep class com.ezviz.opensdk.** { *;}

    #========以下是hik二方库=======#
    -dontwarn com.ezviz.**
    -keep class com.ezviz.** { *;}

    -dontwarn com.ez.**
    -keep class com.ez.** { *;}

    -dontwarn com.hc.CASClient.**
    -keep class com.hc.CASClient.** { *;}

    -dontwarn com.videogo.**
    -keep class com.videogo.** { *;}

    -dontwarn com.hik.TTSClient.**
    -keep class com.hik.TTSClient.** { *;}

    -dontwarn com.hik.stunclient.**
    -keep class com.hik.stunclient.** { *;}

    -dontwarn com.hik.streamclient.**
    -keep class com.hik.streamclient.** { *;}

    -dontwarn com.hikvision.sadp.**
    -keep class com.hikvision.sadp.** { *;}

    -dontwarn com.hikvision.netsdk.**
    -keep class com.hikvision.netsdk.** { *;}

    -dontwarn com.neutral.netsdk.**
    -keep class com.neutral.netsdk.** { *;}

    -dontwarn com.hikvision.audio.**
    -keep class com.hikvision.audio.** { *;}

    -dontwarn com.mediaplayer.audio.**
    -keep class com.mediaplayer.audio.** { *;}

    -dontwarn com.hikvision.wifi.**
    -keep class com.hikvision.wifi.** { *;}

    -dontwarn com.hikvision.keyprotect.**
    -keep class com.hikvision.keyprotect.** { *;}

    -dontwarn com.hikvision.audio.**
    -keep class com.hikvision.audio.** { *;}

    -dontwarn org.MediaPlayer.PlayM4.**
    -keep class org.MediaPlayer.PlayM4.** { *;}
    #========以上是hik二方库=======#

    #========以下是第三方开源库=======#
    # JNA
    -dontwarn com.sun.jna.**
    -keep class com.sun.jna.** { *;}

    # Gson
    -keepattributes *Annotation*
    -keep class sun.misc.Unsafe { *; }
    -keep class com.idea.fifaalarmclock.entity.***
    -keep class com.google.gson.stream.** { *; }

    # OkHttp
    # JSR 305 annotations are for embedding nullability information.
    -dontwarn javax.annotation.**
    # A resource is loaded with a relative path so the package of this class must be preserved.
    -keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
    # Animal Sniffer compileOnly dependency to ensure APIs are compatible with older versions of Java.
    -dontwarn org.codehaus.mojo.animal_sniffer.*
    # OkHttp platform used only on JVM and when Conscrypt dependency is available.
    -dontwarn okhttp3.internal.platform.ConscryptPlatform
    # 必须额外加的，否则编译无法通过
    -dontwarn okio.**
    #========以上是第三方开源库=======#

</details>

</details>

## iOS installation

<details>
  <summary>
    iOS Details
  </summary>
  
  在ios目录下执行

  ```
  pod install
  ```

  其他配置参考[萤石iOS SDK使用说明](https://open.ys7.com/doc/zh/book/4.x/ios-sdk.html)

  最后向`AppDelegate.m`中添加以下内容：
  ```swift
  #import <EZOpenSDKFramework/EZOpenSDK.h>
  #import <EZOpenSDKFramework/EZHCNetDeviceSDK.h>
  #define EZOPENSDK [EZOpenSDK class]


  @implementation AppDelegate

  - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
  {
    //...
    
    //  init ezviz sdk
    [EZOPENSDK setDebugLogEnable:YES];
    [EZOPENSDK initLibWithAppKey: @"your appKey"];
    [EZHCNetDeviceSDK initSDK];
    NSLog(@"EZOpenSDK Version = %@", [EZOPENSDK getVersion]);

    //...
  }
  @end
  ```
</details>

## Usage

```js
import Ezvizview, { initSDK, openLoginPage } from 'react-native-ezvizview';
```

**第一步：获取并设置accessToken：从自建的服务器获取AccessToken，并调用sdk的setAccessToken方法设置AccessToken；**

**第二步：获取播放监控实时画面必要的信息：设备序列号、通道号、设备验证码；**

**第三步：展示 EzvizView 组件或 EzvizPlaybackView 组件；**

```js
//实时预览
<EzvizviewView
deviceSerial="设备序列号" //在设备上找
cameraNo={1} //通道号，与channelNo的意思相同
verifyCode="设备验证码" //在设备上找，它作为默认的加密密码使用
style={styles.box}
onPlaySuccess={() => consolle.log('play success')}
onPlayFailed={() => consolle.log('play failed')}
/>

//回放，目前仅支持远程SD卡录像回放
<EzvizPlaybackView
  style={{
    width: '100%',
    height: 200,
  }}
  deviceSerial={deviceSerial}
  verifyCode={verifyCode}
  cameraNo={cameraNo}
  startTime={startTime}
  endTime={endTime}
/>
```

## API

**EzvizView组件：实时预览组件**

Prop | 描述
| -- | -- |
|deviceSerial| 设备序列号 | 
|cameraNo | 通道号 |
|verifyCode| 验证码，用于解密 |
|onPlaySuccess | 播放成功的回调函数 |
|onPlayFailed | 播放失败的回调函数 |

**EzvizPlaybackView组件：录像回放组件**

Prop | 描述
| -- | -- |
|deviceSerial| 设备序列号 | 
|cameraNo | 通道号 |
|verifyCode| 验证码，用于解密 |
| startTime | 录像开始时间 |
| endTime | 录像结束时间 |
| onCompletion | 录像播放结束的回调 |
|onPlaySuccess | 播放成功的回调函数 |
|onPlayFailed | 播放失败的回调函数 |

**Ezviz模块：**

|方法名 | 描述 |
| --- | --- |
|decryptUrl| 解密告警消息图片url返回base64字符串 |
|probeDeviceInfo| 调用sdk的probeDeviceInfo方法，查询设备状态信息（包含归属状态、网络状态等消息）|
|requestWhenInUseAuthorization | 仅ios，请求获取定位权限（因为ios端调用设备配网方法前必须先获取定位权限，所以才增加了此方法）|
|startConfigWifi| 调用sdk的声波配网方法 |
|stopConfigWifi| 调用sdk的停止配网方法 |
|startAPConfigWifi| 调用sdk的AP配网方法 |
|stopAPConfigWifi| 调用sdk的停止AP配网方法 |

## 参考

- [萤石云开放平台文档](https://open.ys7.com/doc/zh/)

## License

MIT
