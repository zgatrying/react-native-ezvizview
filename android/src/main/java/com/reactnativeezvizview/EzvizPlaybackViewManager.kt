package com.reactnativeezvizview

import android.util.Log
import com.easemore.ezvizview.ezuiplayerview.EzPlaybackView
import com.easemore.ezvizview.ezuiplayerview.utils.EZOpenUtils
import com.facebook.infer.annotation.Assertions
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import java.util.*

class EzvizPlaybackViewManager: SimpleViewManager<EzPlaybackView>() {

  private val TAG:String = "EzvizPlaybackView"

  val COMMAND_PAUSE = 1
  val COMMAND_REPLAY = 2
  val COMMAND_CREATE_PLAYER = 3
  val COMMAND_RELEASE = 4
  val COMMAND_RESUME = 5

  override fun getName() = "RCTEzvizPlaybackView"

  override fun createViewInstance(reactContext: ThemedReactContext): EzPlaybackView {
    return EzPlaybackView(reactContext, reactContext.getCurrentActivity())
  }

  override fun getExportedCustomBubblingEventTypeConstants(): MutableMap<String, Any> {
    var builder: MapBuilder.Builder<String, Any> = MapBuilder.builder<String, Any>();
    for (event in EzPlaybackView.Events.values()) {
      builder.put(event.toString(), MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", event.toString())));
    }
    return builder.build();
  }

  override fun getCommandsMap(): MutableMap<String, Int> {
    return MapBuilder.of(
      "pause",
      COMMAND_PAUSE,
      "replay",
      COMMAND_REPLAY,
      "createPlayer",
      COMMAND_CREATE_PLAYER,
      "releasePlayer",
      COMMAND_RELEASE,
      "resume",
      COMMAND_RESUME
    )
  }

  override fun receiveCommand(root: EzPlaybackView, commandId: Int, args: ReadableArray?) {
    Log.d(TAG, "receiveCommand: $commandId")
    Assertions.assertNotNull(root)
    Assertions.assertNotNull(args)
    when (commandId) {
      COMMAND_PAUSE -> {
        root.pause()
        return
      }
      COMMAND_REPLAY -> {
        root.rePlay()
        return
      }
      COMMAND_CREATE_PLAYER -> {
        if (root.getmDeviceSerial() != null && root.getmVerifyCode() != null) {
          root.createPlayer()
        }
        return
      }
      COMMAND_RELEASE -> {
        root.releasePlayer()
        return
      }
      COMMAND_RESUME -> {
        root.resumePlay()
        return
      }
      else -> throw IllegalArgumentException(String.format(
        "Unsupported command %d received by %s.",
        commandId,
        javaClass.simpleName))
    }
  }

  @ReactProp(name = "deviceSerial")
  fun setDeviceSerial(view: EzPlaybackView, deviceSerial: String) {
    view.setDeviceSerial(deviceSerial)
  }

  @ReactProp(name = "cameraNo")
  fun setCameraNo(view: EzPlaybackView, cameraNo: Int) {
    view.setCameraNo(cameraNo)
  }

  @ReactProp(name = "verifyCode")
  fun setVerifyCode(view: EzPlaybackView, verifyCode: String) {
    view.setVerifyCode(verifyCode)
  }

  @ReactProp(name = "startTime")
  fun setStartTime(view: EzPlaybackView, startTime: String) {
    var time:Calendar = EZOpenUtils.parseTimeToCalendar(startTime);
    Log.d(TAG, "setStartTime: " + time.time)
    view.setmStartTime(time);
  }

  @ReactProp(name = "endTime")
  fun setEndTime(view: EzPlaybackView, endTime: String) {
    var time:Calendar = EZOpenUtils.parseTimeToCalendar(endTime);
    Log.d(TAG, "setEndTime: " + time.time)
    view.setmEndTime(time);
  }

  override fun onAfterUpdateTransaction(view: EzPlaybackView) {
    super.onAfterUpdateTransaction(view);
    view.emitEventToJS(EzPlaybackView.Events.EVENT_LOAD.toString(), null);
  }
}
