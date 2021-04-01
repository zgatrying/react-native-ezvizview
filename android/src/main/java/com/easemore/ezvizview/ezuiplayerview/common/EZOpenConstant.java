package com.easemore.ezvizview.ezuiplayerview.common;

/**
 * Description:
 * Created by dingwei3
 *
 * @date : 2016/12/26
 */
public class EZOpenConstant {
    public static final String EXTRA_DEVICE_SERIAL = "DeviceSerial";
    public static final String EXTRA_CAMERA_NO = "CameraNo";
    public static final String EXTRA_POSITION = "position";
    public static final String EXTRA_MODIFY_NAME = "name";
    public static final String EXTRA_MODIFY_NAME_TYPE = "modify_name_type";
    public static final String EXTRA_DEVICE_VERSION_DES = "device_version_des";
    public static final String EXTRA_DEVICE_VERIFYCODE= "device_verifycode ";
    public static final String EXTRA_DEVICE_TYPE = "device_type";
    public static final String EXTRA_WIFI_PASSWORD = "WiFi_password";
    public static final String EXTRA_WIFI_SSID = "WiFi_ssid";
    public static final String EXTRA_SUPPORT_NETWORK = "support_network";
    public static final String EXTRA_SUPPORT_WIFI = "support_WiFi";
    public static final String EXTRA_DEVICE_ADDED = "device_added";
    public static final String EXTRA_FROM_PAGE = "from_page";


    public static final int HTTP_RESUILT_OK = 200;

    /**
     * 设备在线状态
     */
    public static final int DEVICE_ONLINE = 1;
    /**
     * 设备离线状态
     */
    public static final int DEVICE_OFFLINE = 2;

    /**
     * 流畅
     */
    public static final int VIDEO_LEVEL_FLUNET = 0;
    /**
     * 均衡
     */
    public static final int VIDEO_LEVEL_BALANCED = 1;
    /**
     * 高清
     */
    public static final int VIDEO_LEVEL_HD = 2;

    /**
     *  云存储状态
     */
    public class CloudStorageStatus {
        /**
         * 设备不支持云存储
         */
        public static final int DEVICE_NO_SUPPORT_CLOUD_STORAGE = -2;
        /**
         * 设备未开通云存储
         */
        public static final int DEVICE_NOT_THROUGH_THE_CLOUD_STORAGE = -1;

        /**
         * 设备未激活云存储
         */
        public static final int DEVICE_NOT_ACTIVATING_CLOUD_STORAGE = 0;

        /**
         * 设备激活云存储
         */
        public static final int DEVICE_ACTIVATING_CLOUD_STORAGE = 1;

        /**
         * 设备云存储已过期
         */
        public static final int DEVICE_CLOUD_STORAGE_EXPIRED = 2;

    }
}
