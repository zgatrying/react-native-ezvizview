package com.easemore.ezvizview.ezuiplayerview;

import android.app.Activity;
import android.os.Handler;
import android.os.Message;
import android.os.SystemClock;
import android.text.TextUtils;
import android.util.Log;
import android.view.SurfaceHolder;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.easemore.ezvizview.ezuiplayerview.utils.EZOpenUtils;
import com.easemore.ezvizview.ezuiplayerview.view.widget.EZUIPlayerView;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.videogo.errorlayer.ErrorInfo;
import com.videogo.exception.BaseException;
import com.videogo.exception.ErrorCode;
import com.videogo.openapi.EZConstants;
import com.videogo.openapi.EZOpenSDK;
import com.videogo.openapi.EZPlayer;
import com.videogo.realplay.RealPlayStatus;
import com.videogo.remoteplayback.RemotePlayBackMsg;
import com.videogo.util.ConnectionDetector;
import com.videogo.util.LogUtil;

import java.util.Calendar;
import java.util.concurrent.atomic.AtomicBoolean;

public class EzPlaybackView extends EZUIPlayerView implements SurfaceHolder.Callback, Handler.Callback {

    private static final String TAG = "EZOpenSDKPlaybackView";

    private String mDeviceSerial = "";
    private int mCameraNo = -1;
    private String mVerifyCode = "";
    private Calendar mStartTime;
    private Calendar mEndTime;

    public final static int STATUS_INIT = 0;
    public final static int STATUS_START = 1;
    public final static int STATUS_STOP = 2;
    public final static int STATUS_PLAY = 3;
    public final static int STATUS_PAUSE = 4;

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
        case RemotePlayBackMsg.MSG_REMOTEPLAYBACK_PLAY_SUCCUSS:
          emitEventToJS(Events.EVENT_PLAY_SUCCESS.toString(), null);
          mStatus = STATUS_PLAY;
          setPlaySound();
          break;
        case RemotePlayBackMsg.MSG_REMOTEPLAYBACK_PLAY_FAIL:
        case RemotePlayBackMsg.MSG_REMOTEPLAYBACK_SEARCH_FILE_FAIL:
          emitEventToJS(Events.EVENT_PLAY_FAILED.toString(), null);
          handleRealPlayFail(msg.obj);
          break;
        case RemotePlayBackMsg.MSG_REMOTEPLAYBACK_PLAY_FINISH:
          emitEventToJS(Events.EVENT_COMPLETION.toString(), null);
          stopRemotePlayBack();
          break;
        default:
          break;
      }
      return false;
    }

  public enum Events {
    EVENT_PLAY_SUCCESS("onPlaySuccess"),
    EVENT_PLAY_FAILED("onPlayFailed"),
    EVENT_COMPLETION("onCompletion"),
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

    public Calendar getmStartTime() {
      return mStartTime;
    }

    public void setmStartTime(Calendar mStartTime) {
      this.mStartTime = mStartTime;
    }

    public Calendar getmEndTime() {
      return mEndTime;
    }

    public void setmEndTime(Calendar mEndTime) {
      this.mEndTime = mEndTime;
    }

    public EzPlaybackView(ThemedReactContext context, Activity activity) {
        super(context);
        mContext = context;
        mActivity = activity;
        mEZUIPlayerView = this;
        mHandler = new Handler(this);
    }

    public void createPlayer() {
      mEZUIPlayerView.setSurfaceHolderCallback(this);
      if(TextUtils.isEmpty(mDeviceSerial) || mCameraNo == -1) {
        Log.d(TAG, "mDeviceSerial or cameraNo is null");
        return;
      }
      startRemotePlayback();
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

        stopRemotePlayBack();

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
        Log.i(TAG, "handlePlaybackFail: errorCode:" + errorCode);
        Log.e(TAG, "handlePlaybackFail: " + txt);
    }

    @Override
    public void surfaceCreated(SurfaceHolder surfaceHolder) {
      if(mEZPlayer != null) {
        mEZPlayer.setSurfaceHold(surfaceHolder);
      }
      mEZUIPlayerView.mRealPlaySh = surfaceHolder;
    }

    @Override
    public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int i1, int i2) {

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder surfaceHolder) {
      if(mEZPlayer != null) {
        mEZPlayer.setSurfaceHold(null);
      }
      mEZUIPlayerView.mRealPlaySh = null;
    }

    private void stopRemotePlayBack() {
      LogUtil.d(TAG, "stopRemotePlayBack");
      mStatus = STATUS_STOP;
      if(mEZPlayer != null) {
        mEZPlayer.stopPlayback();
      }
    }

    private void setPlaySound() {
        if(mEZPlayer != null) {
            if(isSoundOpen) {
                mEZPlayer.openSound();
            } else {
                mEZPlayer.closeSound();
            }
        }
    }

    private void startRemotePlayback() {
      Log.d(TAG, "startRemotePlayBack:" + mStartTime + ", " + mEndTime);
      if(mStatus == STATUS_START || mStatus == STATUS_PLAY) {
        return;
      }
      if(!ConnectionDetector.isNetworkAvailable(mActivity)) {
        return;
      }

      if(mEZPlayer != null && mStatus == STATUS_PAUSE) {
        resumeRemotePlayBack();
        return;
      }

      mStatus = STATUS_START;
      if(mEZPlayer == null) {
        mEZPlayer = EZOpenSDK.getInstance().createPlayer(mDeviceSerial, mCameraNo);
        if(mEZPlayer == null) {
          return;
        }
        if(mVerifyCode != null) {
          mEZPlayer.setPlayVerifyCode(mVerifyCode);
        }
        mEZPlayer.setHandler(mHandler);
        mEZPlayer.setSurfaceHold(mEZUIPlayerView.mRealPlaySh);
      }

      if(mStartTime != null && mEZPlayer != null) {
        mEZPlayer.startPlayback(mStartTime, mEndTime);
      }
    }

    private void resumeRemotePlayBack() {
      LogUtil.d(TAG, "resumeRemotePlayBack");
      mStatus = STATUS_PLAY;

      if (mEZPlayer != null) {
        mEZPlayer.openSound();
        mEZPlayer.resumePlayback();
      }
    }

    private void pauseRemotePlayback() {
      Log.d(TAG, "pauseRemotePlayback: ");
      mStatus = STATUS_PAUSE;

      if(mEZPlayer != null) {
        mEZPlayer.pausePlayback();
      }
    }

    public void pause() {
      Log.d(TAG, "pause + " + mStatus);
      if(mEZPlayer != null && mStatus == STATUS_PLAY) {
        pauseRemotePlayback();
      }
    }

    public void resumePlay() {
      Log.d(TAG, "resumePlay mStatus = " + mStatus);
      if(mEZPlayer != null && mStatus == STATUS_PAUSE) {
        resumeRemotePlayBack();
      }
    }

    public void rePlay() {
      Log.d(TAG, "replay   mStatus = " + mStatus);
      if(mStatus == STATUS_PLAY) {
        stopRemotePlayBack();
        SystemClock.sleep(500);
      }
      startRemotePlayback();
    }

    public void releasePlayer() {
      Log.d(TAG, "releasePlayer: ");
      if (mEZPlayer != null) {
        mEZPlayer.release();
      }
    }
}
