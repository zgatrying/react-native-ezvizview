package com.reactnativeezvizview;

import android.util.Log;
import java.util.Map;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.easemore.ezvizview.ezuiplayerview.Ezview;
import com.easemore.ezvizview.ezuiplayerview.Ezview.Events;
import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.common.MapBuilder.Builder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public final class EzvizViewManager extends ViewGroupManager<Ezview> {

  private final String TAG = "EzvizViewManager";

  public static final int COMMAND_PAUSE = 1;
  public static final int COMMAND_REPLAY = 2;
  public static final int COMMAND_CREATE_PLAYER = 3;
  public static final int COMMAND_RELEASE = 4;

  @NonNull
  @Override
  public String getName() {
    return "RCTEzvizView";
  }

  @NonNull
  @Override
  protected Ezview createViewInstance(@NonNull ThemedReactContext reactContext) {
    Ezview view = new Ezview(reactContext, reactContext.getCurrentActivity());
    return view;
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    Builder builder = MapBuilder.builder();
    Events[] events = Events.values();
    int eventsLength = events.length;

    for(int i = 0; i < eventsLength; ++i) {
      Events event = events[i];
      builder.put(event.toString(), MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", event.toString())));
    }

    return builder.build();
  }

  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    Log.d(TAG, "getCommandsMap: ");
    return MapBuilder.of(
      "pause",
      COMMAND_PAUSE,
      "replay",
      COMMAND_REPLAY,
      "createPlayer",
      COMMAND_CREATE_PLAYER,
      "releasePlayer",
      COMMAND_RELEASE
    );
  }

  @Override
  public void receiveCommand(@NonNull Ezview root, int commandId, @Nullable ReadableArray args) {
    Log.d(TAG, "receiveCommand: " + commandId);
    Assertions.assertNotNull(root);
    Assertions.assertNotNull(args);
    switch (commandId) {
      case COMMAND_PAUSE:
        root.pause();
        return;
      case COMMAND_REPLAY:
        root.rePlay();
        return;
      case COMMAND_CREATE_PLAYER:
        if(root.getmDeviceSerial() != null && root.getmVerifyCode() != null) {
          root.createPlayer();
        }
        return;
      case COMMAND_RELEASE:
        root.releasePlayer();
        return;
      default:
        throw new IllegalArgumentException(String.format(
          "Unsupported command %d received by %s.",
          commandId,
          getClass().getSimpleName()));
    }
  }

  @ReactProp(name = "deviceSerial")
  public void setDeviceSerial(Ezview view, String deviceSerial) {
    view.setDeviceSerial(deviceSerial);
  }

  @ReactProp(name = "cameraNo")
  public void setCameraNo(Ezview view, int cameraNo) {
    view.setCameraNo(cameraNo);
  }

  @ReactProp(name = "verifyCode")
  public void setVerifyCode(Ezview view, String verifyCode) {
    view.setVerifyCode(verifyCode);
  }

  @Override
  protected void onAfterUpdateTransaction(@NonNull Ezview view) {
    super.onAfterUpdateTransaction(view);
    view.emitEventToJS(Events.EVENT_LOAD.toString(), null);
    Log.d(TAG, "onAfterUpdateTransaction: ");
  }
}
