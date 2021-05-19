package com.reactnativeezvizview;

import android.util.Base64;
import android.util.Log;

import androidx.annotation.Nullable;

import com.easemore.ezvizview.ezuiplayerview.utils.EZOpenUtils;
import com.ezviz.sdk.configwifi.EZConfigWifiInfoEnum;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.videogo.exception.BaseException;
import com.videogo.openapi.EZConstants;
import com.videogo.openapi.EZOpenSDK;
import com.videogo.openapi.EZOpenSDKListener;
import com.videogo.openapi.bean.EZAccessToken;
import com.videogo.openapi.bean.EZCloudRecordFile;
import com.videogo.openapi.bean.EZProbeDeviceInfo;
import com.videogo.openapi.bean.EZProbeDeviceInfoResult;
import com.videogo.util.LogUtil;
import com.videogo.wificonfig.APWifiConfig;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class EzvizviewModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  private final String TAG = "EzvizviewModule";
  private static final String E_ACCESSTOKEN_ERROR = "E_ACCESSTOKEN_ERROR";

  public EzvizviewModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNEzvizview";
  }

  @ReactMethod
  public void setAccessToken(String accessToken) {
    EZOpenSDK.getInstance().setAccessToken(accessToken);
  }

  @ReactMethod
  public void decryptData(
    ReadableArray encryptData,
    String verifyCode,
    Promise promise) {
    Log.d(TAG, "decryptData: " + encryptData);

    byte[] inputData = new byte[encryptData.size()];
    for (int i = 0; i < encryptData.size(); i++) {
      inputData[i] = (byte) encryptData.getInt(i);
    }
    byte[] decryptData = EZOpenSDK.getInstance().decryptData(inputData, verifyCode);
    if(decryptData != null) {
      String base64Url = Base64.encodeToString(decryptData, Base64.DEFAULT);
      promise.resolve(base64Url);
    } else {
      promise.reject(new Exception("解密失败，请确认url是否为加密过的告警图片"));
    }
  }

  private boolean isWifiConnected = false;
  private boolean isPlatConnected = false;

  @ReactMethod
  public void stopConfigWifi() {
    EZOpenSDK.getInstance().stopConfigWiFi();
  }

  @ReactMethod
  public void probeDeviceInfo(
    String deviceSerial,
    String deviceType,
    Promise promise
  ) {
    final EZProbeDeviceInfoResult deviceInfoResult = EZOpenSDK.getInstance().probeDeviceInfo(deviceSerial, deviceType);
    WritableNativeMap result = new WritableNativeMap();
    if(deviceInfoResult.getBaseException() == null) {
      result.putString("message", "设备已在线，可进行添加设备操作");
      result.putBoolean("isAbleToAdd", true);
      result.putBoolean("isNeedToConfigWifi", false);
    } else {
      switch (deviceInfoResult.getBaseException().getErrorCode()) {
        case 120023:
        case 120002:
        case 120029:
          result.putString("message", "设备不在线，需要配网");
          result.putBoolean("isAbleToAdd", true);
          result.putBoolean("isNeedToConfigWifi", true);
          break;
        case 120020:
          result.putString("message", "设备在线，已经被自己添加");
          result.putBoolean("isAbleToAdd", false);
          result.putBoolean("isNeedToConfigWifi", false);
          break;
        case 120022:
          result.putString("message", "设备在线，已经被别的用户添加");
          result.putBoolean("isAbleToAdd", false);
          result.putBoolean("isNeedToConfigWifi", false);
          break;
        case 120024:
          result.putString("message", "设备不在线，已被别的用户添加");
          result.putBoolean("isAbleToAdd", false);
          result.putBoolean("isNeedToConfigWifi", false);
          break;
        default:
          result.putString("message", "Request failed = " + deviceInfoResult.getBaseException().getErrorCode());
          result.putBoolean("isAbleToAdd", false);
          result.putBoolean("isNeedToConfigWifi", false);
          break;
      }
    }
    promise.resolve(result);
  }

  @ReactMethod
  public void configWifi(
    String deviceSerial,
    String deviceType,
    String verifyCode,
    String wifiSSID,
    String wifiPassword,
    Promise promise
  ) {
    final EZProbeDeviceInfoResult result = EZOpenSDK.getInstance().probeDeviceInfo(deviceSerial, deviceType);
    isWifiConnected = false;
    isPlatConnected = false;
    EZOpenSDKListener.EZStartConfigWifiCallback mEZStartConfigWifiCallback = new EZOpenSDKListener.EZStartConfigWifiCallback() {
      @Override
      public void onStartConfigWifiCallback(String deviceSerial, final EZConstants.EZWifiConfigStatus status) {
        runOnUiThread(new Runnable() {
          @Override
          public void run() {
            if (status == EZConstants.EZWifiConfigStatus.DEVICE_WIFI_CONNECTED) {
              if(isWifiConnected) {
                Log.i(TAG, "run: 设备wifi连接成功, 且标志位isWifiConnected已为true");
                return;
              }
              Log.d(TAG, "run: 设备wifi连接成功");
              isWifiConnected = true;
            } else if (status == EZConstants.EZWifiConfigStatus.DEVICE_PLATFORM_REGISTED) {
              if(isPlatConnected) {
                Log.i(TAG, "run: 设备已注册到平台，且标志位isPlatConnected已为true");
                return;
              }
              isPlatConnected = true;
              EZOpenSDK.getInstance().stopConfigWiFi();
              Log.d(TAG, "run: 设备注册到平台成功，可以调用添加设备接口添加设备");
              promise.resolve("success");
            }
          }
        });
      }
    };
    APWifiConfig.APConfigCallback apConfigCallback = new APWifiConfig.APConfigCallback() {
      @Override
      public void onSuccess() {
        EZOpenSDK.getInstance().stopAPConfigWifiWithSsid();
        Log.d(TAG, "startAPConfigWifiWithSsid onSuccess mDeviceSerial = " + deviceSerial);
      }

      @Override
      public void onInfo(int code, String message) {
        if(code == EZConfigWifiInfoEnum.CONNECTED_TO_PLATFORM.code) {
          Log.d(TAG, "onInfo: 设备注册到平台成功, 可以调用添加设备接口添加设备");
          promise.resolve("success");
        }
        if(code == EZConfigWifiInfoEnum.CONNECTED_TO_WIFI.code) {
          Log.d(TAG, "onInfo: 设备wifi连接成功");
        }
      }

      @Override
      public void OnError(int code) {
        EZOpenSDK.getInstance().stopAPConfigWifiWithSsid();
        Log.d(TAG, "startAPConfigWifiWithSsid  OnError mDeviceSerial = " + deviceSerial);
        switch (code) {
          case 111:
            Log.d(TAG, "errorCode: " + code);
            break;
          case 15:
            promise.reject("超时");
            break;
          case 1:
            promise.reject("参数错误");
            break;
          case 2:
            promise.reject("设备ap热点密码错误");
            break;
          case 3:
            promise.reject("连接ap热点异常");
            break;
          case 4:
            promise.reject("搜索WiFi热点错误");
            break;
          default:
            promise.reject("AP配网失败，未知错误 " + code);
            break;
        }
      }
    };
    if(result.getBaseException() == null) {
      Log.d(TAG, "configWifi: 查询成功，添加设备");
      promise.resolve("success");
      return;
    } else {
      String errorMessage = "";
      switch (result.getBaseException().getErrorCode()) {
        case 120023:
        case 120002:
        case 120029:
          runOnUiThread(new Runnable() {
            @Override
            public void run() {
              EZProbeDeviceInfo probeDeviceInfo = result.getEZProbeDeviceInfo();
              if(probeDeviceInfo == null) {
                // 未查询到设备信息，不确定设备支持的配网能力,需要用户根据指示灯判断
                //若设备指示灯红蓝闪烁，请选择smartconfig配网
                //若设备指示灯蓝色闪烁，请选择设备热点配网
              } else {
                if(probeDeviceInfo.getSupportSoundWave() == 1) {
                  Log.d(TAG, "run: 选择声波配网");
                  EZOpenSDK.getInstance().startConfigWifi(EzvizviewModule.this.reactContext, deviceSerial, wifiSSID, wifiPassword,
                    EZConstants.EZWiFiConfigMode.EZWiFiConfigWave, mEZStartConfigWifiCallback);
                } else
//                  if(probeDeviceInfo.getSupportWifi() == 3) {
//                  Log.d(TAG, "run: 选择smartconfig配网");
//                  EZOpenSDK.getInstance().startConfigWifi(EzvizviewModule.this.reactContext, deviceSerial, wifiSSID, wifiPassword,
//                    EZConstants.EZWiFiConfigMode.EZWiFiConfigSmart, mEZStartConfigWifiCallback);
//                } else
                  if(probeDeviceInfo.getSupportAP() == 1) {
                  Log.d(TAG, "run: 选择设备热点配网");
                  EZOpenSDK.getInstance().startAPConfigWifiWithSsid(wifiSSID, wifiPassword, deviceSerial, verifyCode, apConfigCallback);
                }
              }
            }
          });
          break;
        case 120020:
          Log.d(TAG, "configWifi: 设备在线，已经被自己添加");
          errorMessage = "设备在线，已经被自己添加";
          promise.reject(errorMessage);
          break;
        case 120022:
          Log.d(TAG, "configWifi: 设备在线，已经被别的用户添加");
          errorMessage = "设备在线，已经被别的用户添加";
          promise.reject(errorMessage);
          break;
        case 120024:
          Log.d(TAG, "configWifi: 设备不在线，已被别的用户添加");
          errorMessage = "设备不在线，已被别的用户添加";
          promise.reject(errorMessage);
          break;
        default:
          Log.d(TAG, "configWifi: Request failed = " + result.getBaseException().getErrorCode());
          errorMessage = "Request failed = " + result.getBaseException().getErrorCode();
          promise.reject(errorMessage);
          break;
      }
    }
  }
}
