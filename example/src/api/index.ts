import axios from 'axios';

export const BASE_URL = 'http://192.168.199.161:6480/ys/';

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
