# 230220_DarkVision
SOCにありそうなネットワーク通信を可視化するシステム

制作中

# buildや開発環境構築
## 開発環境の構築
1. コンテナの作成
  ```
  docker-compose up -d
  ```

### クライアント側
2. コンテナ内のシェルへ
  ```
  docker exec -it dev-dark-vision-node bash
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
  docker exec -it dev-dark-vision-go bash
  ```

4. 開発環境の起動
  ```
  air -c .air.toml
  ```

※ホットリロード効くと思いますが、効かなかった場合、airをいちいち止めて起動する必要があります。