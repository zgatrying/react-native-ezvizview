package com.easemore.ezvizview.ezuiplayerview;

import android.app.Activity;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.view.SurfaceHolder;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.easemore.ezvizview.ezuiplayerview.utils.EZOpenUtils;
import com.easemore.ezvizview.ezuiplayerview.view.widget.EZUIPlayerView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.videogo.errorlayer.ErrorInfo;
import com.videogo.exception.BaseException;
import com.videogo.exception.ErrorCode;
import com.videogo.openapi.EZConstants;
import com.videogo.openapi.EZConstants.EZRealPlayConstants;
import com.videogo.openapi.EZOpenSDK;
import com.videogo.openapi.EZPlayer;

import java.util.concurrent.atomic.AtomicBoolean;

public class Ezview extends EZUIPlayerView implements SurfaceHolder.Callback, Handler.Callback {

    private static final String TAG = "EZOpenSDKPlayerView";

    private String mDeviceSerial = "";
    private int mCameraNo = -1;
    private String mVerifyCode = "";

    public final static int STATUS_INIT = 1;
    public final static int STATUS_START = 2;
    public final static int STATUS_PLAY = 3;
    public final static int STATUS_STOP = 4;

    public int mStatus = STATUS_INIT;
    private boolean isSoundOpen = true;

    private EZUIPlayerView mEZUIPlayerView;
    private EZPlayer mEZPlayer;
    private ThemedReactContext mContext;
    private Activity mActivity;
    private Handler mHandler = null;

  @Override
  public boolean handleMessage(@NonNull Message msg) {
    if(mActivity.isFinishing()) {
      return false;
    }
    Log.d(TAG, "handleMessage: " + msg.what);
    switch (msg.what) {
      case EZRealPlayConstants.MSG_REALPLAY_PLAY_SUCCESS:
        emitEventToJS(Events.EVENT_PLAY_SUCCESS.toString(), null);
        setRealPlaySound();
        break;
      case EZRealPlayConstants.MSG_REALPLAY_PLAY_FAIL:
        emitEventToJS(Events.EVENT_PLAY_FAILED.toString(), null);
        handleRealPlayFail(msg.obj);
        break;
      default:
        break;
    }
    return false;
  }

  public enum Events {
    EVENT_PLAY_SUCCESS("onPlaySuccess"),
    EVENT_PLAY_FAILED("onPlayFailed"),
    EVENT_LOAD("onLoad");

    private final String mName;

    Events(final String name) {
      mName = name;
    }

    @Override
    public String toString() {
      return mName;
    }
  }

    public String getmDeviceSerial() {
      return mDeviceSerial;
    }

    public int getmCameraNo() {
      return mCameraNo;
    }

    public String getmVerifyCode() {
      return mVerifyCode;
    }

    public void setDeviceSerial(String deviceSerial) {
        mDeviceSerial = deviceSerial;
      Log.d(TAG, "setDeviceSerial: " + deviceSerial);
    }

    public void setCameraNo(int cameraNo) {
        mCameraNo = cameraNo;
      Log.d(TAG, "setCameraNo: " + cameraNo );
    }

    public void setVerifyCode(String verifyCode) {
        mVerifyCode = verifyCode;
    }

    /**
     * resume时是否恢复播放
     */
    private AtomicBoolean isResumePlay = new AtomicBoolean(true);

    /**
     * surface是否创建好
     */
    private AtomicBoolean isInitSurface = new AtomicBoolean(false);

    public Ezview(ThemedReactContext context, Activity activity) {
        super(context);
        mContext = context;
        mEZUIPlayerView = this;
        mActivity = activity;
        Log.d(TAG, "Ezview: onCreated");
        mHandler = new Handler(this);
    }

    public void createPlayer() {
        mEZUIPlayerView.setSurfaceHolderCallback(this);
        if(TextUtils.isEmpty(mDeviceSerial) || mCameraNo == -1) {
            Log.d(TAG, "mDeviceSerial or cameraNo is null");
            return;
        }
        mEZPlayer = EZOpenSDK.getInstance().createPlayer(mDeviceSerial, mCameraNo);
        if(mEZPlayer == null) {
          return;
        }
        mEZPlayer.setHandler(mHandler);
        beforeStartRealPlay();
    }

    public void emitEventToJS(String eventName, @Nullable WritableMap event) {
      mContext.getJSModule(RCTEventEmitter.class).receiveEvent(
        getId(),
        eventName,
        event
      );
    }

    private void handleRealPlayFail(Object obj) {
        int errorCode = 0;
        if(obj != null) {
          ErrorInfo errorInfo = (ErrorInfo) obj;
          errorCode = errorInfo.errorCode;
        }
        String txt = null;
        // 判断返回的错误码
        switch (errorCode) {
            case ErrorCode.ERROR_TRANSF_ACCESSTOKEN_ERROR:
                EZOpenUtils.gotoLogin();
                return;
            case ErrorCode.ERROR_CAS_MSG_PU_NO_RESOURCE:
                txt = "设备连接数过大，停止其他连接后再试试吧";
                break;
            case ErrorCode.ERROR_TRANSF_DEVICE_OFFLINE:
                txt = "设备不在线";
                break;
            case ErrorCode.ERROR_INNER_STREAM_TIMEOUT:
                txt = "播放失败，连接设备异常";
                break;
            case ErrorCode.ERROR_WEB_CODE_ERROR:
                break;
            case ErrorCode.ERROR_WEB_HARDWARE_SIGNATURE_OP_ERROR:
                break;
            case ErrorCode.ERROR_TRANSF_TERMINAL_BINDING:
                txt = "请在萤石客户端关闭终端绑定";
                break;
            case ErrorCode.ERROR_EXTRA_SQUARE_NO_SHARING:
            default:
                txt = "视频播放失败";
                break;
        }
        stopRealPlay();
        Log.i(TAG, "handleRealPlayFail: errorCode:" + errorCode);
        Log.e(TAG, "handleRealPlayFail: " + txt);
    }

    @Override
    public void surfaceCreated(SurfaceHolder surfaceHolder) {
        if(mEZPlayer != null) {
            mEZPlayer.setSurfaceHold(surfaceHolder);
        }
        Log.d(TAG, "surfaceCreated isInitSurface = " + isInitSurface);
        if(isInitSurface.compareAndSet(false, true) && isResumePlay.get()) {
            isResumePlay.set(false);
            beforeStartRealPlay();
        }
    }

    @Override
    public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int i1, int i2) {

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder surfaceHolder) {
        Log.d(TAG, "surfaceDestroyed");
        isInitSurface.set(false);
    }

    private void stopRealPlay() {
        if(mEZPlayer != null) {
            mEZPlayer.stopRealPlay();
        }
    }

    private void setRealPlaySound() {
        if(mEZPlayer != null) {
            if(isSoundOpen) {
                mEZPlayer.openSound();
            } else {
                mEZPlayer.closeSound();
            }
        }
    }

    private void beforeStartRealPlay() {
        Log.d(TAG, "startRealPlay mStatus = " + mStatus);
        if(mStatus == STATUS_START || mStatus == STATUS_PLAY) {
            return;
        }
        if(!EZOpenUtils.isNetworkAvailable(mContext)) {
            return;
        }
        startRealPlay();
    }

    private void startRealPlay() {
        if(!TextUtils.isEmpty(mVerifyCode)) {
            mEZPlayer.setPlayVerifyCode(mVerifyCode);
        }
        mStatus = STATUS_START;
        mEZPlayer.startRealPlay();
    }

    public void pause() {
        Log.d(TAG, "onStop + " + mStatus);
        if(mStatus != STATUS_STOP) {
            isResumePlay.set(true);
        }
        mStatus = STATUS_STOP;
        stopRealPlay();
    }

    public void rePlay() {
        Log.d(TAG, "onReplay   mStatus = " + mStatus);
        Log.d(TAG, "onReplay   isInitSurface = " + isInitSurface +"   isResumePlay = "+isResumePlay);
        if(isResumePlay.get() && isInitSurface.get()) {
          isResumePlay.set(false);
          Log.d(TAG, "onResume   isInitSurface = " + isInitSurface);
          startRealPlay();
        }
    }

    public void releasePlayer() {
        Log.d(TAG, "onDestroy: ");
        if (mEZPlayer != null) {
            mEZPlayer.release();
        }
    }
}
