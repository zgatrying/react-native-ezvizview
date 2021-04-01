/**
 * 用途：提供工具方法给EzvizView组件或原生模块使用
 * created by bran on 2021/03/24
 */

import { ErrorCode } from '../constant';

/**
 * 根据播放器返回的错误码返回提示用的文本。
 * @param errorCode 播放器返回的错误码
 * @returns text
 */
export function getHintByErrorCodeType(errorCode: ErrorCode) {
  let text: string = '';
  switch (errorCode) {
    case ErrorCode.ERROR_TRANSF_ACCESSTOKEN_ERROR:
      text = 'token已失效，请重新登录';
      break;
    case ErrorCode.ERROR_CAS_MSG_PU_NO_RESOURCE:
      text = '设备连接数过大，停止其他连接后再试试吧';
      break;
    case ErrorCode.ERROR_TRANSF_DEVICE_OFFLINE:
      text = '设备不在线';
      break;
    case ErrorCode.ERROR_INNER_STREAM_TIMEOUT:
      text = '播放失败，连接设备异常';
      break;
    case ErrorCode.ERROR_TRANSF_TERMINAL_BINDING:
      text = '请在萤石客户端关闭终端绑定';
      break;
    case ErrorCode.ERROR_WEB_CODE_ERROR:
    case ErrorCode.ERROR_WEB_HARDWARE_SIGNATURE_OP_ERROR:
    case ErrorCode.ERROR_EXTRA_SQUARE_NO_SHARING:
    default:
      text = '视频播放失败';
      break;
  }
  return text;
}

/**
 * 将ArrayBuffer转换成Array
 * @param arrayBuffer
 * @returns Array
 */
export function arrayBufferToArray(arrayBuffer: ArrayBuffer): Array<number> {
  return Array.prototype.slice.call(new Uint8Array(arrayBuffer));
}

/**
 * 将ArrayBuffer转换成Base64字符串
 * @param arrayBuffer
 * @returns String
 */
export function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  var base64 = '';
  var encodings =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  var bytes = new Uint8Array(arrayBuffer);
  var byteLength = bytes.byteLength;
  var byteRemainder = byteLength % 3;
  var mainLength = byteLength - byteRemainder;

  var a, b, c, d;
  var chunk;

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
    d = chunk & 63; // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];

    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4; // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '==';
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2; // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }

  return base64;
}
