import axios from 'axios';

export const BASE_URL = 'http://192.168.199.198:6480/ys/';

export const fetch = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export function getAccessToken() {
  return fetch({
    url: `/accessToken`,
    method: 'get',
  }).then((res) => {
    if (res && res.data && res.data.data) {
      let data: any = res.data.data;
      let { accessToken } = data;
      return accessToken;
    }
  });
}

export type BindDevice = {
  addTime: number;
  defence: 0 | 1;
  deviceName: string;
  deviceSerial: string;
  deviceType: string;
  deviceVersion: string;
  id: string;
  parentCategory: string;
  status: 0 | 1;
  updateTime: number;
};

export function getDeveloperBindDeviceList(data: {
  accessToken: string;
  pageStart?: number;
  pageSize?: number;
}): Promise<Array<BindDevice>> {
  return axios({
    url: `https://open.ys7.com/api/lapp/device/list`,
    method: 'post',
    params: data,
  }).then((res) => {
    return res.data && res.data.data;
  });
}

export type DeviceInfo = {
  deviceSerial: string;
  deviceName: string;
  model: string;
  status: 0 | 1;
  defence: 0 | 1;
  isEncrypt: 0 | 1;
  alarmSoundMode: 0 | 1 | 2;
  offlineNotify: 0 | 1;
  category: string;
  netType: 'wireless' | 'wire';
  signal: string;
};

export function getDeviceInfo(data: {
  accessToken: string;
  deviceSerial: string;
}): Promise<DeviceInfo> {
  return axios({
    url: `https://open.ys7.com/api/lapp/device/info`,
    method: 'post',
    params: data,
  }).then((res) => {
    return res.data && res.data.data;
  });
}
