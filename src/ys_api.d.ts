/**
 * 用途：api请求的参数类型
 * created by bran on 2021/03/25
 */

import type { RecType } from './constant';
import {
  AIDefenceType,
  AlarmStatus,
  IPCDefenceType,
  PTZ_POZITION,
  Speed,
} from './index';
/**
 * 萤石api接口
 */
export type BaseRequest = {
  accessToken: string;
};

export type DeviceBaseRequest = BaseRequest & {
  deviceSerial: string;
};

export type ChannelBaseRequest = DeviceBaseRequest & {
  channelNo: number;
};

/**
 * 云台控制
 */

export type PTZStartRequest = DeviceBaseRequest & {
  channelNo: number;
  direction: PTZ_POZITION;
  speed: Speed;
};

export type PTZStopRequest = DeviceBaseRequest & {
  channelNo: number;
  direction?: PTZ_POZITION;
};

export type DefenceType = AIDefenceType | IPCDefenceType;

export type DefenceRequest = DeviceBaseRequest & {
  isDefence: DefenceType;
};

export type GetAlarmListRequest = BaseRequest & {
  startTime?: number;
  endTime?: number;
  alarmType?: number;
  status?: AlarmStatus;
  pageStart?: number;
  pageSize?: number;
};

export type GetDeviceAlarmListRequest = GetAlarmListRequest & {
  deviceSerial: string;
};

export type BaseResponse = {
  code: string;
  msg: string;
  page?: {
    total: number;
    page: number;
    size: 3;
  };
};

export type DeviceAlarmListResponse = BaseResponse & {
  data: Array<DeviceAlarmListItem>;
};

/**
 * 告警消息
 */
export type DeviceAlarmListItem = {
  alarmId: string;
  alarmName: string;
  alarmType: number;
  alarmTime: number;
  channelNo: number;
  isEncrypt: number;
  isChecked: number;
  recState: number;
  preTime: number;
  delayTime: number;
  deviceSerial: string;
  alarmPicUrl: string;
  relationAlarms: Array<any>;
  customerType: string;
  customerInfo: string;
};

/**
 * 获取回放列表
 */
export type GetRecordFileRequest = ChannelBaseRequest & {
  startTime: number;
  endTime: number;
  recType: RecType;
};
