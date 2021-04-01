package com.easemore.ezvizview.ezuiplayerview.view.widget;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Point;
import android.util.AttributeSet;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.easemore.ezvizview.ezuiplayerview.utils.EZLog;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Description:
 * Created by dingwei3
 *
 * @date : 2017/2/7
 */
public class EZUIPlayerView extends RelativeLayout {
    private static final String TAG = "EzUIPlayer";
    private Context mContext;
    private SurfaceView mSurfaceView;
    private SurfaceHolder.Callback mCallback;


    public EZUIPlayerView(Context context) {
        super(context);
        mContext = context;
        initSurfaceView();
    }


    public EZUIPlayerView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mContext = context;
        initSurfaceView();
    }

    public EZUIPlayerView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        mContext = context;
        initSurfaceView();
    }

    private void initSurfaceView(){
        if (mSurfaceView == null) {
            mSurfaceView = new SurfaceView(mContext);
            LayoutParams lp = new LayoutParams(
                    LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
            lp.addRule(RelativeLayout.CENTER_IN_PARENT);
            mSurfaceView.setLayoutParams(lp);
            addView(mSurfaceView);
        }
    }


    public SurfaceView getSurfaceView() {
        return mSurfaceView;
    }

    public void setSurfaceHolderCallback(SurfaceHolder.Callback callback){
        if (callback != null) {
            this.mCallback = callback;
            if (mSurfaceView != null) {
                mSurfaceView.getHolder().addCallback(callback);
            }
        }
    }
}


