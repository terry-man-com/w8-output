# w8-output
HTML,CSS,DB,JavaScriptのアウトプット用リポジトリです。
<details>
<summary>gitのコミットの取り消しの取り消し方</summary>

### gitの復元について
---
#### 原因
- Sourcetreeの操作ミス
    - 一度commitした「add grid design」(グリッドデザインレイアウトを追加したもの)を「このコミットまで戻す」を選択してしまい、プロジェクトファイルの変更や追記が全て消えた。Cursorにもリンクしているため、エディタのファイルも全てプロジェクトを立ち上げた状態に戻ってしまった。
#### 追加要因
- ガチャガチャしてしまいさらによくわからない状態にした。
    - プロジェクト立ち上げ時、index.html,style.css,app.js,sanitize.cssを追加した状態で最初のコミット「first commit」を行った。それに対して、「コミット適用前まで戻す」操作やこれを無効にする操作を2回ほど、行ったのでさらにややこしくなってしまった。
---
#### 対応方法
- 期待値：gitを「add grid design」を追加した状態まで戻す。
1. コミット履歴の確認
    ```
    git reflog
    ```

    - すべての操作履歴を確認し、戻りたいコミット（例: add grid design）のSHA（コミットID）を特定。
1. 指定してコミットへのチェックアウト
    ```
    git checkout <コミットID>
    ```

    - 特定のコミット内容を確認するため、一時的にその状態に切り替え。
    - ローカルでのみ変更前のファイルが復元される。
        - 「detached HEAD（分離状態）」に切り替わる
        ファイル状態がそのコミットが指す状態にローカルで切り替わる。  
        （自分の場合はCursorのファイルが「add grid design」でコミットした状態）  
        ローカルでのみ復元される。次はコミットの取り消しを行った実際のブランチへの復元を反映させる。
        - ローカルでのみ影響(detached HEADとはどういう状態？)
        他のブランチには影響を与えず、指定したコミットの状態を確認したり、変更を加えたりできる。

1. 復元状態を保持するためのブランチ作成
    - detached HEAD のまま（ローカルにしか復元されていない）だと、作業内容がブランチに紐付かないため、以下のように新しいブランチを作成。
    ```
    git switch -c <新しいブランチ名(バックアップ用)>
    ```
    - このコマンドの動作
        - 現在の分離状態（detached HEAD）をベースに、新しいブランチを作成
        - 新しいブランチがその復元状態を保持する。
        - Detached HEAD状態で作業せず、新しいブランチを作成して復元状態を安全に保持
    - メリット
        - 元のブランチやコミット履歴を壊さず、安全に変更を保持可能。
        - 復元した状態を後から利用したい場合も対応しやすい。
1. mainブランチへの適用:
    - 安全な方法：
        ```
        git checkout main
        git cherry-pick <コミットID>
        ```
        → 復元状態を現在のmainブランチに追加する。
    - 強制的に上書きする方法:
        ```
        git checkout main
        git reset --hard <コミットID>
        ```
        → mainブランチを完全に復元した状態に上書き。
1. 履歴の確認:
    ```
    git log --oneline
    ```
    - コミット履歴を確認し、期待通りに復元されているかチェック。
---

#### 補足
- 分離状態（Detached HEAD）とは：
    - git checkout <コミットID>で、特定のコミットに直接切り替えた状態。
    - ブランチの管理外で作業を行うため、元の履歴に戻りにくくなるリスクがある。
    - この状態から新しいブランチを作成することで、安全に作業を進められる。
--- 
#### まとめ
1. 一度コミットを戻しても、`git reflog`を使えば履歴をたどれる。
1. 分離状態になったら、まず新しいブランチを作ることで安全に操作を進められる。
---
#### 教訓
- よくわからない操作をテストするときは、それ用のディレクトリを作成してから実施する。
    - 今回のように追加したコードを消す可能性がある。
- 操作によって、予期しない結果になったときは、アプリをガチャガチャするのではなく、今の状況と対応策を確実に実施できるようにググる。  
</details>

<details>
<summary>position:relative,position:absoluteについて整理</summary>

### 配置についての再整理
---
#### 期待値
- imgタグで指定した画像イメージにspanタグで囲まれた文字列01（クラス名:image-index）を中央揃えで配置したい。
---
#### コード
```html
<li class="grid-item">
    <div class="grid-image-wrapper">
        <img class="grid-image" src="https://dummyimage.com/200x100/000/fff&text=" alt="画像">
        <span class="image-index">01</span>
    </div>
</li>
```
```css
.grid-image-wrapper {
    position: relative; /* 子要素の絶対配置の基準を設定 */
    display: inline-block; /* 画像サイズに応じて適応 */
}

.image-index {
    position: absolute; /* 親要素の中で絶対配置 */
    top: 50%; /* 縦中央 */
    left: 50%; /* 横中央 */
    transform: translate(-50%, -50%); /* 中央に揃える */
    color: white; /* テキストの色を設定 */
    font-size: 18px; /* テキストサイズ */
    font-weight: bold; /* テキストを太字に */
    pointer-events: none; /* クリックを無効化（任意） */
}
```
---
#### まとめ
- imgタグクラスに`position: absolute`を指定したため、この要素が子要素の基準になってしまった。
- `position: relative`はその要素を基準にして、子要素の`position: absolute`を適用するための設定であることを理解していなかった。
    - 整理１：親要素（基準）には`position: relative`、子要素（実際に動かしたい要素）には`position: absolute`
    - 整理２：spanタグとimgタグは同じ階層の要素であり、`position: relative`は親要素のdivタグ（新規作成）またはliタグに追加する必要があった。
</details>