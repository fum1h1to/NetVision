import { LatLng } from "./models/LatLng";

// FPSの最大値
export const MAX_FPS: number = 60;

// 地球の半径
export const EARTH_RADIUS: number = 8;

// WebSocketの再接続間隔
export const WEBSOCKET_RECONNECT_INTERVAL: number = 10000; //ms

// クライアント側で扱えるパケットの最大数
export const GET_PACKET_LIMIT: number = 300;

// パケットの目的地
export const PACKET_GOAL: LatLng = { lat: 35, lng: 140 };

// パケットの軌道の高さ
export const PACKET_ORBIT_HEIGHT: number = 3;

// パケットが目的地まで到達する時間
export const PACKET_GOAL_TIME: number = 5;

// 一つのIPアドレスから一度に来るパケットの数をscaleで表現するときの最大値と、その時のpacketCountの大きさ
// 例えば、MAX_SCALE_PACKET_COUNTが100、MAX_PACKET_SCALEが10の時、packetCountが50のものはscaleが5になる。
export const MAX_PACKET_SCALE: number = 5;
export const MAX_SCALE_PACKET_COUNT: number = 100;

// デフォルトのパケットの色
export const DEFAULT_PACKET_COLOR: number = 0xffff00;

// パケット出現場所に表示するオブジェクトがどの程度の割合で大きくなるか
export const FLOW_COUNTER_HEIGHT_RATE: number = .01;

// パケット出現場所に表示するオブジェクトの最大高さ
export const FLOW_COUNTER_MAX_HEIGHT: number = 5;

// パケット出現場所に表示するオブジェクトの色
export const DEFAULT_FLOW_COUNTER_COLOR: number = 0x0000ff;

// AbuseIPDBに登録されているIPアドレスの色
export const ABUSEIPDB_IP_COLOR: number = 0xff0000;

// AbuseIPからのパケットのConfidenceScoreがどの程度だったら色を変えるか（0~100）
export const THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE: number = 50;