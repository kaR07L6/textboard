# Textboard

簡易掲示板

## 特徴

- 複数の板に対応
- スレッド作成機能
- レス投稿機能
- 名前欄は省略可能(デフォルト: 名無しさん)
- タイムスタンプ付き投稿
- ブラウザのlocalStorageでデータを保存

## 使い方

1. `index.html`をブラウザで開く
2. 板一覧から板を選択
3. スレッドを作成するか、既存のスレッドを開く
4. レスを投稿

## 技術スタック

- React 18
- Vanilla JavaScript
- localStorage (データ永続化)
- インラインCSS

## ライセンス

MIT License

## 注意事項

このプロジェクトは教育目的で作成されたものです。商用利用する場合は適切なバックエンドシステムとセキュリティ対策を実装してください。
```

## 3. .gitignore
```
# Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Logs
*.log
npm-debug.log*
```

## 4. LICENSE
```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.