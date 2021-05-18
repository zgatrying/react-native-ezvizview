/**
 * 用途：提供萤石原生能力
 * created by bran on 2021/03/23
 */

import axios from 'axios';
import { NativeModules, NativeEventEmitter } from 'react-native';
import qs from 'qs';

export const RNEzvizview = NativeModules.RNEzvizview;

export const RNEzvizviewEmitter = new NativeEventEmitter(RNEzvizview);

export type SupportNativeEventName = '';

export function addEventListener(
  eventName: SupportNativeEventName,
  listener: (...args: any[]) => any
) {
  return RNEzvizviewEmitter.addListener(eventName, listener);
}

/**
 * 从萤石sdk获取AccessToken，适用于从SDK的登录H5页面获取AccessToken的方式。
 * @returns accessToken: token值, expire: 过期时间，毫秒
 */
export function setEzAccessToken(accessToken: string) {
  RNEzvizview.setAccessToken(accessToken);
}

export async function decryptUrl(encryptUrl: string, verifyCode: string) {
  let urlObj = qs.parse(encryptUrl);
  if (urlObj.isEncrypted && urlObj.isEncrypted === '1') {
    let response = await axios.get(encryptUrl, {
      responseType: 'arraybuffer',
    });
    let arrayBuffer = response.data;
    let array = Array.prototype.slice.call(new Uint8Array(arrayBuffer));
    let result = await RNEzvizview.decryptData(array, verifyCode);
    let base64ImageUrl = `data:image/png;base64, ${result}`;
    return base64ImageUrl;
  } else {
    return encryptUrl;
  }
}

/**
 * 设备配网
 * @param deviceSerial
 * @param deviceType
 * @param validateCode
 * @param wifiSSID
 * @param wifiPassword
 * @returns
 */
export function configWifi(
  deviceSerial: string,
  deviceType: string,
  validateCode: string,
  wifiSSID: string,
  wifiPassword: string
) {
  return RNEzvizview.configWifi(
    deviceSerial,
    deviceType,
    validateCode,
    wifiSSID,
    wifiPassword
  );
}

/**
 * 停止设备配网
 */
export function stopConfigWifi() {
  RNEzvizview.stopConfigWifi();
}

/**
 * 查询设备是否已添加，是否需要配网
 * @returns
 */
export async function probeDeviceInfo(
  deviceSerial: string,
  deviceType: string
): Promise<{
  message: string;
  isAbleToAdd: boolean;
  isNeedToConfigWifi: boolean;
}> {
  let res = await RNEzvizview.probeDeviceInfo(deviceSerial, deviceType);
  console.log('查询结果', res);
  return res;
}
