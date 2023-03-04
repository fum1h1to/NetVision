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
export const GET_PACKET_LIMIT: number = 500;

// パケットの目的地
export const PACKET_GOAL: LatLng = { lat: 35, lng: 140 };

// パケットの軌道の高さ
export const PACKET_ORBIT_HEIGHT: number = 3;

// パケットが目的地まで到達する時間
export const PACKET_GOAL_TIME: number = 4;