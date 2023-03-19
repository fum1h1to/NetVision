# 230220_NetVision
ネットワークの通信をリアルタイムに可視化するシステム

制作中

現在こんな感じ
![image-01](https://github.com/fum1h1to/230220_NetVision/blob/readme-images/md_images/image-01.png?raw=true)

# buildや開発環境構築
## build
1. コマンドの実行
  ```
  ./build.sh
  ```

※VSCodeで開発している場合、Ctrl + Shift + Bでも実行可能

## 開発環境の構築
1. コンテナの作成
  ```
  docker-compose up -d
  ```

### クライアント側
2. コンテナ内のシェルへ
  ```
  docker exec -it dev-net-vision-node bash
  ```

3. 開発環境の起動
  ```
  yarn dev --host
  ```

### バックエンド側
2. ```back/dev```を作成し開発に必要なファイルなどを追加
  - GeoLite2のデータベース
  - AbuseIPDBのAPI Key
  - config.yaml（config_example.yamlからコピーなどして用意）
  - dev/html/data/配下にserver.jsonというファイルを作成

3. コンテナ内のシェルへ
  ```
  docker exec -it dev-net-vision-go bash
  ```

4. 開発環境の起動
  ```
  air -c .air.toml
  ```

※ホットリロード効くと思いますが、効かなかった場合、airをいちいち止めて起動する必要があります。