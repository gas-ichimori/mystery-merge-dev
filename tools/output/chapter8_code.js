```javascript
// 第8章「消えた配信者」

const CH8_SCENE_IDS = ['c8s01','c8s02','c8s03','c8s04','c8s05','c8s06','c8s07','c8s08','c8s09','c8s10','c8s11','c8s12','c8s13','c8s14','c8s15','c8s16','c8s17','c8s18','c8s19','c8s20','c8s21','c8s22','c8s23','c8s24','c8s25'];

const CH8_SCENE_LIST = [
  {id:'c8s01',title:'深夜の依頼'},
  {id:'c8s02',title:'途切れた配信'},
  {id:'c8s03',title:'マネージャーの本音'},
  {id:'c8s04',title:'冷たい計算'},
  {id:'c8s05',title:'推しへの執着'},
  {id:'c8s06',title:'ガチ恋の闇'},
  {id:'c8s07',title:'仲良しの仮面'},
  {id:'c8s08',title:'嫉妬の証拠'},
  {id:'c8s09',title:'匿名の悪意'},
  {id:'c8s10',title:'住所特定の闇'},
  {id:'c8s11',title:'莉子の部屋'},
  {id:'c8s12',title:'隠されたUSB'},
  {id:'c8s13',title:'脅迫の証拠'},
  {id:'c8s14',title:'過去の傷'},
  {id:'c8s15',title:'内部告発'},
  {id:'c8s16',title:'共犯の影'},
  {id:'c8s17',title:'守護者の正体'},
  {id:'c8s18',title:'歪んだ愛'},
  {id:'c8s19',title:'もう一人の訪問者'},
  {id:'c8s20',title:'契約の裏側'},
  {id:'c8s21',title:'隠された場所'},
  {id:'c8s22',title:'逃避行の果て'},
  {id:'c8s23',title:'配信者の涙'},
  {id:'c8s24',title:'光の中へ'},
  {id:'c8s25',title:'再起の配信'}
];

const CH8_ADV_SCENES = {
  c8s01: {
    title: '深夜の依頼',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'こんな夜遅くに事務所を訪ねてくるとは…よっぽど急ぎの用件かい？', side: 'left' },
      { speaker: '美羽', text: 'すみません、でも警察は『成人の家出は事件性がないと動けない』って…。探偵さん、姉を探してください', side: 'right' },
      { speaker: 'ヤス', text: 'お姉さん？詳しく聞かせてくれ', side: 'left' },
      { speaker: '美羽', text: '姉は配信者なんです。『星野リコ』って名前で…3日前、ライブ配信中に突然画面が暗転して、それきり連絡が取れなくなりました', side: 'right' },
      { speaker: 'ヤス', text: '配信中に失踪…それは穏やかじゃないな。その時の配信映像は残ってるのか？', side: 'left' },
      { speaker: '美羽', text: 'はい、アーカイブをUSBに入れてきました。見てください…姉が最後に見せた表情、明らかに怯えてたんです', side: 'right' }
    ]
  },
  c8s02: {
    title: '途切れた配信',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '…確かに、暗転する直前にチャイムのような音が聞こえるな。来客か', side: 'left' },
      { speaker: '美羽', text: '姉のマンションはオートロックなのに、誰が来たんでしょう…', side: 'right' },
      { speaker: 'ヤス', text: 'コメント欄が荒れてるな。『ざまあ』『消えろ』…これは？', side: 'left' },
      { speaker: '美羽', text: '姉、最近アンチに粘着されてて…。匿名掲示板に専用スレッドまで立てられてたんです', side: 'right' },
      { speaker: 'ヤス', text: '誹謗中傷か。失踪前、何かトラブルは？', side: 'left' },
      { speaker: '美羽', text: '事務所との契約問題、熱狂的なファンからのストーカー行為、同僚との不仲…正直、心当たりがありすぎて', side: 'right' }
    ]
  },
  c8s03: {
    title: 'マネージャーの本音',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_47.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_meeting_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '神崎蓮さんですね。橘莉子さんのマネージャーを？', side: 'left' },
      { speaker: '神崎', text: 'ええ、2年ほど担当しています。失踪の件、我々も困惑してまして', side: 'right' },
      { speaker: 'ヤス', text: '失踪前、契約トラブルがあったと聞いたが', side: 'left' },
      { speaker: '神崎', text: '…誰から聞きました？まあいいでしょう。彼女、独立したいと言い出したんです。今のタイミングで、ありえない', side: 'right' },
      { speaker: 'ヤス', text: 'それで揉めた？', side: 'left' },
      { speaker: '神崎', text: 'ビジネスですから、多少の交渉はありますよ。でも僕が彼女を消すメリットがどこにあります？彼女は"商品"なんです、売れてる商品を壊す馬鹿がいますか', side: 'right' }
    ]
  },
  c8s04: {
    title: '冷たい計算',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_47.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_meeting_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '独立を阻止するために脅した、という可能性は？', side: 'left' },
      { speaker: '神崎', text: '脅す？探偵さん、僕を何だと思ってます。彼女の配信を止めたら、僕の収入も止まるんですよ', side: 'right' },
      { speaker: 'ヤス', text: '失踪当日、あなたはどこに？', side: 'left' },
      { speaker: '神崎', text: '別のタレントのイベント会場です。50人以上の目撃者がいます、アリバイは完璧です', side: 'right' },
      { speaker: 'ヤス', text: '莉子さんの住所を知っている人間は？', side: 'left' },
      { speaker: '神崎', text: '事務所の人間と、あと…いますよ、一人。彼女の住所を執拗に調べ回ってた危険なファンが', side: 'right' }
    ]
  },
  c8s05: {
    title: '推しへの執着',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_otaku_room_shrine.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '白石ユウトくんだね。星野リコのファンだと聞いた', side: 'left' },
      { speaker: 'ユウト', text: 'ファンなんて軽い言葉で括らないでください。僕は莉子さんの"理解者"です', side: 'right' },
      { speaker: 'ヤス', text: '理解者…ね。彼女の住所を特定しようとしたことがあるそうだが', side: 'left' },
      { speaker: 'ユウト', text: 'それは誤解です！守りたかっただけなんです、アンチから、事務所から、彼女を食い物にする全員から！', side: 'right' },
      { speaker: 'ヤス', text: '失踪した日、彼女のマンションの近くにいたという目撃情報がある', side: 'left' },
      { speaker: 'ユウト', text: '…それは、たまたま近くを通っただけで…でも彼女には会ってません、本当です！', side: 'right' }
    ]
  },
  c8s06: {
    title: 'ガチ恋の闇',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_otaku_room_shrine.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '彼女の部屋番号は知っていたのか？', side: 'left' },
      { speaker: 'ユウト', text: '…知ってました。でも押しかけたりしてません、信じてください', side: 'right' },
      { speaker: 'ヤス', text: 'どうやって特定した？', side: 'left' },
      { speaker: 'ユウト', text: '配信に映り込んだ窓からの景色、届いた宅配便の伝票、些細な情報を集めれば…', side: 'right' },
      { speaker: 'ヤス', text: 'それをストーカー行為と言うんだ', side: 'left' },
      { speaker: 'ユウト', text: '違う！僕は本気で心配してるんです！莉子さんは最近怯えてた、誰かに追い詰められてるみたいに。僕じゃない、別の誰かに…', side: 'right' }
    ]
  },
  c8s07: {
    title: '仲良しの仮面',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_49.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_meeting_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '月城カナさん、莉子さんとは同僚だそうですね', side: 'left' },
      { speaker: 'カナ', text: 'ええ、同期入所で親友ですよ。早く見つかってほしいって、毎日祈ってます', side: 'right' },
      { speaker: 'ヤス', text: '親友…ですか。でもあなたは彼女の人気を妬んでいたと聞きましたが', side: 'left' },
      { speaker: 'カナ', text: '誰がそんなこと言ったんですか？莉子は確かに人気者だけど、私は私のファンがいるから満足してますよ', side: 'right' },
      { speaker: 'ヤス', text: '匿名掲示板に莉子さんの誹謗中傷を書き込んでいた疑惑があるそうですね', side: 'left' },
      { speaker: 'カナ', text: '…それ、証拠あるんですか？', side: 'right' }
    ]
  },
  c8s08: {
    title: '嫉妬の証拠',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_49.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_meeting_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '書き込みの文体、使われてる絵文字の癖、莉子さんしか知らない情報…かなり特定されつつあるようだが', side: 'left' },
      { speaker: 'カナ', text: '…はあ、面倒くさい。ちょっと愚痴っただけじゃないですか', side: 'right' },
      { speaker: 'ヤス', text: '愚痴？『消えろ』『死ね』が愚痴か？', side: 'left' },
      { speaker: 'カナ', text: 'あの子ばっかりチヤホヤされて、私の配信には来ないで莉子の話ばかりするファン、うんざりしてたんです。でも失踪には関係ないですよ', side: 'right' },
      { speaker: 'ヤス', text: '失踪当日は？', side: 'left' },
      { speaker: 'カナ', text: '自分の配信してました。アーカイブ見ればわかります。私がアリバイなしに見えます？', side: 'right' }
    ]
  },
  c8s09: {
    title: '匿名の悪意',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_otaku_room_shrine.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'あなたが"774"だな。莉子さんのアンチスレを管理していた', side: 'left' },
      { speaker: '774', text: 'う、うるさいな…別に違法なことはしてねえよ', side: 'right' },
      { speaker: 'ヤス', text: '彼女が失踪して、怯えているように見えるが？', side: 'left' },
      { speaker: '774', text: 'だって、俺のせいにされたらたまんねえだろ！ネットで悪口書くのと、リアルで人を消すのは全然違うんだよ！', side: 'right' },
      { speaker: 'ヤス', text: 'あのスレッドに、彼女の住所や行動パターンを書き込んだ人間がいたな。誰だ？', side: 'left' },
      { speaker: '774', text: '…それは、俺が書いたんじゃない。別の奴だ', side: 'right' }
    ]
  },
  c8s10: {
    title: '住所特定の闇',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_otaku_room_shrine.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'その『別の奴』について詳しく聞かせろ', side: 'left' },
      { speaker: '774', text: '最近現れた奴でさ、やたら詳しい個人情報を投下してきたんだ。俺らも引くくらいに', side: 'right' },
      { speaker: 'ヤス', text: 'そいつのハンドルネームは？', side: 'left' },
      { speaker: '774', text: '『真実を知る者』…気味悪い名前だろ。IPは偽装されてて追えなかった', side: 'right' },
      { speaker: 'ヤス', text: 'その人物が書き込んだ内容に心当たりは？', side: 'left' },
      { speaker: '774', text: '事務所の内部情報とか、契約金の話とか…どう考えても関係者しか知らないことばかりだった', side: 'right' }
    ]
  },
  c8s11: {
    title: '莉子の部屋',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_otaku_room_shrine.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'ここが莉子さんの部屋か。…配信機材がそのままだな', side: 'left' },
      { speaker: '美羽', text: '警察は見たけど、特に異常なしって…。でも姉がこんな散らかったまま出かけるはずないんです', side: 'right' },
      { speaker: 'ヤス', text: 'この引き出し、無理やり開けた痕がある。誰かが何かを探したようだ', side: 'left' },
      { speaker: '美羽', text: 'えっ…姉が自分で？', side: 'right' },
      { speaker: 'ヤス', text: '違う、靴の跡が残ってる。サイズは…男物だな。美羽さん、この部屋に男性が来たことは？', side: 'left' },
      { speaker: '美羽', text: '姉は彼氏もいないし、そんな…', side: 'right' }
    ]
  },
  c8s12: {
    title: '隠されたUSB',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_otaku_room_shrine.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '待て、このぬいぐるみ…縫い目が新しい。中に何か入れてないか確認していいか？', side: 'left' },
      { speaker: '美羽', text: 'それ、姉が一番大事にしてたぬいぐるみです…', side: 'right' },
      { speaker: 'ヤス', text: 'やはり。USBメモリが縫い込まれてる。莉子さんは何かを隠していた', side: 'left' },
      { speaker: '美羽', text: '何が入ってるんでしょう…', side: 'right' },
      { speaker: 'ヤス', text: '解析してみよう。彼女が命がけで守ろうとした何かがある', side: 'left' }
    ]
  },
  c8s13: {
    title: '脅迫の証拠',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'USBの中身を確認した。脅迫メールのバックアップが大量に…', side: 'left' },
      { speaker: '美羽', text: '脅迫…？姉、誰かに脅されてたんですか？', side: 'right' },
      { speaker: 'ヤス', text: '『お前の過去をバラす』『大人しく従え』…差出人は匿名だが、内容から察するに、莉子さんの"ある秘密"を握っていたようだ', side: 'left' },
      { speaker: '美羽', text: '秘密って何ですか？姉に隠し事なんて…', side: 'right' },
      { speaker: 'ヤス', text: 'VTuberになる前の経歴に関することらしい。美羽さん、お姉さんの過去について何か知らないか？', side: 'left' },
      { speaker: '美羽', text: '…姉は高校を中退してるんです。理由は聞いても教えてくれなくて', side: 'right' }
    ]
  },
  c8s14: {
    title: '過去の傷',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_47.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_meeting_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '神崎さん、莉子さんの過去についてあなたは知っていたはずだ', side: 'left' },
      { speaker: '神崎', text: '…何のことです？', side: 'right' },
      { speaker: 'ヤス', text: '彼女がVTuberになる前、ネットでの炎上経験があった。そうだな？', side: 'left' },
      { speaker: '神崎', text: '…調べましたか。5年前、彼女は別名義で配信者をしてました。些細な発言が炎上して、誹謗中傷で追い詰められて活動休止した過去があります', side: 'right' },
      { speaker: 'ヤス', text: 'その過去をネタに脅されていたのでは？', side: 'left' },
      { speaker: '神崎', text: 'そこまでは知りません。ただ…この情報を知ってる人間は限られてます。事務所の上層部と、あとは…', side: 'right' }
    ]
  },
  c8s15: {
    title: '内部告発',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_49.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_meeting_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'カナさん、莉子さんの過去の炎上について知っていたな？', side: 'left' },
      { speaker: 'カナ', text: '…なんで私に聞くんですか', side: 'right' },
      { speaker: 'ヤス', text: '『真実を知る者』、あなたの書き込みだろう？', side: 'left' },
      { speaker: 'カナ', text: 'っ…！違います、あれは私じゃ…', side: 'right' },
      { speaker: 'ヤス', text: '事務所の内部情報を知っていて、莉子さんに嫉妬していた人間。条件に当てはまるのはあなただけだ', side: 'left' },
      { speaker: 'カナ', text: '…脅迫まではしてません！ちょっとバラしただけです、あとは勝手に拡散されて…', side: 'right' }
    ]
  },
  c8s16: {
    title: '共犯の影',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_49.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_meeting_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '情報をバラした"だけ"？その情報を使って脅迫した人間がいる。誰かに教えたんじゃないのか？', side: 'left' },
      { speaker: 'カナ', text: '…一人だけ、DMで聞いてきた人がいました。『もっと詳しく教えてほしい』って', side: 'right' },
      { speaker: 'ヤス', text: 'そいつの名前は？', side: 'left' },
      { speaker: 'カナ', text: 'アカウント名しか知らないけど…『リコの守護者』って名乗ってた', side: 'right' },
      { speaker: 'ヤス', text: '守護者…妙な名前だな。そいつとどんなやり取りを？', side: 'left' },
      { speaker: 'カナ', text: '莉子を『救う』ために情報が必要だって。だから教えたんです、正義のためだと思って…', side: 'right' }
    ]
  },
  c8s17: {
    title: '守護者の正体',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_otaku_room_shrine.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '『リコの守護者』…それはお前だな、ユウトくん', side: 'left' },
      { speaker: 'ユウト', text: '…どうしてわかったんですか', side: 'right' },
      { speaker: 'ヤス', text: '莉子さんを『理解者として守りたい』と言っていただろう。同じ思想だ', side: 'left' },
      { speaker: 'ユウト', text: '僕は莉子さんを救おうとしただけなんです！アンチから、事務所から、過去の呪縛から解放してあげたかった！', side: 'right' },
      { speaker: 'ヤス', text: 'だから過去の情報を集めて脅迫した？それは"救い"じゃない、支配だ', side: 'left' },
      { speaker: 'ユウト', text: '違う！僕は莉子さんに『もう配信者なんてやめて、僕と静かに暮らそう』って伝えたかっただけで…', side: 'right' }
    ]
  },
  c8s18: {
    title: '歪んだ愛',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_otaku_room_shrine.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'あの夜、お前が部屋を訪ねたんだな', side: 'left' },
      { speaker: 'ユウト', text: '…はい。チャイムを鳴らしたら莉子さんが出てくれて、僕は嬉しくて…', side: 'right' },
      { speaker: 'ヤス', text: 'それで？', side: 'left' },
      { speaker: 'ユウト', text: 'でも莉子さんは怯えた目で僕を見て、『通報する』って言って…。僕は慌てて逃げました、本当にそれだけなんです！', side: 'right' },
      { speaker: 'ヤス', text: 'お前が逃げた後、莉子さんはどうした？', side: 'left' },
      { speaker: 'ユウト', text: 'わかりません…でも、マンションを出る時、別の人が入っていくのを見ました', side: 'right' }
    ]
  },
  c8s19: {
    title: 'もう一人の訪問者',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_48.png',
    bg: 'img/Chapter8/bg/image_merge_bg_otaku_room_shrine.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '別の人間？どんな人物だった？', side: 'left' },
      { speaker: 'ユウト', text: '暗くてよく見えなかったけど…スーツ姿の男性でした。オートロックを解除してたから、合鍵を持ってたんだと思います', side: 'right' },
      { speaker: 'ヤス', text: '合鍵…事務所関係者か。顔は見えなかったのか？', side: 'left' },
      { speaker: 'ユウト', text: '見えませんでした。でも、手に何か光るものを持ってた気がします', side: 'right' },
      { speaker: 'ヤス', text: 'スマホか…いや、それとも…', side: 'left' },
      { speaker: 'ユウト', text: '探偵さん、莉子さんは無事なんですか？僕、本当に心配で…', side: 'right' }
    ]
  },
  c8s20: {
    title: '契約の裏側',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_47.png',
    bg: 'img/Chapter8/bg/image_merge_bg_talent_agency_meeting_room.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '神崎さん、莉子さんの部屋の合鍵、持っていますね？', side: 'left' },
      { speaker: '神崎', text: '…なぜそれを', side: 'right' },
      { speaker: 'ヤス', text: 'あの夜、あなたがマンションに入るのを目撃した人間がいる', side: 'left' },
      { speaker: '神崎', text: '目撃者…あのストーカーか。確かに僕は行きました。でも莉子はもう部屋にいなかった', side: 'right' },
      { speaker: 'ヤス', text: '何をしに行った？', side: 'left' },
      { speaker: '神崎', text: '…契約書です。彼女が独立を弁護士に相談してる証拠を探しに行きました。見つからなかったけど', side: 'right' }
    ]
  },
  c8s21: {
    title: '隠された場所',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '美羽さん、莉子さんには緊急時に逃げ込む場所はなかったか？', side: 'left' },
      { speaker: '美羽', text: '逃げ込む場所…あ、そういえば田舎の祖母の家。姉が辛い時、よくそこに行ってたって言ってました', side: 'right' },
      { speaker: 'ヤス', text: '住所は？', side: 'left' },
      { speaker: '美羽', text: '祖母は3年前に亡くなって、今は空き家のはずです。でも姉は鍵を持っていたかも…', side: 'right' },
      { speaker: 'ヤス', text: '行ってみよう。莉子さんは自分の意思で姿を消したのかもしれない', side: 'left' },
      { speaker: '美羽', text: '自分の意思で…？', side: 'right' }
    ]
  },
  c8s22: {
    title: '逃避行の果て',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_46.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '橘莉子さん、ここにいたんですね', side: 'left' },
      { speaker: '莉子', text: '…誰ですか、あなた', side: 'right' },
      { speaker: 'ヤス', text: '妹さんに依頼された探偵です。みんな心配してますよ', side: 'left' },
      { speaker: '莉子', text: '美羽が…ごめんなさい、でも、もう限界だったんです。アンチも、ファンも、事務所も、全部が私を消耗させて…', side: 'right' },
      { speaker: 'ヤス', text: 'あの夜、何があったんですか？', side: 'left' },
      { speaker: '莉子', text: 'ストーカーが来て、その後マネージャーまで来て…私はもう誰も信じられなくなった。だから消えることにしたんです', side: 'right' }
    ]
  },
  c8s23: {
    title: '配信者の涙',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_46.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: '脅迫されていましたね。過去の炎上のことで', side: 'left' },
      { speaker: '莉子', text: '…知ってるんですか。あの時も今も、私はネットの悪意に殺されそうになってた', side: 'right' },
      { speaker: 'ヤス', text: 'でも、逃げ続けることが解決にはならない', side: 'left' },
      { speaker: '莉子', text: 'わかってます。でも戦う気力がもうなかったんです。『推される』って、嬉しいだけじゃない。時に呪いのように重くて…', side: 'right' },
      { speaker: 'ヤス', text: '妹さんはあなたを心から心配していた。あなたを"商品"としてではなく、姉として愛してる人がいる', side: 'left' },
      { speaker: '莉子', text: '…美羽', side: 'right' }
    ]
  },
  c8s24: {
    title: '光の中へ',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_46.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ヤス', text: 'ユウトは警察に通報しました。ストーカー行為と脅迫の容疑で。神崎さんも住居侵入で事情聴取を受けます', side: 'left' },
      { speaker: '莉子', text: '神崎さんも…私、これからどうすれば', side: 'right' },
      { speaker: 'ヤス', text: '事務所との契約問題は弁護士を入れて正式に対処しましょう。カナさんの件も含めて、あなたを守る方法はあります', side: 'left' },
      { speaker: '莉子', text: '…配信、またできるかな', side: 'right' },
      { speaker: 'ヤス', text: 'それはあなたが決めることです。ただ、今度は自分を守る術を持って', side: 'left' },
      { speaker: '莉子', text: 'ありがとうございます。美羽に会いたい…ちゃんと謝りたいです', side: 'right' },
      { speaker: 'ヤス', text: 'ああ、彼女もきっと待ってる', side: 'left' }
    ]
  },
  c8s25: {
    title: '再起の配信',
    leftImg: 'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter8/chara/image_merge_order_chara_45.png',
    bg: 'img/Chapter8/bg/image_merge_bg_detective_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: '美羽', text: 'ヤスさん、姉が配信復帰することになりました。今度は個人勢として', side: 'right' },
      { speaker: 'ヤス', text: 'そうか。彼女らしい選択だな', side: 'left' },
      { speaker: '美羽', text: '最初の配信、見てくれますか？リスナーさんにこれまでの経緯を全部話すんだって', side: 'right' },
      { speaker: 'ヤス', text: '勇気がいることだ。でも、隠し事を抱えて潰れるより、真実を語って再出発する方がいい', side: 'left' },
      { speaker: '美羽', text: '姉が言ってました。『悪意は消えないけど、それ以上の応援があることを信じたい』って', side: 'right' },
      { speaker: 'ヤス', text: '…『推し活』の光と闇、か。ネットの向こうにも生身の人間がいる。それを忘れない人が増えることを願うよ', side: 'left' }
    ]
  }
};

const CH8_KANKEI_NODES = [
  { id: 'yasu', label: 'ヤス', img: 'img/Chapter1/Chara/image_merge_order_chara_00.png', fixed: true, x: 400, y: 300 },
  { id: 'miyu', label: '橘 美羽', img: 'img/Chapter8/chara/image_merge_order_chara_45.png' },
  { id: 'riko', label: '橘 莉子', img: 'img/Chapter8/chara/image_merge_order_chara_46.png' },
  { id: 'kanzaki', label: '神崎 蓮', img: 'img/Chapter8/chara/image_merge_order_chara_47.png' },
  { id: 'yuuto', label: '白石 ユウト', img: 'img/Chapter8/chara/image_merge_order_chara_48.png' },
  { id: 'kana', label: '瀬戸 カナ', img: 'img/Chapter8/chara/image_merge_order_chara_49.png' }
];

const CH8_KANKEI_BADGES = [
  { nodeId: 'miyu', badge: '依頼人', color: '#4fc3f7' },
  { nodeId: 'riko', badge: '失踪者', color: '#ba68c8' },
  { nodeId: 'kanzaki', badge: '容疑者', color: '#ef5350' },
  { nodeId: 'yuuto', badge: '容疑者', color: '#ef5350' },
  { nodeId: 'kana', badge: '容疑者', color: '#ef5350' }
];

const CH8_KANKEI_EDGES = [
  { from: 'miyu', to: 'riko', label: '姉妹' },
  { from: 'riko', to: 'kanzaki', label: 'タレントとマネージャー' },
  { from: 'riko', to: 'yuuto', label: 'ストーカー被害' },
  { from: 'riko', to: 'kana', label: '同僚・ライバル' },
  { from: 'kanzaki', to: 'riko', label: '契約トラブル' },
  { from: 'yuuto', to: 'riko', label: '歪んだ愛情' },
  { from: 'kana', to: 'riko', label: '嫉妬・情報漏洩' },
  { from: 'kana', to: 'yuuto', label: '情報提供' },
  { from: 'yasu', to: 'miyu', label: '依頼を受ける' },
  { from: 'yasu', to: 'riko', label: '捜索・発見' }
];

// ADV_SCENESに第8章を追加
Object.assign(ADV_SCENES, CH8_ADV_SCENES);
```