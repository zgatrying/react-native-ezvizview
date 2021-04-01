# SDK 使用

## 登录授权

使用 openLoginPage()方法跳转到登录 H5 页,此页面可以登录萤石账号。

```
EZOpenSDK.getInstance().openLoginPage();
```

## 直播

步骤

1. 创建播放器 View
1. 创建播放器 player
1. 设置 handler 回调、显示区域、设备如果设置了视频加密，需要设置视频加密密码，默认为设备的 6 位验证码
1. 启动播放（当前 Activity 的 onResume 时）
1. 停止播放（当前 Activity 的 onStop 时）
1. 释放播放器（当前 Activity 的 onDestroy 时）

# HTTP 接口

## 接口变量说明

- deviceSerial：设备序列号
- cameraNo：通道号
- deviceSerial + cameraNo = 摄像头唯一标志
- verifyCode：设备验证码，默认用于加密视频的解码。
- channelNo：同 cameraNo

## 开始云台控制

说明：对设备进行开始云台控制，开始云台控制之后`必须先调用停止云台控制接口`才能进行其他操作，包括其他方向的云台转动

url：`https://open.ys7.com/api/lapp/device/ptz/start`

method: `POST`

Content-Type: `application/x-www-form-urlencoded`

query:

| 参数         | 类型   | 描述                                                                                                   | 是否必选 |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------ | -------- |
| accessToken  | String | 授权过程获取的 access_token                                                                            | Y        |
| deviceSerial | String | 设备序列号,存在英文字母的设备序列号，字母需为大写                                                      | Y        |
| channelNo    | int    | 通道号                                                                                                 | Y        |
| direction    | int    | 操作命令：0-上，1-下，2-左，3-右，4-左上，5-左下，6-右上，7-右下，8-放大，9-缩小，10-近焦距，11-远焦距 | Y        |
| speed        | int    | 云台速度：0-慢，1-适中，2-快，海康设备参数不可为 0                                                     | Y        |

## 停止云台控制

url：`https://open.ys7.com/api/lapp/device/ptz/stop`

method: `POST`

Content-Type: `application/x-www-form-urlencoded`

query:

| 参数         | 类型   | 描述                                                                                                   | 是否必选 |
| ------------ | ------ | ------------------------------------------------------------------------------------------------------ | -------- |
| accessToken  | String | 授权过程获取的 access_token                                                                            | Y        |
| deviceSerial | String | 设备序列号,存在英文字母的设备序列号，字母需为大写                                                      | Y        |
| channelNo    | int    | 通道号                                                                                                 | Y        |
| direction    | int    | 操作命令：0-上，1-下，2-左，3-右，4-左上，5-左下，6-右上，7-右下，8-放大，9-缩小，10-近焦距，11-远焦距 | N        |

> 提示：建议带方向参数。

## 获取播放地址（暂不实现）

url：`https://open.ys7.com/api/lapp/v2/live/address/get`

method: `POST`

Content-Type: `application/x-www-form-urlencoded`

query:

| 参数         | 类型    | 描述                                                                              | 是否必选 |
| ------------ | ------- | --------------------------------------------------------------------------------- | -------- |
| accessToken  | String  | 授权过程获取的 access_token                                                       | Y        |
| deviceSerial | String  | 直播源，例如 427734222，均采用英文符号，限制 50 个                                | Y        |
| channelNo    | Integer | 通道号,，非必选，默认为 1                                                         | N        |
| code         | String  | ezopen 协议地址的设备的视频加密密码                                               | N        |
| expireTime   | Integer | 过期时长，单位秒；针对 hls/rtmp 设置有效期，相对时间；30 秒-7 天                  | N        |
| protocol     | Integer | 流播放协议，1-ezopen、2-hls、3-rtmp，默认为 1                                     | N        |
| quality      | Integer | 视频清晰度，1-高清（主码流）、2-流畅（子码流）                                    | N        |
| startTime    | String  | ezopen 协议地址的本地录像/云存储录像回放开始时间,示例：2019-12-01 00:00:00        | N        |
| stopTime     | String  | ezopen 协议地址的本地录像/云存储录像回放开始时间,示例：2019-12-01 00:00:00        | N        |
| type         | String  | ezopen 协议地址的类型，1-预览，2-本地录像回放，3-云存储录像回放，非必选，默认为 1 | N        |

## 设备布撤防

url: `https://open.ys7.com/api/lapp/device/defence/set`

method：`POST`

Content-Type: `application/x-www-form-urlencoded`

query:

| 参数         | 类型   | 描述                                                                       | 是否必选 |
| ------------ | ------ | -------------------------------------------------------------------------- | -------- |
| accessToken  | String | 授权过程获取的 accessToken                                                 | Y        |
| deviceSerial | String | 网关设备序列号                                                             | Y        |
| isDefence    | int    | `具有防护能力设备`：0-睡眠，8-在家，16-外出，`普通IPC设备`：0-撤防，1-布防 | Y        |

## 获取所有告警消息列表

url：`https://open.ys7.com/api/lapp/alarm/list`

method: `POST`

Content-Type: `application/x-www-form-urlencoded`

query:

| 参数        | 类型   | 描述                                                                                                        | 是否必选 |
| ----------- | ------ | ----------------------------------------------------------------------------------------------------------- | -------- |
| accessToken | String | 授权过程获取的 access_token                                                                                 | Y        |
| startTime   | long   | 告警查询开始时间，时间格式为 1457420564508，精确到毫秒，默认为今日 0 点，最多查询当前时间 7 天前以内的数据  | N        |
| endTime     | long   | 告警查询结束时间，时间格式为 1457420771029，精确到毫秒，默认为当前时间                                      | N        |
| alarmType   | int    | 告警类型，默认为-1（全部）, [查看告警集合](http://open.ys7.com/doc/zh/book/index/alarmType.html#alarm_type) | N        |
| status      | int    | 告警消息状态：2-所有，1-已读，0-未读，默认为 0（未读状态）                                                  | N        |
| pageStart   | int    | 分页起始页，从 0 开始，默认为 0                                                                             | N        |
| pageSize    | int    | 分页大小，默认为 10，最大为 50                                                                              | N        |

## 按照设备获取告警消息列表

url：`https://open.ys7.com/api/lapp/alarm/device/list`

method: `POST`

Content-Type: `application/x-www-form-urlencoded`

query:

| 参数         | 类型   | 描述                                                                                                        | 是否必选 |
| ------------ | ------ | ----------------------------------------------------------------------------------------------------------- | -------- |
| accessToken  | String | 授权过程获取的 access_token                                                                                 | Y        |
| deviceSerial | String | 网关设备序列号                                                                                              | Y        |
| startTime    | long   | 告警查询开始时间，时间格式为 1457420564508，精确到毫秒，默认为今日 0 点，最多查询当前时间 7 天前以内的数据  | N        |
| endTime      | long   | 告警查询结束时间，时间格式为 1457420771029，精确到毫秒，默认为当前时间                                      | N        |
| alarmType    | int    | 告警类型，默认为-1（全部），[查看告警集合](http://open.ys7.com/doc/zh/book/index/alarmType.html#alarm_type) | N        |
| status       | int    | 告警消息状态：2-所有，1-已读，0-未读，默认为 0（未读状态）                                                  | N        |
| pageStart    | int    | 分页起始页，从 0 开始，默认为 0                                                                             | N        |
| pageSize     | int    | 分页大小，默认为 10，最大为 50                                                                              | N        |
