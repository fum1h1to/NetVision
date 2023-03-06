import { LatLng } from "./models/LatLng";

// FPSの最大値
export const MAX_FPS: number = 60;

// 地球の半径
export const EARTH_RADIUS: number = 8;

// WebSocketのURL
export const WEBSOCKET_URL: string = "ws://localhost:8080/ws";

// WebSocketの再接続間隔
export const WEBSOCKET_RECONNECT_INTERVAL: number = 10000; //ms

// クライアント側で扱えるパケットの最大数
export const GET_PACKET_LIMIT: number = 300;

// パケットの目的地
export const PACKET_GOAL: LatLng = { lat: 35, lng: 140 };

// パケットの軌道の高さ
export const PACKET_ORBIT_HEIGHT: number = 3;

// パケットが目的地まで到達する時間
export const PACKET_GOAL_TIME: number = 4;

// 一つのIPアドレスから一度に来るパケットの数をscaleで表現するときの最大値と、その時のpacketCountの大きさ
// 例えば、MAX_SCALE_PACKET_COUNTが100、MAX_PACKET_SCALEが10の時、packetCountが50のものはscaleが5になる。
export const MAX_PACKET_SCALE: number = 5;
export const MAX_SCALE_PACKET_COUNT: number = 100;

// デフォルトのパケットの色
export const DEFAULT_PACKET_COLOR: number = 0xffff00;

// AbuseIPDBに登録されているIPアドレスの色
export const ABUSEIPDB_IP_COLOR: number = 0xff0000;

// AbuseIPからのパケットのConfidenceScoreがどの程度だったら色を変えるか（0~100）
export const THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE: number = 50;