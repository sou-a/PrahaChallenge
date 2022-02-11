# 課題: 外部 API を活用してみよう

## Set up

```bash
npm install
```

## How to use

### 特定の言葉をツイートしたユーザーを 100 名抽出する

```bash
npx ts-node src/search-users-by-keyword.ts {keyword}
```

### 特定のユーザーをフォローしているユーザーを 100 名抽出する

```bash
npx ts-node src/get-followers-by-user.ts {userId}
```
