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
import com.videogo.openapi.EZOpenSDK;
import com.videogo.openapi.bean.EZAccessToken;
import com.videogo.openapi.bean.EZCloudRecordFile;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

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
  public void initSDK(boolean debug, String appKey, Promise promise) {
    EZOpenSDK.clearStreamInfoCache();
    EZOpenSDK.showSDKLog(debug);
    EZOpenSDK.initSDK(reactContext, appKey);
    promise.resolve(null);
  }

  @ReactMethod
  public void getAccessToken(
    Promise promise) {
    WritableMap resultData = new WritableNativeMap();
    EZAccessToken ezAccessToken = EZOpenSDK.getEZAccessToken();
    if(ezAccessToken != null) {
      String accessToken = ezAccessToken.getAccessToken();
      long expire = ezAccessToken.getExpire();
      resultData.putString("accessToken", accessToken);
      resultData.putDouble("expire", expire);
      promise.resolve(resultData);
    } else {
      Exception e = new Exception("accessToken为null");
      promise.reject(E_ACCESSTOKEN_ERROR, e);
    }
  }

  @ReactMethod
  public void openLoginPage() {
    if(!EZOpenSDK.isLogin()) {
      EZOpenSDK.openLoginPage();
    }
  }

  @ReactMethod
  public void setPlayerPause(int ReactTag, String commandId, @Nullable ReadableArray args) {

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
    byte[] decryptData = EZOpenSDK.decryptData(inputData, verifyCode);
    if(decryptData != null) {
      String base64Url = Base64.encodeToString(decryptData, Base64.DEFAULT);
      promise.resolve(base64Url);
    } else {
      promise.reject(new Exception("解密失败，请确认url是否为加密过的告警图片"));
    }
  }

//  @ReactMethod
//  public void searchRecordFileFromDevice(
//    String deviceSerial,
//    int cameraNo,
//    String startTime,
//    String endTime,
//    Promise promise
//  ) {
//    Calendar mStartTime = EZOpenUtils.parseTimeToCalendar(startTime);
//    Calendar mEndTime = EZOpenUtils.parseTimeToCalendar(endTime);
//    new Thread(new Runnable() {
//      @Override
//      public void run() {
//        try {
//          List<EZCloudRecordFile> list = EZOpenSDK.searchRecordFileFromCloud(deviceSerial, cameraNo, mStartTime, mEndTime);
//          if(list != null && list.size() > 0) {
//
//          }
//        } catch (BaseException e) {
//          promise.reject(e);
//        }
//      }
//    });
//  }
}
