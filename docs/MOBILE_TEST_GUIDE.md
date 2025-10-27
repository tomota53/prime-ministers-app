# モバイルエミュレータでの動作確認ガイド

## 方法1: Chrome DevToolsのデバイスモード（推奨・最も簡単）

### 手順
1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```
   → `http://localhost:5173` でアプリが起動します

2. **Chromeブラウザで開く**
   - `http://localhost:5173` をChromeで開く

3. **DevToolsを開く**
   - Mac: `Cmd + Option + I`
   - Windows/Linux: `F12` または `Ctrl + Shift + I`

4. **デバイスモードに切り替え**
   - DevToolsの左上にあるスマホアイコン📱をクリック
   - または `Cmd + Shift + M` (Mac) / `Ctrl + Shift + M` (Windows)

5. **デバイスを選択**
   - 上部のドロップダウンから選択:
     - iPhone 14 Pro Max
     - iPhone SE
     - Pixel 7
     - iPad Air
     - など

6. **PWA機能をテスト**
   - DevToolsの「Application」タブ
   - 左サイドバーの「Manifest」でマニフェストファイルを確認
   - 左サイドバーの「Service Workers」でSWの状態を確認

### スクリーンショット機能
- DevToolsの3点メニュー → 「Capture screenshot」でスマホ画面をキャプチャ可能

---

## 方法2: Safari（iOS端末エミュレーション）

### 手順
1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

2. **Safariで開く**
   - `http://localhost:5173` をSafariで開く

3. **Webインスペクタを開く**
   - Safari → 環境設定 → 詳細 → 「メニューバーに"開発"メニューを表示」にチェック
   - 開発 → レスポンシブデザインモードに入る
   - または `Cmd + Option + R`

4. **デバイスを選択**
   - iPhone 14 Pro
   - iPhone SE
   - iPad
   - など

---

## 方法3: 実機でテスト（最も正確）

### 同じWi-Fiに接続している場合

1. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

2. **ローカルIPアドレスを確認**
   - Mac: システム環境設定 → ネットワーク
   - Windows: `ipconfig` コマンド
   - 例: `192.168.1.100`

3. **スマホのブラウザでアクセス**
   - `http://[あなたのIPアドレス]:5173`
   - 例: `http://192.168.1.100:5173`

### Viteの設定で簡単にする方法
package.jsonの`dev`スクリプトを変更:
```json
{
  "scripts": {
    "dev": "vite --host"
  }
}
```

起動すると、以下のように表示されます:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

---

## 方法4: Android Studio（Android実機エミュレータ）

### 前提条件
- Android Studioがインストールされていること

### 手順
1. **Android Studioを起動**
2. **AVD Manager（Android Virtual Device）を開く**
   - Tools → Device Manager
3. **エミュレータを作成/起動**
   - 「Create Device」または既存のデバイスを起動
   - 推奨: Pixel 5 (Android 12以上)
4. **エミュレータのブラウザでアクセス**
   - `http://10.0.2.2:5173`
   - （10.0.2.2はホストマシンのlocalhostを指す特別なIP）

---

## 方法5: Xcode Simulator（iOS）

### 前提条件
- Xcode（Mac限定）

### 手順
1. **Xcodeを起動**
2. **Simulator を開く**
   - Xcode → Open Developer Tool → Simulator
3. **デバイスを選択**
   - File → Open Simulator → iPhone 14 Pro など
4. **Safariを開いてアクセス**
   - `http://localhost:5173`

---

## PWA機能の確認方法

### Service Workerの確認

#### Chrome DevTools
1. DevToolsの「Application」タブを開く
2. 左サイドバー「Service Workers」をクリック
3. Service Workerの状態を確認:
   - 🟢 Activated and running → 正常動作中
   - Status: キャッシュの状態

#### Firefoxの場合
1. DevToolsの「Storage」タブ
2. Service Workersセクションで確認

### マニフェストの確認

#### Chrome DevTools
1. 「Application」タブ
2. 「Manifest」セクション
3. アプリ名、アイコン、テーマカラーなどを確認

### インストール可能性のテスト

#### Chrome（デスクトップ）
1. アドレスバー右端に「インストール」アイコンが表示される
2. クリックしてインストール可能

#### iOS Safari（実機）
1. 共有ボタン（□↑）をタップ
2. 「ホーム画面に追加」を選択
3. ホーム画面にアプリアイコンが追加される

#### Android Chrome（実機）
1. メニュー（⋮）→「アプリをインストール」
2. ホーム画面にアプリが追加される

---

## オフライン動作のテスト

### Chrome DevTools
1. 「Network」タブを開く
2. 「Throttling」ドロップダウンで「Offline」を選択
3. ページをリロード
4. キャッシュされたコンテンツが表示されることを確認

---

## LocalStorageの確認

### Chrome DevTools
1. 「Application」タブ
2. 左サイドバー「Storage」→「Local Storage」
3. `http://localhost:5173`を展開
4. 保存されているデータを確認:
   - `learnedPrimeMinisterIds`: 学習済み首相ID
   - `quizHistory`: クイズ履歴
   - `studyStreak`: 連続学習日数
   - `dailyPMDate`: 今日の首相の日付

---

## トラブルシューティング

### Service Workerが登録されない
- Chromeでは`localhost`または`https`でないと動作しない
- コンソールにエラーが出ていないか確認
- ハードリロード: `Cmd + Shift + R` (Mac) / `Ctrl + Shift + R` (Windows)

### キャッシュが更新されない
1. DevTools → Application → Service Workers
2. 「Update on reload」にチェック
3. 「Unregister」でService Workerを削除
4. ページをリロード

### スマホで表示が崩れる
- DevToolsでレスポンシブモードの画面サイズを調整
- viewport設定を確認（index.htmlに記載済み）

---

## パフォーマンステスト

### Lighthouse（Chrome）
1. DevToolsの「Lighthouse」タブ
2. デバイス: Mobile
3. カテゴリー: Performance, Accessibility, Best Practices, PWA
4. 「Analyze page load」をクリック
5. スコアを確認:
   - PWA: ✅ Installable
   - Performance: 目標90以上
   - Accessibility: 目標90以上

---

## 推奨テストフロー

1. **Chrome DevToolsで基本動作確認** （5分）
   - デバイスモードでUI確認
   - 各機能が動作するか確認

2. **PWA機能確認** （3分）
   - Service Worker登録確認
   - オフライン動作確認
   - LocalStorage確認

3. **実機テスト** （10分）
   - 同じWi-Fiでスマホからアクセス
   - タッチ操作の快適性確認
   - インストール機能確認

4. **Lighthouseでスコア確認** （2分）
   - PWA要件を満たしているか確認

---

## よくある質問

**Q: アイコンエラーが出る**
A: icon-192.pngとicon-512.pngが存在しないためです。実際のアイコン画像を作成するか、manifest.jsonのアイコン設定を一時的にコメントアウトしてください。

**Q: スマホで文字が小さい**
A: Tailwind CSSのレスポンシブクラスで調整済みですが、必要に応じて`text-base`や`text-lg`に変更可能です。

**Q: LocalStorageのデータをリセットしたい**
A: Chrome DevTools → Application → Local Storage → 右クリック → Clear

---

これで、様々な方法でモバイル表示を確認できます！
最も簡単なのは「方法1: Chrome DevToolsのデバイスモード」です。
