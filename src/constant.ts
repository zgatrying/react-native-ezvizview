/**
 * 用途：提供一些常量
 * created by bran on 2021/03/24
 */

/**
 * 云台移动方向
 */
export enum PTZ_POZITION {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3,

  LEFT_UP = 4,
  LEFT_DOWN = 5,
  RIGHT_UP = 6,
  RIGHT_DOWN = 7,

  TO_LARGER = 8,
  TO_SMALLER = 9,

  TO_CLOSER = 10,
  TO_FURTHER = 11,
}

/**
 * 云台移动速度
 */
export enum Speed {
  LOW = 0,
  MID = 1,
  FAST = 2,
}

/**
 * AI设备安防类型
 * SLEEP：睡眠
 * HOME：在家
 * OUT：外出
 */
export enum AIDefenceType {
  SLEEP = 0,
  HOME = 8,
  OUT = 16,
}

/**
 * IPC设备安防类型:
 * DISARM: 撤防
 * DEPLOY：布防
 */
export enum IPCDefenceType {
  DISARM = 0,
  DEPLOY = 1,
}

/**
 * 告警状态码
 */
export enum AlarmStatus {
  WAIT_FOR_READ = 0,
  READED = 1,
  TOTAL = 2,
}

/**
 * 启动播放器返回的错误码
 */
export enum ErrorCode {
  ERROR_TRANSF_ACCESSTOKEN_ERROR = 400902,
  ERROR_CAS_MSG_PU_NO_RESOURCE = 380045,
  ERROR_TRANSF_DEVICE_OFFLINE = 400901,
  ERROR_INNER_STREAM_TIMEOUT = 400034,
  ERROR_WEB_CODE_ERROR = 101011,
  ERROR_WEB_HARDWARE_SIGNATURE_OP_ERROR = 120005,
  ERROR_TRANSF_TERMINAL_BINDING = 400903,
  ERROR_EXTRA_SQUARE_NO_SHARING = 410034,
}

/**
 * 回放源：0-系统自动选择，1-云存储，2-本地录像。非必选，默认为0
 */
export enum RecType {
  DEFAULT = 0,
  CLOUND = 1,
  LOCAL = 2,
}

/**
 * 控制萤石播放器组件的命令：1-暂停播放，2-重新播放，3-创建播放器
 */
export enum EzvizPlayerControlCommand {
  PAUSE = 'pause', //暂停播放
  RESUME = 'resume', //继续播放
  REPLAY = 'replay', //重新播放
  CREATE_PLAYER = 'createPlayer', //创建EzPlayer
  RELEASE_PLAYER = 'releasePlayer', //释放EzPlayer
}
