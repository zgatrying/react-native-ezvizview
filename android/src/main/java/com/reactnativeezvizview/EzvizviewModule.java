package com.reactnativeezvizview;

import android.util.Base64;
import android.util.Log;

import androidx.annotation.Nullable;

import com.easemore.ezvizview.ezuiplayerview.utils.EZOpenUtils;
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
  public void configWifi(
    String deviceSerial,
    String deviceType,
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
            }
          }
        });
      }
    };
    if(result.getBaseException() == null) {
      Log.d(TAG, "configWifi: 查询成功，添加设备");
      return;
    } else {
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
                } else if(probeDeviceInfo.getSupportWifi() == 3) {
                  Log.d(TAG, "run: 选择smartconfig配网");
                  EZOpenSDK.getInstance().stopConfigWiFi();
                  EZOpenSDK.getInstance().startConfigWifi(EzvizviewModule.this.reactContext, deviceSerial, wifiSSID, wifiPassword,
                    EZConstants.EZWiFiConfigMode.EZWiFiConfigSmart, mEZStartConfigWifiCallback);
                } else if(probeDeviceInfo.getSupportAP() == 2) {
                  Log.d(TAG, "run: 选择设备热点配网");
                }
              }
            }
          });
          break;
        case 120020:
          Log.d(TAG, "configWifi: 设备在线，已经被自己添加");
        case 120022:
          Log.d(TAG, "configWifi: 设备在线，已经被别的用户添加");
        case 120024:
          Log.d(TAG, "configWifi: 设备不在线，已被别的用户添加");
        default:
          Log.d(TAG, "configWifi: Request failed = " + result.getBaseException().getErrorCode());
          break;
      }
    }
  }
}
