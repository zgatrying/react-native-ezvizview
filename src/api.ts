/**
 * 用途：萤石开放的Http请求
 * created by bran on 2021/03/25
 */

import axios, { AxiosPromise } from 'axios';
import type {
  DefenceRequest,
  DeviceAlarmListResponse,
  GetAlarmListRequest,
  GetDeviceAlarmListRequest,
  GetRecordFileRequest,
  PTZStartRequest,
  PTZStopRequest,
} from './ys_api';

export const BASE_URL = 'https://open.ys7.com/api/lapp';

export const fetch = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export function setPTZ(data: PTZStartRequest) {
  return fetch({
    url: '/device/ptz/start',
    method: 'POST',
    params: data,
  });
}

export function stopPTZ(data: PTZStopRequest) {
  return fetch({
    url: '/device/ptz/stop',
    method: 'POST',
    params: data,
  });
}

export function setDefence(data: DefenceRequest) {
  return fetch({
    url: '/device/defence/set',
    method: 'POST',
    params: data,
  });
}

export function getAlarmList(data: GetAlarmListRequest) {
  return fetch({
    url: '/alarm/list',
    method: 'POST',
    params: data,
  });
}

export function getDeviceAlarmList(
  data: GetDeviceAlarmListRequest
): AxiosPromise<DeviceAlarmListResponse> {
  return fetch({
    url: '/alarm/device/list',
    method: 'POST',
    params: data,
  });
}

export function getRecordFileByTime(data: GetRecordFileRequest) {
  return fetch({
    url: '/video/by/time',
    method: 'POST',
    params: data,
  });
}
