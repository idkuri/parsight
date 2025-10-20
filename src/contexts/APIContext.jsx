import axios from 'axios';
import platform from 'platform';

const isDev = process.env.NODE_ENV === 'development';
const host = isDev ? 'http://localhost:5000' : 'https://parsight.gnostora.ai/api'
 const deviceInfo = `${platform.name} ${platform.version} on ${platform.os}`;

export const ParsightAPI = axios.create({
  baseURL: host,
  withCredentials: true,
  headers: {
    'X-Device-Info': deviceInfo
  }
});