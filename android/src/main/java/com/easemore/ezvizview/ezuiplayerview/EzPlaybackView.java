package com.easemore.ezvizview.ezuiplayerview;

import android.os.SystemClock;
import android.text.TextUtils;
import android.util.Log;
import android.view.SurfaceHolder;

import androidx.annotation.Nullable;

import com.easemore.ezvizview.ezuiplayerview.utils.EZOpenUtils;
import com.easemore.ezvizview.ezuiplayerview.view.widget.EZUIPlayerView;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.videogo.exception.BaseException;
import com.videogo.exception.ErrorCode;
import com.videogo.openapi.EZPlayer;
import com.videogo.openapi.OnEZPlayerCallBack;

import java.util.Calendar;
import java.util.concurrent.atomic.AtomicBoolean;

public class EzPlaybackView extends EZUIPlayerView implements SurfaceHolder.Callback {

    private static final String TAG = "EZOpenSDKPlaybackView";

    private String mDeviceSerial = "";
    private int mCameraNo = -1;
    private String mVerifyCode = "";
    private Calendar mStartTime;
    private Calendar mEndTime;

    public final static int STATUS_INIT = 1;
    public final static int STATUS_START = 2;
    public final static int STATUS_PLAY = 3;
    public final static int STATUS_STOP = 4;

    public int mStatus = STATUS_INIT;
    private boolean isSoundOpen = true;

    private EZUIPlayerView mEZUIPlayerView;
    private EZPlayer mEZPlayer;
    private ThemedReactContext mContext;

  public enum Events {
    EVENT_PLAY_SUCCESS("onPlaySuccess"),
    EVENT_PLAY_FAILED("onPlayFailed"),
    EVENT_COMPLETION("onCompletion");

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

  /**
     * resume时是否恢复播放
     */
    private AtomicBoolean isResumePlay = new AtomicBoolean(true);

    /**
     * surface是否创建好
     */
    private AtomicBoolean isInitSurface = new AtomicBoolean(false);

    public EzPlaybackView(ThemedReactContext context) {
        super(context);
        mContext = context;
        mEZUIPlayerView = this;
    }

    public void createPlayer() {
        mEZUIPlayerView.setSurfaceHolderCallback(this);
        if(TextUtils.isEmpty(mDeviceSerial) || mCameraNo == -1) {
            Log.d(TAG, "mDeviceSerial or cameraNo is null");
            return;
        }
        mEZPlayer = EZPlayer.createPlayer(mDeviceSerial, mCameraNo);
        mEZPlayer.setOnEZPlayerCallBack(new OnEZPlayerCallBack() {
            @Override
            public void onPlaySuccess() {
                Log.d(TAG, "onPlaySuccess");
                if(mStatus != STATUS_STOP) {
                    mStatus = STATUS_PLAY;
                    setPlaySound();
                    emitEventToJS(Events.EVENT_PLAY_SUCCESS.toString(), null);
                }
            }

            @Override
            public void onPlayFailed(BaseException e) {
                Log.d(TAG, "onPlayFailed");
                if(mStatus != STATUS_STOP) {
                    mStatus = STATUS_STOP;
                    stopPlayback();
                    handleRealPlayFail(e.getErrorCode());
                    WritableMap event = new WritableNativeMap();
                    event.putInt("errorCode", e.getErrorCode());
                    emitEventToJS(Events.EVENT_PLAY_FAILED.toString(), event);
                }
            }

            @Override
            public void onVideoSizeChange(int i, int i1) {
                Log.d(TAG, "onVideoSizeChange");
                int mVideoWidth = i;
                int mVideoHeight = i1;
                Log.d(TAG, "video width = " + mVideoWidth + "   height = " + mVideoHeight);
            }

            @Override
            public void onCompletion() {
                Log.d(TAG, "onCompletion");
                if(mStatus != STATUS_STOP) {
                  mStatus = STATUS_STOP;
                  stopPlayback();
                  emitEventToJS(Events.EVENT_COMPLETION.toString(), null);
                }
            }
        });
    }

    private void emitEventToJS(String eventName, @Nullable WritableMap event) {
      mContext.getJSModule(RCTEventEmitter.class).receiveEvent(
        getId(),
        eventName,
        event
      );
    }

    private void handleRealPlayFail(int errorCode) {
        String txt = null;
        Log.i(TAG, "handleRealPlayFail: errorCode:" + errorCode);
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
            beforeStartPlayback();
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

    private void stopPlayback() {
        if(mEZPlayer != null) {
            mEZPlayer.pausePlayback();
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

    private void beforeStartPlayback() {
        Log.d(TAG, "startPlayback mStatus = " + mStatus);
        if(mStatus == STATUS_START || mStatus == STATUS_PLAY) {
            return;
        }
        if(!EZOpenUtils.isNetworkAvailable(mContext)) {
            return;
        }
        startPlayback();
    }

    private void startPlayback() {
        if(!TextUtils.isEmpty(mVerifyCode)) {
            mEZPlayer.setPlayVerifyCode(mVerifyCode);
        }
        mStatus = STATUS_START;
        mEZPlayer.startPlayback(mStartTime, mEndTime);
    }

    public void pause() {
      Log.d(TAG, "onStop + " + mStatus);
      if(mStatus != STATUS_STOP) {
        isResumePlay.set(true);
      }
      mStatus = STATUS_STOP;
      stopPlayback();
    }

    public void resumePlay() {
      Log.d(TAG, "onResumeRealPlay   mStatus = " + mStatus);
      Log.d(TAG, "onResumeRealPlay   isInitSurface = " + isInitSurface +"   isResumePlay = "+isResumePlay);
      if(isResumePlay.get() && isInitSurface.get()) {
        isResumePlay.set(false);
        Log.d(TAG, "resumeRealPlay   isInitSurface = " + isInitSurface);
        mStatus = STATUS_PLAY;
        mEZPlayer.resumePlayback();
      }
    }

    public void rePlay() {
      if(mStatus == STATUS_PLAY) {
        stopPlayback();
        SystemClock.sleep(500);
        startPlayback();
      } else {
        startPlayback();
      }
    }

    public void releasePlayer() {
      Log.d(TAG, "onDestroy: ");
      if (mEZPlayer != null) {
        mEZPlayer.release();
      }
    }
}
