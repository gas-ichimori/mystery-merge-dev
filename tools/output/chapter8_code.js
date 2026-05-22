```javascript
// ========================================
// 第8章「消えた配信者」
// ========================================

const CH8_SCENE_IDS = [
  'c8s01', 'c8s02', 'c8s03', 'c8s04', 'c8s05',
  'c8s06', 'c8s07', 'c8s08', 'c8s09', 'c8s10',
  'c8s11', 'c8s12', 'c8s13', 'c8s14', 'c8s15',
  'c8s16', 'c8s17', 'c8s18', 'c8s19', 'c8s20',
  'c8s21', 'c8s22', 'c8s23', 'c8s24', 'c8s25'
];

const CH8_SCENE_LIST = [
  { id: 'c8s01', title: '深夜の依頼' },
  { id: 'c8s02', title: '最後の配信' },
  { id: 'c8s03', title: '匿名の悪意' },
  { id: 'c8s04', title: '事務所への訪問' },
  { id: 'c8s05', title: '契約書の闇' },
  { id: 'c8s06', title: 'ガチ恋の告白' },
  { id: 'c8s07', title: '歪んだ愛' },
  { id: 'c8s08', title: 'ライバルの影' },
  { id: 'c8s09', title: '嫉妬の棘' },
  { id: 'c8s10', title: 'アンチスレの住人' },
  { id: 'c8s11', title: '怯えるアンチ' },
  { id: 'c8s12', title: '特定の痕跡' },
  { id: 'c8s13', title: '配信の裏側' },
  { id: 'c8s14', title: '追跡者の正体' },
  { id: 'c8s15', title: 'アリバイの穴' },
  { id: 'c8s16', title: '内部告発' },
  { id: 'c8s17', title: 'デジタルの足跡' },
  { id: 'c8s18', title: '最後の警告' },
  { id: 'c8s19', title: '防犯カメラの真実' },
  { id: 'c8s20', title: '購入者リスト' },
  { id: 'c8s21', title: '真犯人の影' },
  { id: 'c8s22', title: '追い詰める' },
  { id: 'c8s23', title: '救出' },
  { id: 'c8s24', title: '光の中へ' },
  { id: 'c8s25', title: '繋がりの意味' }
];

// ADV_SCENESに追加するシーンデータ
const CH8_SCENES = {
  c8s01: {
    title: '深夜の依頼',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '深夜2時に事務所のチャイムか…何事だ？', side: 'left' },
      { speaker: '美羽', text: 'す、すみません！橘美羽です。姉が…配信者の姉が3日前から行方不明で…', side: 'right' },
      { speaker: 'ヤス', text: '落ち着いて。警察には届けたのか？', side: 'left' },
      { speaker: '美羽', text: '届けました。でも「成人だから自分の意思で消えた可能性もある」って…まともに捜してくれないんです。', side: 'right' },
      { speaker: 'ヤス', text: '配信者というと、ネット上で活動を？', side: 'left' },
      { speaker: '美羽', text: 'はい。VTuberの「星野リコ」…登録者50万人いるんです。ライブ配信中に突然画面が真っ暗になって、それきり連絡が取れなくて…', side: 'right' },
      { speaker: 'ヤス', text: '配信中に失踪…それは只事じゃないな。詳しく聞かせてくれ。', side: 'left' }
    ]
  },
  c8s02: {
    title: '最後の配信',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_vtuber_streaming_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: '美羽', text: 'これが最後の配信のアーカイブです。1時間23分のところで…', side: 'right' },
      { speaker: 'ヤス', text: '急に表情が強張ったな。何か画面外を見ている。', side: 'left' },
      { speaker: '美羽', text: 'チャイムの音…聞こえますか？ここで「ちょっと待ってね」って言って、そのまま…', side: 'right' },
      { speaker: 'ヤス', text: '配信機材はつけっぱなしのまま、誰かが来た。そして二度と戻らなかった。', side: 'left' },
      { speaker: '美羽', text: '姉のマンションに行きましたけど、荷物はそのまま、スマホも置きっぱなしで…', side: 'right' },
      { speaker: 'ヤス', text: '自分の意思で消えたにしては不自然すぎる。心当たりは？', side: 'left' },
      { speaker: '美羽', text: '最近、ひどい誹謗中傷を受けてて…あと、事務所とも揉めてたみたいなんです。', side: 'right' }
    ]
  },
  c8s03: {
    title: '匿名の悪意',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '誹謗中傷というのは、どの程度のものだ？', side: 'left' },
      { speaker: '美羽', text: 'ネット掲示板に専用のアンチスレがあって…「死ね」「消えろ」は当たり前、住所特定しようとする人もいて。', side: 'right' },
      { speaker: 'ヤス', text: 'それは脅迫に近いな。お姉さんは相談していたのか？', side: 'left' },
      { speaker: '美羽', text: '私には弱音を吐きませんでした。でも最後に会った時、すごく痩せてて…眠れてないって。', side: 'right' },
      { speaker: 'ヤス', text: '配信では明るく振る舞いながら、裏では追い詰められていた。', side: 'left' },
      { speaker: '美羽', text: '「ネットの声なんか気にしないで」って言ったんです。そしたら姉、泣きながら笑って…「ありがとう」って。', side: 'right' },
      { speaker: 'ヤス', text: '…俺がお姉さんを見つける。約束しよう。', side: 'left' }
    ]
  },
  c8s04: {
    title: '事務所への訪問',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_47.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_office.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: '神崎', text: '私立探偵？橘の家族が雇ったんですか。まあ、どうぞ。', side: 'right' },
      { speaker: 'ヤス', text: '神崎蓮さん、莉子さんのマネージャーだな。失踪前の様子を聞きたい。', side: 'left' },
      { speaker: '神崎', text: '正直に言いますと、最近は関係が悪化してました。契約更新で揉めてたんです。', side: 'right' },
      { speaker: 'ヤス', text: '揉めていた内容は？', side: 'left' },
      { speaker: '神崎', text: '彼女、独立したいって言い出して。でもうちが育てたのに、それは困るでしょう？', side: 'right' },
      { speaker: 'ヤス', text: '失踪当日、あなたはどこに？', side: 'left' },
      { speaker: '神崎', text: '別のタレントのイベント会場です。100人以上が証人ですよ。…探偵さん、俺を疑ってます？', side: 'right' }
    ]
  },
  c8s05: {
    title: '契約書の闇',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_47.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_office.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'この契約書、違約金が収益の3年分？かなり厳しい条件だな。', side: 'left' },
      { speaker: '神崎', text: '業界では普通ですよ。投資を回収しないと。', side: 'right' },
      { speaker: 'ヤス', text: '莉子さんはこの条件を知って、どう反応した？', side: 'left' },
      { speaker: '神崎', text: '最初は泣いてました。でもすぐに弁護士に相談するって…正直、面倒な子だなと思いましたよ。', side: 'right' },
      { speaker: 'ヤス', text: '面倒な子が消えて、都合がいいと思わないか？', side: 'left' },
      { speaker: '神崎', text: '何を言うんですか。彼女は月500万稼ぐドル箱ですよ。消えて困るのはこっちです！', side: 'right' }
    ]
  },
  c8s06: {
    title: 'ガチ恋の告白',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ユウト', text: '莉子ちゃんを探してるって本当ですか？俺も手伝います！', side: 'right' },
      { speaker: 'ヤス', text: '白石ユウト…莉子さんの熱心なファンだと聞いた。', side: 'left' },
      { speaker: 'ユウト', text: 'ファンなんて言葉じゃ足りないです。俺は莉子ちゃんの「運命の人」なんで。', side: 'right' },
      { speaker: 'ヤス', text: '運命の人、ね。彼女の住所を特定しようとしたことがあるそうだが。', side: 'left' },
      { speaker: 'ユウト', text: 'あれは…会いたかっただけです。悪いことはしてません。', side: 'right' },
      { speaker: 'ヤス', text: '失踪した夜、どこにいた？', side: 'left' },
      { speaker: 'ユウト', text: '家で配信見てました。画面が切れた時…俺、すごく心配で何度もコメントしたんです。', side: 'right' }
    ]
  },
  c8s07: {
    title: '歪んだ愛',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'このリュック、莉子さんのグッズで埋め尽くされてるな。', side: 'left' },
      { speaker: 'ユウト', text: '全部持ってます。限定品も、転売で買ったやつも。', side: 'right' },
      { speaker: 'ヤス', text: '彼女に直接会ったことは？', side: 'left' },
      { speaker: 'ユウト', text: 'イベントで握手しました。3秒だけ。でもあの時、莉子ちゃん俺の目を見て笑ったんです。', side: 'right' },
      { speaker: 'ヤス', text: 'それで「運命」だと？', side: 'left' },
      { speaker: 'ユウト', text: '分かってくれないですよね。でも俺は本気なんです。莉子ちゃんがいない世界なんて…意味ないんですよ。', side: 'right' },
      { speaker: 'ヤス', text: 'その執着が、彼女を追い詰めた可能性は考えないのか？', side: 'left' }
    ]
  },
  c8s08: {
    title: 'ライバルの影',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_49.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_office.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'カナ', text: 'あら、探偵さん？莉子の件で？可哀想よね、あの子。', side: 'right' },
      { speaker: 'ヤス', text: '瀬戸カナさん、同じ事務所の配信者だな。彼女とは親しかったのか？', side: 'left' },
      { speaker: 'カナ', text: '親友よ。コラボもよくしてたし、プライベートでも遊んでた。', side: 'right' },
      { speaker: 'ヤス', text: '最近の莉子さんの様子は？', side: 'left' },
      { speaker: 'カナ', text: '少し疲れてたかな。アンチがひどくてって愚痴ってた。私も慰めてたんだけど…', side: 'right' },
      { speaker: 'ヤス', text: '失踪当日、連絡は取った？', side: 'left' },
      { speaker: 'カナ', text: '配信見てたわよ。途中で切れた時は驚いたけど…まさか本当に消えるなんて思わないでしょ？', side: 'right' }
    ]
  },
  c8s09: {
    title: '嫉妬の棘',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_49.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_office.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'カナさん、あなたの匿名掲示板への書き込み疑惑について聞きたい。', side: 'left' },
      { speaker: 'カナ', text: 'はあ？何の話？', side: 'right' },
      { speaker: 'ヤス', text: '莉子さんのアンチスレに、内部情報をリークしていた人物がいる。事務所関係者しか知り得ない情報だ。', side: 'left' },
      { speaker: 'カナ', text: '…それが私だって証拠でもあるの？', side: 'right' },
      { speaker: 'ヤス', text: 'IPアドレスの照合は警察の仕事だが、俺は動機を聞きに来た。', side: 'left' },
      { speaker: 'カナ', text: '動機？あるわけないでしょ。私たち親友よ？', side: 'right' },
      { speaker: 'ヤス', text: '登録者数、収益、案件の数。全てにおいて莉子さんが上だった。それでも嫉妬はなかった？', side: 'left' },
      { speaker: 'カナ', text: '……出て行って。', side: 'right' }
    ]
  },
  c8s10: {
    title: 'アンチスレの住人',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: null,
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: '774', text: 'おい、なんで俺の居場所が分かった？', side: 'right' },
      { speaker: 'ヤス', text: 'ネットカフェの防犯カメラと書き込み時間を照合した。あんた、アンチスレの管理人だな。', side: 'left' },
      { speaker: '774', text: '管理人じゃない、ただの古参だ。俺は見てただけで…', side: 'right' },
      { speaker: 'ヤス', text: '「見てただけ」で済むのか？「死ね」「消えろ」の連投を煽ってたのは誰だ？', side: 'left' },
      { speaker: '774', text: 'あれは…ノリっていうか…本気じゃなかったんだよ…', side: 'right' },
      { speaker: 'ヤス', text: '莉子さんが本当に消えた今、その言い訳が通用すると思うか？', side: 'left' },
      { speaker: '774', text: '俺は関係ない！俺は何もしてない！', side: 'right' }
    ]
  },
  c8s11: {
    title: '怯えるアンチ',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: null,
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '落ち着け。話を聞きたいだけだ。', side: 'left' },
      { speaker: '774', text: '俺、本当に何も知らないんだ。書き込んでただけで、リアルで会ったことなんてない。', side: 'right' },
      { speaker: 'ヤス', text: 'アンチスレに「特定完了」という書き込みがあった。あれは誰だ？', side: 'left' },
      { speaker: '774', text: '知らない。でも…あの書き込みの後、空気が変わったんだ。本気でヤバいやつが混じってきた感じがして。', side: 'right' },
      { speaker: 'ヤス', text: '本気でヤバいやつとは？', side: 'left' },
      { speaker: '774', text: '分からない。でも、配信のスケジュールとか、移動ルートとか、異常に詳しいやつがいた。俺、怖くなって最近は書き込んでなかったんだ。', side: 'right' },
      { speaker: 'ヤス', text: 'そいつのハンドルネームは覚えてるか？', side: 'left' },
      { speaker: '774', text: '「推しは俺のもの」…だったと思う。', side: 'right' }
    ]
  },
  c8s12: {
    title: '特定の痕跡',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_vtuber_streaming_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '美羽さん、莉子さんのマンションをもう一度調べさせてくれ。', side: 'left' },
      { speaker: '美羽', text: '分かりました。警察は一度見ただけで、大して調べてないんです。', side: 'right' },
      { speaker: 'ヤス', text: 'この窓際、カーテンの隙間から部屋が見える。向かいのビルから覗けるな。', side: 'left' },
      { speaker: '美羽', text: 'え…まさか、ずっと見られてたってことですか？', side: 'right' },
      { speaker: 'ヤス', text: '机の上にあるこの手紙…「いつも見てるよ」？', side: 'left' },
      { speaker: '美羽', text: '姉、こんなの受け取ってたんだ…怖い…', side: 'right' },
      { speaker: 'ヤス', text: '消印は2週間前。差出人の名前はない。筆跡鑑定に回す必要があるな。', side: 'left' }
    ]
  },
  c8s13: {
    title: '配信の裏側',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_47.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_office.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '神崎さん、莉子さんにストーカー被害の相談を受けていたか？', side: 'left' },
      { speaker: '神崎', text: 'ストーカー？いや、聞いてませんね。', side: 'right' },
      { speaker: 'ヤス', text: 'この手紙を見てくれ。「いつも見てるよ」。不審な郵便物の報告はなかったのか？', side: 'left' },
      { speaker: '神崎', text: '…正直、ファンレターは大量に届くので、いちいち確認してません。', side: 'right' },
      { speaker: 'ヤス', text: '彼女の身の安全より、収益が大事だったわけか。', side: 'left' },
      { speaker: '神崎', text: '言い方がひどいですね。でも…確かに、もっと気にかけるべきだったかもしれない。', side: 'right' },
      { speaker: 'ヤス', text: '事務所に届いたファンレターの中に、同じ筆跡のものがないか確認してくれ。', side: 'left' }
    ]
  },
  c8s14: {
    title: '追跡者の正体',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'ユウト、この手紙の筆跡、お前のものか？', side: 'left' },
      { speaker: 'ユウト', text: '…これ、どこで見つけたんですか？', side: 'right' },
      { speaker: 'ヤス', text: '莉子さんの部屋だ。「いつも見てるよ」。お前だな？', side: 'left' },
      { speaker: 'ユウト', text: '俺は…ただ、近くにいたかっただけで…', side: 'right' },
      { speaker: 'ヤス', text: '部屋を覗いていたのか？', side: 'left' },
      { speaker: 'ユウト', text: '違います！手紙は出したけど、それだけです。窓から覗くなんてしてない！', side: 'right' },
      { speaker: 'ヤス', text: 'なら、失踪した夜の行動をもう一度詳しく話せ。', side: 'left' }
    ]
  },
  c8s15: {
    title: 'アリバイの穴',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ユウト', text: 'あの夜は家にいました。配信を見てたんです、本当に。', side: 'right' },
      { speaker: 'ヤス', text: 'お前の家から莉子さんのマンションまで、電車で15分だ。配信が途切れた後、移動する時間は十分あった。', side: 'left' },
      { speaker: 'ユウト', text: '行ってません！俺は莉子ちゃんを傷つけたりしない！', side: 'right' },
      { speaker: 'ヤス', text: '愛してるからか？', side: 'left' },
      { speaker: 'ユウト', text: 'そうです！愛してるから…守りたかったんです。', side: 'right' },
      { speaker: 'ヤス', text: 'だが現実には、お前の手紙が彼女を怯えさせていた。それを愛と呼ぶのか？', side: 'left' },
      { speaker: 'ユウト', text: '…俺、そんなつもりじゃなかった。ただ、知ってほしかっただけなのに…', side: 'right' }
    ]
  },
  c8s16: {
    title: '内部告発',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_49.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_office.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'カナさん、アンチスレへの書き込み、認める気になったか？', side: 'left' },
      { speaker: 'カナ', text: '…ええ、認めるわ。でも、悪口を書いただけよ。莉子を消したりしてない。', side: 'right' },
      { speaker: 'ヤス', text: 'なぜそんなことを？', side: 'left' },
      { speaker: 'カナ', text: '悔しかったのよ。同期で始めたのに、いつの間にか差がついて…私は「莉子の引き立て役」扱い。', side: 'right' },
      { speaker: 'ヤス', text: 'それで誹謗中傷を煽った？', side: 'left' },
      { speaker: 'カナ', text: '最初は憂さ晴らしだった。でも、どんどんエスカレートしていって…私も怖くなってきてたの。', side: 'right' },
      { speaker: 'ヤス', text: '「推しは俺のもの」というユーザーに心当たりは？', side: 'left' },
      { speaker: 'カナ', text: '知らないわ。でも、あの人の書き込み、異常だった。莉子の行動を全部把握してるみたいで…', side: 'right' }
    ]
  },
  c8s17: {
    title: 'デジタルの足跡',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_vtuber_streaming_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '莉子さんのパソコン、パスワードは分かるか？', side: 'left' },
      { speaker: '美羽', text: '誕生日と私の名前の組み合わせだと思います。…開きました。', side: 'right' },
      { speaker: 'ヤス', text: 'メールボックスを確認しよう。…これは酷いな。脅迫メールが数百通。', side: 'left' },
      { speaker: '美羽', text: '姉、こんなの毎日見てたの…？', side: 'right' },
      { speaker: 'ヤス', text: '待て、この送信者アドレス、パターンがある。全て同一人物の可能性が高い。', side: 'left' },
      { speaker: '美羽', text: '一人の人間が、これだけの憎悪を…？', side: 'right' },
      { speaker: 'ヤス', text: '添付ファイルがある。「最後の警告」というタイトルだ。開くぞ。', side: 'left' }
    ]
  },
  c8s18: {
    title: '最後の警告',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_vtuber_streaming_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'これは…莉子さんのマンションの写真だ。外から撮影されてる。', side: 'left' },
      { speaker: '美羽', text: '日付が失踪の前日…ストーカーに完全に特定されてたんだ。', side: 'right' },
      { speaker: 'ヤス', text: 'メールの文面は「俺の言うことを聞かないなら、直接会いに行く」。', side: 'left' },
      { speaker: '美羽', text: '姉、警察に相談しなかったのかな…', side: 'right' },
      { speaker: 'ヤス', text: 'ネットの誹謗中傷は、被害を立証するのが難しい。きっと諦めていたんだろう。', side: 'left' },
      { speaker: '美羽', text: '私に相談してくれれば…私が守れたかもしれないのに…', side: 'right' },
      { speaker: 'ヤス', text: '自分を責めるな。今は、犯人を見つけることに集中しよう。', side: 'left' }
    ]
  },
  c8s19: {
    title: '防犯カメラの真実',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_47.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_office.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '神崎さん、マンション周辺の防犯カメラ映像を入手した。協力してくれ。', side: 'left' },
      { speaker: '神崎', text: '俺に何ができるんです？', side: 'right' },
      { speaker: 'ヤス', text: 'この映像に映っている人物、見覚えはないか？失踪当夜、莉子さんの部屋に向かう男だ。', side: 'left' },
      { speaker: '神崎', text: 'これは…顔が見えませんね。でも、この体格、このリュック…', side: 'right' },
      { speaker: 'ヤス', text: 'リュックに何か付いている。ストラップか？', side: 'left' },
      { speaker: '神崎', text: '待ってください、このストラップ…莉子のオリジナルグッズだ。限定100個の。', side: 'right' },
      { speaker: 'ヤス', text: '購入者リストは事務所にあるか？', side: 'left' },
      { speaker: '神崎', text: 'ええ、あるはずです。すぐに確認します。', side: 'right' }
    ]
  },
  c8s20: {
    title: '購入者リスト',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_47.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_office.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'リストを見せてくれ。', side: 'left' },
      { speaker: '神崎', text: '100人分の名前と住所です。でも、偽名を使ってる可能性もありますよね。', side: 'right' },
      { speaker: 'ヤス', text: '白石ユウトの名前はあるか？', side: 'left' },
      { speaker: '神崎', text: 'ありますね。3番目に購入してます。', side: 'right' },
      { speaker: 'ヤス', text: '他に気になる名前は？', side: 'left' },
      { speaker: '神崎', text: '「山田太郎」…これは明らかに偽名ですね。住所も存在しない場所になってます。', side: 'right' },
      { speaker: 'ヤス', text: '決済情報から本人を特定できるか？', side: 'left' },
      { speaker: '神崎', text: 'クレジットカード情報なら…警察の協力が必要ですが、可能かもしれません。', side: 'right' }
    ]
  },
  c8s21: {
    title: '真犯人の影',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: null,
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: '774', text: 'また来たのかよ…もう勘弁してくれ。', side: 'right' },
      { speaker: 'ヤス', text: '「推しは俺のもの」について、もう一度聞きたい。', side: 'left' },
      { speaker: '774', text: 'だから知らないって…', side: 'right' },
      { speaker: 'ヤス', text: '嘘をつくな。お前、オフ会で会ったことがあるだろう。', side: 'left' },
      { speaker: '774', text: '…なんで知ってるんだ。', side: 'right' },
      { speaker: 'ヤス', text: 'アンチスレの過去ログを全部読んだ。オフ会の報告スレがあった。', side: 'left' },
      { speaker: '774', text: 'あいつ…オフ会で会った時、目が本気だったんだ。「莉子は俺のものだ」って、本気で信じてた。', side: 'right' },
      { speaker: 'ヤス', text: '名前は？', side: 'left' },
      { speaker: '774', text: '知らない。でも、IT関係の仕事だって言ってた。ハッキングとかできるって自慢してた。', side: 'right' }
    ]
  },
  c8s22: {
    title: '追い詰める',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '美羽さん、犯人の目星がついた。', side: 'left' },
      { speaker: '美羽', text: '本当ですか！？姉は…姉は無事なんですか？', side: 'right' },
      { speaker: 'ヤス', text: 'まだ分からない。だが、時間がない。警察に協力を要請した。', side: 'left' },
      { speaker: '美羽', text: '犯人は誰なんです？', side: 'right' },
      { speaker: 'ヤス', text: 'IT技術者で、莉子さんの熱狂的ファン。ハッキングで個人情報を抜き、計画的にストーキングしていた。', side: 'left' },
      { speaker: '美羽', text: '白石さん…じゃないんですか？', side: 'right' },
      { speaker: 'ヤス', text: '彼は確かに問題行動があったが、今回の犯人ではない。もっと巧妙で、危険な人物だ。', side: 'left' }
    ]
  },
  c8s23: {
    title: '救出',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '警察が犯人の自宅を特定した。郊外の一軒家だ。', side: 'left' },
      { speaker: '美羽', text: '姉はそこに…？', side: 'right' },
      { speaker: 'ヤス', text: '監禁されている可能性が高い。美羽さん、ここで待っていてくれ。', side: 'left' },
      { speaker: '美羽', text: '私も行きます！姉に会いたい！', side: 'right' },
      { speaker: 'ヤス', text: '危険だ。犯人は精神的に不安定で、何をするか分からない。', side: 'left' },
      { speaker: '美羽', text: 'でも…！', side: 'right' },
      { speaker: 'ヤス', text: '俺が必ず連れて帰る。約束したからな。', side: 'left' }
    ]
  },
  c8s24: {
    title: '光の中へ',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_46.png',
    bg: 'img/Chapter8/bg/image_merge_bg_vtuber_streaming_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '莉子さん、大丈夫ですか？俺は探偵の蓮見です。美羽さんに頼まれて来ました。', side: 'left' },
      { speaker: '莉子', text: '美羽が…？私を、探してくれてたの…？', side: 'right' },
      { speaker: 'ヤス', text: 'ずっと探していた。諦めなかった。', side: 'left' },
      { speaker: '莉子', text: '私…もうダメだと思ってた。誰も助けに来ないって…', side: 'right' },
      { speaker: 'ヤス', text: '外で妹さんが待っている。一緒に帰ろう。', side: 'left' },
      { speaker: '莉子', text: '…ありがとう、ございます。配信者として、みんなに愛想を振りまいてた私は…本当の私じゃなかった。でも、こんな私を探してくれる人がいたなんて…', side: 'right' },
      { speaker: 'ヤス', text: 'あなたは一人じゃない。それを忘れないでくれ。', side: 'left' }
    ]
  },
  c8s25: {
    title: '繋がりの意味',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: '美羽', text: 'ヤスさん、本当にありがとうございました。姉は少しずつ回復してます。', side: 'right' },
      { speaker: 'ヤス', text: 'そうか、良かった。配信は続けるのか？', side: 'left' },
      { speaker: '美羽', text: '姉、当分は休むって言ってます。でも、いつかまた自分の言葉で発信したいって。', side: 'right' },
      { speaker: 'ヤス', text: 'ネットは便利だが、匿名の悪意も生む。莉子さんには、自分を守る術も学んでほしい。', side: 'left' },
      { speaker: '美羽', text: '私も、もっと姉と話すようにします。画面越しじゃなくて、ちゃんと顔を見て。', side: 'right' },
      { speaker: 'ヤス', text: 'それがいい。「推し」も「配信者」も、画面の向こうには生身の人間がいる。それを忘れちゃいけない。', side: 'left' },
      { speaker: '美羽', text: 'ヤスさんのおかげで、姉は帰ってきました。本当に…ありがとうございました。', side: 'right' }
    ]
  }
};

// ADV_SCENESにCH8のシーンを追加
Object.assign(ADV_SCENES, CH8_SCENES);

// 第8章 関係図データ
const CH8_KANKEI_NODES = [
  { id: 'yasu', label: 'ヤス', img: 'img/Chapter1/Chara/image_merge_order_chara_00.png', main: true },
  { id: 'miu', label: '橘 美羽', img: 'img/Chapter8/chara/chara_45.png' },
  { id: 'riko', label: '橘 莉子', img: 'img/Chapter8/chara/chara_46.png' },
  { id: 'kanzaki', label: '神崎 蓮', img: 'img/Chapter8/chara/chara_47.png' },
  { id: 'yuuto', label: '白石 ユウト', img: 'img/Chapter8/chara/chara_48.png' },
  { id: 'kana', label: '瀬戸 カナ', img: 'img/Chapter8/chara/chara_49.png' }
];

const CH8_BADGES = [
  { id: 'miu', type: '依頼人' },
  { id: 'riko', type: '被害者' },
  { id: 'kanzaki', type: '関係者' },
  { id: 'yuuto', type: '容疑者' },
  { id: 'kana', type: '容疑者' }
];

const CH8_KANKEI_EDGES = [
  { from: 'miu', to: 'riko', label: '姉妹' },
  { from: 'riko', to: 'kanzaki', label: 'マネージャー' },
  { from: 'riko', to: 'yuuto', label: '熱狂的ファン' },
  { from: 'riko', to: 'kana', label: '同僚・ライバル' },
  { from: 'yasu', to: 'miu', label: '調査依頼' },
  { from: 'kana', to: 'riko', label: '嫉妬・情報リーク' },
  { from: 'yuuto', to: 'riko', label: 'ストーカー行為' }
];
```