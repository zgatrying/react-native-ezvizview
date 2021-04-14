/**
 * 用途：提供萤石原生能力
 * created by bran on 2021/03/23
 */

import axios from 'axios';
import { NativeModules } from 'react-native';
import type { EzAccessTokenRes, EzvizInfo } from './types';
import qs from 'qs';

export const RNEzvizview = NativeModules.RNEzvizview;

/**
 * 缓存从sdk获取到的信息
 */
export const ezvizInfo: EzvizInfo = {
  hasInit: false,
  accessToken: '',
  expire: undefined,
};

/**
 * 从萤石sdk获取AccessToken，适用于从SDK的登录H5页面获取AccessToken的方式。
 * @returns accessToken: token值, expire: 过期时间，毫秒
 */
export async function getEzAccessToken(): Promise<EzAccessTokenRes> {
  const NOW: number = new Date().getTime();
  const EXPIRED: boolean = ezvizInfo.expire ? NOW - ezvizInfo.expire > 0 : true;
  if (EXPIRED) {
    let res = await RNEzvizview.getAccessToken();
    console.log('getEzAccessToken', res);
    return res;
  } else {
    return {
      accessToken: ezvizInfo.accessToken,
      expire: ezvizInfo.expire,
    };
  }
}

/**
 * 弃用，改成在application初始化的时候使用！
 * 初始化SDK配置，在使用EzvizView组件前必须执行该方法
 * @param appKey 在萤石开发平台 -》 我的账号 -》 应用信息查看
 * @param debug 是否打印log信息
 */
export async function initSDK(appKey: string, debug: boolean = false) {
  if (ezvizInfo.hasInit) {
    console.log('不需要重复初始化sdk');
  } else {
    await RNEzvizview.initSDK(debug, appKey);
    ezvizInfo.hasInit = true;
  }
}

/**
 * 打开授权登录中间页面,用于获取Accesstoken
 */
export function openLoginPage() {
  RNEzvizview.openLoginPage();
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
