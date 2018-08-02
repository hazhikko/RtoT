RedmineチケットをTaskWorldタスクに追加するという、用途がものすごく限定的なChrome extensionです。
BackLogとRedmineで2重管理してるのに、さらにTaskWorld追加で三重管理とかやめてくれよ…。
という現場の（主に私の）声から生まれました。
自分に必要な機能は実装したので、これ以上直すかどうかは不明です。
必要があれば修正してください。
※ソース内にあるTaskWorldのIDは15日の体験版のものなので、そのうち使えなくなります

今のところ、導入には下記作業が必要です。
※JSファイルを修正するので、JavaScriptがわかる人向け？

■インストール前
RtoT.zipをダウンロード・解凍したら、以下ファイルを編集してください。

★js/const.js
1 userData > sId を対象のspace_idに変更する。
取得方法：https://asia-api.taskworld.com/#authentication
default_space_idでいいのか？
workspacesにもdefault_space_idが含まれていますが、複数のworkspacesを作る方法がわかりませんでした。
とにかく、使用するspace_idを設定してください。

2 userData > pId を対象のproject_idに変更する。
取得方法：https://asia-api.taskworld.com/#get-all-projects
プロジェクトが複数ある場合は、複数個返ってきます。
titleを見て使用するIDを探してください。
TaskWorld上でIDを取得する方法はないような気がします。
不便…。

3 userData > lId を対象のspace_idに変更する。
取得方法：https://asia-api.taskworld.com/#update-a-tasklist
リストが複数ある場合は複数返ってきます。
今のところ、lIdのkey名での判別はしていないので、わかりやすい名前で登録してください。
"key名": "list_id"
今はRedmineのユーザーID別に振り分けるようになっているので、担当者名をkeyにしています。

4 userData > redmineDomainをコピー元のRedmineのドメインに変更する。
ここに指定したページを開いたときにextensionボタンを有効にします。
複数のページを指定したい場合はドメイン指定を工夫してください。
正規表現が使える、はず(未確認)

★js/script.js
createTasWorldData()のswitch文に、必要な分だけ分岐を追加してください。
今はRedmineのユーザーID別に振り分けるようにしていますが、
別の条件で振り分けたい場合はacquireRedmineData()内で取得する情報を変更してください。

■インストール方法
1 Chrome　でchrome://extensions/ にアクセス
2 デベロッパーモードをON
3 パッケージ化されていない拡張機能を読み込むボタンを押し、解凍したRtoTフォルダを選択する

■インストール後
1 Chrome　でchrome://extensions/ にアクセス
2 RtoTのオプションをクリック
3 TaskWorldのアカウント情報（メールアドレス、パスワード）を入力してaccess_tokenを取得

