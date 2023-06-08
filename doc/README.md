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
  - config.yaml（config_example.yamlからコピーなどして用意）
  - dev/html/data/配下にserver.jsonというファイルを作成

  必要であれば
  
  - AbuseIPDBのAPI Key

3. コンテナ内のシェルへ
  ```
  docker exec -it dev-net-vision-go bash
  ```

4. 開発環境の起動
  ```
  air -c .air.toml
  ```

※ホットリロード効くと思いますが、効かなかった場合、airをいちいち止めて起動する必要があります。