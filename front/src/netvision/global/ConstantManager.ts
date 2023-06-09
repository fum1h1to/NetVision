import { NetVisionCore } from "../core/NetVisionCore"
import { LatLng } from "../models/LatLng"

export class ConstantManager {
  private netVisionCore: NetVisionCore | null;

  // 何時間ごとにアプリケーションをリロードするか
  private APPLICATION_RELOAD_INTERVAL: number

  // FPSの最大値
  private MAX_FPS: number

  // 地球の半径
  private EARTH_RADIUS: number

  // 地球を回転させるかどうか
  private EARTH_ROTATE: boolean

  // WebSocketの再接続間隔（ms）
  private WEBSOCKET_RECONNECT_INTERVAL: number

  // クライアント側で扱えるパケットの最大数
  private GET_PACKET_LIMIT: number

  // パケットの目的地
  private PACKET_GOAL: LatLng

  // パケットの軌道の高さ
  private PACKET_ORBIT_HEIGHT: number

  // パケットが目的地まで到達する時間
  private PACKET_GOAL_TIME: number

  // 一つのIPアドレスから一度に来るパケットの数をscaleで表現するときの最大値と、その時のpacketCountの大きさ
  // 例えば、MAX_SCALE_PACKET_COUNTが100、MAX_PACKET_SCALEが10の時、packetCountが50のものはscaleが5になる。
  private MAX_PACKET_SCALE: number
  private MAX_SCALE_PACKET_COUNT: number
  
  // デフォルトのパケットの色
  private DEFAULT_PACKET_COLOR: number

  // パケット出現場所に表示するオブジェクトがどの程度の割合で大きくなるか
  private FLOW_COUNTER_HEIGHT_RATE: number

  // パケット出現場所に表示するオブジェクトの最大高さ
  private FLOW_COUNTER_MAX_HEIGHT: number
  
  // パケット出現場所に表示するオブジェクトの色
  private DEFAULT_FLOW_COUNTER_COLOR: number

  // パケット出現場所に表示するオブジェクトをクリックした時の色
  private CLICKED_FLOW_COUNTER_COLOR: number

  // AbuseIPDBを使用するかどうか
  private IS_ABUSEIPDB_USE: boolean
  
  // AbuseIPDBに登録されているIPアドレスの色
  private ABUSEIPDB_IP_COLOR: number

  // SpamhausのDROPリストに登録されているIPアドレスの色
  private SPAMHAUS_IP_COLOR: number

  // www.blocklist.deに登録されているIPアドレスの色
  private BLOCKLIST_DE_IP_COLOR: number

  // AbuseIPからのパケットのConfidenceScoreがどの程度だったら色を変えるか（0~100）
  private THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE: number

  private delta: number;

  constructor() {
    // デフォルト値の設定
    this.APPLICATION_RELOAD_INTERVAL = 24;
    this.MAX_FPS = 60;
    this.EARTH_RADIUS = 8;
    this.EARTH_ROTATE = false;
    this.WEBSOCKET_RECONNECT_INTERVAL = 10000;
    this.GET_PACKET_LIMIT = 300;
    this.PACKET_GOAL = { lat: 35, lng: 140 };
    this.PACKET_ORBIT_HEIGHT = 3;
    this.PACKET_GOAL_TIME = 5;
    this.MAX_PACKET_SCALE = 5;
    this.MAX_SCALE_PACKET_COUNT = 100;
    this.DEFAULT_PACKET_COLOR = 0x00ff00;
    this.FLOW_COUNTER_HEIGHT_RATE = .01;
    this.FLOW_COUNTER_MAX_HEIGHT = 5;
    this.DEFAULT_FLOW_COUNTER_COLOR = 0x0000ff;
    this.CLICKED_FLOW_COUNTER_COLOR = 0x00ff00;
    this.IS_ABUSEIPDB_USE = false;
    this.ABUSEIPDB_IP_COLOR = 0xff0000;
    this.SPAMHAUS_IP_COLOR = 0x800080;
    this.BLOCKLIST_DE_IP_COLOR = 0xffff00;
    this.THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE = 50;

    this.delta = 0;
  }

  public async init() {
    // setting.jsonから設定値を取得
    await fetch("/data/setting.json")
    .then((response) => response.json()).then((data) => {
      this.APPLICATION_RELOAD_INTERVAL = data.APPLICATION_RELOAD_INTERVAL
      this.MAX_FPS = data.MAX_FPS
      this.EARTH_RADIUS = data.EARTH_RADIUS
      this.EARTH_ROTATE = data.EARTH_ROTATE
      this.WEBSOCKET_RECONNECT_INTERVAL = data.WEBSOCKET_RECONNECT_INTERVAL
      this.GET_PACKET_LIMIT = data.GET_PACKET_LIMIT
      this.PACKET_GOAL = data.PACKET_GOAL
      this.PACKET_ORBIT_HEIGHT = data.PACKET_ORBIT_HEIGHT
      this.PACKET_GOAL_TIME = data.PACKET_GOAL_TIME
      this.MAX_PACKET_SCALE = data.MAX_PACKET_SCALE
      this.MAX_SCALE_PACKET_COUNT = data.MAX_SCALE_PACKET_COUNT
      this.DEFAULT_PACKET_COLOR = Number(data.DEFAULT_PACKET_COLOR)
      this.FLOW_COUNTER_HEIGHT_RATE = data.FLOW_COUNTER_HEIGHT_RATE
      this.FLOW_COUNTER_MAX_HEIGHT = data.FLOW_COUNTER_MAX_HEIGHT
      this.DEFAULT_FLOW_COUNTER_COLOR = Number(data.DEFAULT_FLOW_COUNTER_COLOR)
      this.CLICKED_FLOW_COUNTER_COLOR = Number(data.CLICKED_FLOW_COUNTER_COLOR)
      this.IS_ABUSEIPDB_USE = data.IS_ABUSEIPDB_USE
      this.ABUSEIPDB_IP_COLOR = Number(data.ABUSEIPDB_IP_COLOR)
      this.SPAMHAUS_IP_COLOR = Number(data.SPAMHAUS_IP_COLOR)
      this.BLOCKLIST_DE_IP_COLOR = Number(data.BLOCKLIST_DE_IP_COLOR)
      this.THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE = data.THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE

    })
    .catch((error) => {
      console.log(error);
    });
  }

  public setNetVisionCore(netVisionCore: NetVisionCore) {
    this.netVisionCore = netVisionCore;
  }
  
  public getAPPLICATION_RELOAD_INTERVAL(): number {
    return this.APPLICATION_RELOAD_INTERVAL;
  }

  public getMAX_FPS(): number {
    return this.MAX_FPS;
  }

  public getEARTH_RADIUS(): number {
    return this.EARTH_RADIUS;
  }

  public getEARTH_ROTATE(): boolean {
    return this.EARTH_ROTATE;
  }

  public setEARTH_ROTATE(EARTH_ROTATE: boolean) {
    this.netVisionCore?.setEarthRotate(EARTH_ROTATE);
    this.EARTH_ROTATE = EARTH_ROTATE;
  }

  public getWEBSOCKET_RECONNECT_INTERVAL(): number {
    return this.WEBSOCKET_RECONNECT_INTERVAL;
  }

  public getGET_PACKET_LIMIT(): number {
    return this.GET_PACKET_LIMIT;
  }

  public setPACKET_GOAL(PACKET_GOAL: LatLng) {
    this.PACKET_GOAL = PACKET_GOAL;
  }

  public getPACKET_GOAL():LatLng {
    return this.PACKET_GOAL;
  }

  public getPACKET_ORBIT_HEIGHT(): number {
    return this.PACKET_ORBIT_HEIGHT;
  }

  public getPACKET_GOAL_TIME(): number {
    return this.PACKET_GOAL_TIME;
  }

  public getMAX_PACKET_SCALE(): number {
    return this.MAX_PACKET_SCALE;
  }

  public getMAX_SCALE_PACKET_COUNT(): number {
    return this.MAX_SCALE_PACKET_COUNT;
  }

  public getDEFAULT_PACKET_COLOR(): number {
    return this.DEFAULT_PACKET_COLOR;
  }

  public getFLOW_COUNTER_HEIGHT_RATE(): number {
    return this.FLOW_COUNTER_HEIGHT_RATE;
  }

  public getFLOW_COUNTER_MAX_HEIGHT(): number {
    return this.FLOW_COUNTER_MAX_HEIGHT;
  }

  public getDEFAULT_FLOW_COUNTER_COLOR(): number {
    return this.DEFAULT_FLOW_COUNTER_COLOR;
  }

  public getCLICKED_FLOW_COUNTER_COLOR(): number {
    return this.CLICKED_FLOW_COUNTER_COLOR;
  }

  public getIS_ABUSEIPDB_USE(): boolean {
    return this.IS_ABUSEIPDB_USE;
  }

  public getABUSEIPDB_IP_COLOR(): number {
    return this.ABUSEIPDB_IP_COLOR;
  }

  public getSPAMHAUS_IP_COLOR(): number {
    return this.SPAMHAUS_IP_COLOR;
  }

  public getBLOCKLIST_DE_IP_COLOR(): number {
    return this.BLOCKLIST_DE_IP_COLOR;
  }

  public getTHRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE(): number {
    return this.THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE;
  }


  public setDelta(delta: number) {
    this.delta = delta;
  }
  public getDelta(): number {
    return this.delta;
  }

}