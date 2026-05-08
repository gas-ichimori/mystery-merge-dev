// ========================================
//  Mystery Merge Puzzle - メインロジック
// ========================================

// ========================================
// データ定義
// ========================================

// マージチェーン定義（10種類×最大15段階）
// 各チェーンは emoji と name の配列
const CHAINS = [
  // チェーン0：炎系
  { name: '炎',    stages: ['🔥','🕯️','🪔','🔆','☀️','🌟','✨','💫','🌠','🌌','⚡','🌋','☄️','🌞','🌈'] },
  // チェーン1：水系
  { name: '水',    stages: ['💧','🌊','🫧','🧊','❄️','🌨️','🌧️','⛈️','🌩️','🌀','🌫️','☁️','🌤️','🌥️','🌦️'] },
  // チェーン2：植物系
  { name: '植物',  stages: ['🌱','🌿','🍀','🌾','🌻','🌸','💐','🌺','🌹','🌷','🪷','🍄','🌲','🌳','🌴'] },
  // チェーン3：鉱石系
  { name: '鉱石',  stages: ['🪨','🔩','⚙️','🔧','🪛','🔨','⚒️','🛠️','⚔️','🗡️','🏹','🪃','🛡️','⚜️','👑'] },
  // チェーン4：食べ物系
  { name: '食物',  stages: ['🫐','🍇','🍓','🍒','🍑','🥭','🍍','🥝','🍋','🍊','🍎','🍏','🍐','🍈','🥑'] },
  // チェーン5：動物系
  { name: '動物',  stages: ['🐣','🐥','🐦','🦜','🦚','🦩','🦢','🕊️','🦅','🦁','🐯','🐻','🦊','🐺','🐉'] },
  // チェーン6：宝石系
  { name: '宝石',  stages: ['🪙','💰','💵','💴','💶','💷','💳','💎','🔮','🪄','🎩','🏺','🗝️','🔑','🪬'] },
  // チェーン7：星系
  { name: '星',    stages: ['⭐','🌟','💫','✨','🌠','🌌','🔭','🪐','🌙','🌛','🌜','🌝','🌕','🌑','☀️'] },
  // チェーン8：体力回復系（マージ可能・使用は2回タップ）
  { name: '体力',  stages: ['💊','🧪','🍵','🧃','🥤','💉','🩺','🏥','❤️‍🔥','💖','💗','💓','💞','💝','❤️'], special: 'energy',
    recovery: [1, 4, 8, 32, 100] },
  // チェーン9：魔法系
  { name: '魔法',  stages: ['🪄','🔮','🧿','📿','🪬','🧲','💡','🔦','🕯️','🪔','🔆','🌟','✨','💥','🌈'] },
  // チェーン10：第一章（チュートリアル・メインゲーム共通）
  { name: '第一章', stages: ['📝','🐱','📔','📒','📕','📗','📘','📙','📚','🗂️','🗃️','🏆'],
    stageImages: [
      'img/Chapter1/Icon/image_merge_icon1_01.png','img/Chapter1/Icon/image_merge_icon1_02.png',
      'img/Chapter1/Icon/image_merge_icon1_03.png','img/Chapter1/Icon/image_merge_icon1_04.png',
      'img/Chapter1/Icon/image_merge_icon1_05.png','img/Chapter1/Icon/image_merge_icon1_06.png',
      'img/Chapter1/Icon/image_merge_icon1_07.png','img/Chapter1/Icon/image_merge_icon1_08.png',
      'img/Chapter1/Icon/image_merge_icon1_09.png','img/Chapter1/Icon/image_merge_icon1_10.png',
      'img/Chapter1/Icon/image_merge_icon1_11.png','img/Chapter1/Icon/image_merge_icon1_12.png',
    ],
    stageNames: [
      'メモ帳','猫','猫のおもちゃ','足跡',
      'スニーカー','ダンボール','謎の石','カメラ',
      '証拠写真','破られた写真','相関図のボード','何かを示すボード',
    ]
  },
  // チェーン11：第二章（製造機アイテム）
  { name: '第二章',
    stages: ['🔧','⚙️','🪛','🔩','🛠️','⚒️','⚔️','🗡️','🏹','🪃','🛡️','⚜️','👑','🏆','✨'],
    stageImages: [
      'img/Chapter2/Icon/image_merge_icon2_01.png','img/Chapter2/Icon/image_merge_icon2_02.png',
      'img/Chapter2/Icon/image_merge_icon2_03.png','img/Chapter2/Icon/image_merge_icon2_04.png',
      'img/Chapter2/Icon/image_merge_icon2_05.png','img/Chapter2/Icon/image_merge_icon2_06.png',
      'img/Chapter2/Icon/image_merge_icon2_07.png','img/Chapter2/Icon/image_merge_icon2_08.png',
      'img/Chapter2/Icon/image_merge_icon2_09.png','img/Chapter2/Icon/image_merge_icon2_10.png',
      'img/Chapter2/Icon/image_merge_icon2_11.png','img/Chapter2/Icon/image_merge_icon2_12.png',
      'img/Chapter2/Icon/image_merge_icon2_13.png','img/Chapter2/Icon/image_merge_icon2_14.png',
      'img/Chapter2/Icon/image_merge_icon2_15.png',
    ],
    stageNames: [
      '鍵','鍵束','ICカード','ドアノブ','ドアチェーン',
      '監視カメラ','モニター','双眼鏡','スマートフォン','通知',
      '子供用リュック','スケッチブック','色鉛筆','マンション模型','設計図',
    ]
  },
  // チェーン12：第三章（鑑定台アイテム）※画像は順次追加予定
  { name: '第三章',
    stages: Array(20).fill('🔍'),
    stageImages: [
      'img/Chapter3/icon/image_merge_icon3_01.png','img/Chapter3/icon/image_merge_icon3_02.png',
      'img/Chapter3/icon/image_merge_icon3_03.png','img/Chapter3/icon/image_merge_icon3_04.png',
      'img/Chapter3/icon/image_merge_icon3_05.png','img/Chapter3/icon/image_merge_icon3_06.png',
      'img/Chapter3/icon/image_merge_icon3_07.png','img/Chapter3/icon/image_merge_icon3_08.png',
      'img/Chapter3/icon/image_merge_icon3_09.png','img/Chapter3/icon/image_merge_icon3_10.png',
      'img/Chapter3/icon/image_merge_icon3_11.png','img/Chapter3/icon/image_merge_icon3_12.png',
      'img/Chapter3/icon/image_merge_icon3_13.png','img/Chapter3/icon/image_merge_icon3_14.png',
      'img/Chapter3/icon/image_merge_icon3_15.png','img/Chapter3/icon/image_merge_icon3_16.png',
      'img/Chapter3/icon/image_merge_icon3_17.png','img/Chapter3/icon/image_merge_icon3_18.png',
      'img/Chapter3/icon/image_merge_icon3_19.png','img/Chapter3/icon/image_merge_icon3_20.png',
    ],
    stageNames: [
      '封筒','手紙','遺書','印鑑','通帳',
      '金庫','遺言書','相続証明書','鑑定書','宝石',
      '骨董品','絵画','時計','蔵','土地権利書',
      '家系図','古文書','依頼書','解決の鍵','真相解明ボード',
    ]
  },
  // チェーン13：第四章（設計台アイテム）
  { name: '第四章',
    stages: Array(20).fill('📋'),
    stageImages: [
      'img/Chapter4/icon/image_merge_icon4_01.png','img/Chapter4/icon/image_merge_icon4_02.png',
      'img/Chapter4/icon/image_merge_icon4_03.png','img/Chapter4/icon/image_merge_icon4_04.png',
      'img/Chapter4/icon/image_merge_icon4_05.png','img/Chapter4/icon/image_merge_icon4_06.png',
      'img/Chapter4/icon/image_merge_icon4_07.png','img/Chapter4/icon/image_merge_icon4_08.png',
      'img/Chapter4/icon/image_merge_icon4_09.png','img/Chapter4/icon/image_merge_icon4_10.png',
      'img/Chapter4/icon/image_merge_icon4_11.png','img/Chapter4/icon/image_merge_icon4_12.png',
      'img/Chapter4/icon/image_merge_icon4_13.png','img/Chapter4/icon/image_merge_icon4_14.png',
      'img/Chapter4/icon/image_merge_icon4_15.png','img/Chapter4/icon/image_merge_icon4_16.png',
      'img/Chapter4/icon/image_merge_icon4_17.png','img/Chapter4/icon/image_merge_icon4_18.png',
      'img/Chapter4/icon/image_merge_icon4_19.png','img/Chapter4/icon/image_merge_icon4_20.png',
    ],
    stageNames: [
      '白紙の地図','住宅地図','測量図','土地台帳','都市計画図',
      '建設申請書','改ざんされた申請書','秘密の契約書','内部告発メモ','隠し撮り写真',
      '録音データ','不正送金の明細','証人の供述書','弁護士レター','調査報告書',
      '証拠一式','告発状','逮捕状','判決文','真実のファイル',
    ]
  },
];

// 出力上限（stage 5 まで、6以降は出力不可）
const MAX_OUTPUT_STAGE = 5;

// ジェネレーター解放チェーン（triggerChainId の Lv8 発見 → unlockChainId のジェネレーター解放）
const UNLOCK_CHAIN = [
  { triggerChainId: 0, unlockChainId: 1 }, // 炎 Lv8 → 水
  { triggerChainId: 1, unlockChainId: 2 }, // 水 Lv8 → 植物
  { triggerChainId: 2, unlockChainId: 3 }, // 植物 Lv8 → 鉱石
  { triggerChainId: 3, unlockChainId: 4 }, // 鉱石 Lv8 → 食物
  { triggerChainId: 4, unlockChainId: 5 }, // 食物 Lv8 → 動物
  { triggerChainId: 5, unlockChainId: 6 }, // 動物 Lv8 → 宝石
  { triggerChainId: 6, unlockChainId: 7 }, // 宝石 Lv8 → 星
  { triggerChainId: 7, unlockChainId: 9 }, // 星 Lv8 → 魔法
];

// ジェネレーター定義（10種類、最初は1種類のみ解放）
// chainId: どのチェーンからアイテムを出すか
const GENERATORS = [
  { id: 0, emoji: '🏭', name: 'ファクトリー', chainId: 10, unlocked: true  },
  { id: 1, emoji: '🌊', name: 'ウォーター',   chainId: 1, unlocked: false },
  { id: 2, emoji: '🌱', name: 'ガーデン',     chainId: 2, unlocked: false },
  { id: 3, emoji: '⛏️', name: 'マイン',       chainId: 3, unlocked: false },
  { id: 4, emoji: '🍎', name: 'ファーム',     chainId: 4, unlocked: false },
  { id: 5, emoji: '🐾', name: 'アニマル',     chainId: 5, unlocked: false },
  { id: 6, emoji: '💎', name: 'トレジャー',   chainId: 6, unlocked: false },
  { id: 7, emoji: '🔭', name: 'オブザーバ',   chainId: 7, unlocked: false },
  { id: 8, emoji: '❤️', name: 'ヒーラー',     chainId: 8, unlocked: false }, // 無効化
  { id: 9, emoji: '🧙', name: 'ウィザード',   chainId: 9, unlocked: false },
];

// パワーアップ段階ごとの設定
// powerLevel: 0=通常, 1〜4=パワーアップ
const POWER_CONFIG = [
  { startStage: 1, costMult: 1  },
  { startStage: 2, costMult: 2  },
  { startStage: 4, costMult: 4  },
  { startStage: 5, costMult: 8  },
  { startStage: 6, costMult: 16 }, // 6番目以降は出力不可なので実質使用不可
];

// ステージ別体力消耗（1始まり）
const ENERGY_COST = [1, 2, 4, 8, 16];

// Lucky!判定：ボタンLvごとの確率・倍率設定（確率は毎回10%〜40%でランダム）
const LUCKY_CONFIG = [
  { probMin: 0.05, probMax: 0.20, multMin: 2.0,  multMax: 2.0  }, // Lv1ボタン: ×2固定
  { probMin: 0.05, probMax: 0.20, multMin: 1.5,  multMax: 2.0  }, // Lv2ボタン: ×1.5〜2.0
  { probMin: 0.05, probMax: 0.20, multMin: 1.5,  multMax: 2.0  }, // Lv4ボタン: ×1.5〜2.0
  { probMin: 0.05, probMax: 0.20, multMin: 1.5,  multMax: 2.0  }, // Lv8ボタン: ×1.5〜2.0
  { probMin: 0.05, probMax: 0.20, multMin: 1.1,  multMax: 1.25 }, // Lv16ボタン: ×1.1〜1.25
];

// Power: Lv4/Lv8/Lv16ボタンから確率で高Lvアイテムを出力（確率は10%〜40%ランダム）
const GEN_POWER_BONUS = [
  null,            // powerLv 0 (Lv1ボタン): Powerなし
  null,            // powerLv 1 (Lv2ボタン): Powerなし
  { outStage: 16 },           // powerLv 2 (Lv4ボタン): Lv16出力
  { outStage: 16 },           // powerLv 3 (Lv8ボタン): Lv16出力
  { outStage: null },         // powerLv 4 (Lv16ボタン): 最大Lv出力
];

// しゃぼん玉を割るためのダイヤコスト（インデックス = マージアイテムLv）
const BUBBLE_DIAMOND_COST = [
  0, 0,  // Lv0,1 (未使用)
  2, 4, 6, 8, 16, 32, 64, 128,  // Lv2〜9
  160, 176, 192, 208, 224, 240, 256, 272, 288, 304, 320, // Lv10〜20
];

// コインアイテム定数
const COIN_MAX_LV   = 5;
const COIN_REWARD   = [0, 10, 20, 30, 40, 100]; // インデックス = coinLv
const COIN_EMOJI    = ['', '🪙', '🪙', '🪙', '🪙', '💰'];
const COIN_IMAGES   = [
  null,
  'img/UI/image_merge_icon_coin01.png',
  'img/UI/image_merge_icon_coin02.png',
  'img/UI/image_merge_icon_coin03.png',
  'img/UI/image_merge_icon_coin04.png',
  'img/UI/image_merge_icon_coin04.png', // Lv5: Lv4画像 + 煙アニメーション
];
// しゃぼん玉がコインに変わるまでの時間（ミリ秒）
const BUBBLE_COIN_DELAY_MS = 40000;

// ========================================
// プレイヤーレベル設定
// ========================================
// 現在のレベルでストーリー1話を進めるのに必要なコイン
function getStoryCost(level) {
  if (level <= 1)  return 1000;  // Lv1（Lv2到達前）
  if (level <= 11) return 2000;
  if (level <= 21) return 4000;
  if (level <= 31) return 8000;
  return 16000; // Lv32-41+
}
// 現在のレベルからレベルアップに必要な経験値（コイン換算）
function getLevelUpXP(level) {
  if (level === 1)  return 3000;  // Lv1→Lv2: 3話（1,000×3）
  if (level <= 10) return 10000;
  if (level <= 20) return 20000;
  return 40000; // Lv21-40+
}

// ========================================
// ゲーム状態
// ========================================
const COLS = 7;
const ROWS = 9;
const TOTAL_CELLS = COLS * ROWS;
const COIN_ICON = '<img src="img/UI/image_merge_icon_coin01.png" class="icon-inline" alt="💰">';
const HP_ICON   = '<img src="img/UI/image_merge_navi_hp.png"    class="icon-inline" alt="⚡">';

let state = {
  board: Array(TOTAL_CELLS).fill(null), // null or { chainId, stage }
  energy: 100,
  maxEnergy: 100,
  energyTimer: 0,
  coin: 0,
  diamond: 0,
  generators: [],
  requests: [],      // 最大5件 { chainId, stage, coin }
  chainFirstFillDone: {}, // チェーンごとの初回依頼完了フラグ { chainId: bool }
  chainInitialStages: {}, // チェーンごとの完了済み初期ステージ { chainId: Set<1|2|3> }
  recentlyCompletedStages: new Set(), // 直前の依頼完了で使ったステージ（次の補充で除外）
  permanentlyExcluded: new Set(),    // 二度と出さない依頼 "chainId-stage" 形式（Lv4-9完了済み）
  usedOnceCharIds: new Set(),        // 1回出現したら二度と出さないキャラID（ミユなど）
  selectedCell: null,
  playerLevel: 1,   // プレイヤーレベル
  playerXP: 0,      // 現レベル内の経験値（コイン換算）
  storyCount: 0,    // ストーリー総読了数（コイン支払い回数・XP計算用）
  ch1Count: 0,      // 第一章既読シーン数（0-16）
  ch2Count: 0,      // 第二章既読シーン数（0-21）
  ch3Count: 0,      // 第三章既読シーン数（0-26）
  ch4Count: 0,      // 第四章既読シーン数（0-30）
  pendingUse: null,
  // 発見済みアイテム管理: discovered[chainId][stage] = true
  discovered: {},
  requestCompletedTotal: 0, // 累計依頼完了数（10回ごとに体力+25）
  totalCoinEarned: 0,       // 依頼報酬の累計獲得コイン
  storyGuideShown: false,   // ストーリー誘導ガイド表示済みフラグ
  seenScenes: [],           // 閲覧済みシーンID一覧（第一章見返し用）
  shop: {
    lastFreeEnergy:    0, // 無料体力の最終取得時刻（ms）
    lastCoinEnergy:    0, // コイン購入の最終時刻
    lastDiamondEnergy: 0, // ダイヤ購入の最終時刻
  },
  dailyMission: {
    date:       '',  // YYYY-MM-DD（当日判定用）
    generation: 0,   // 何周目か（目標値算出に使用）
    tasks: [
      { progress: 0, cleared: false, claimed: false }, // アイテムマージ
      { progress: 0, cleared: false, claimed: false }, // 依頼解決
      { progress: 0, cleared: false, claimed: false }, // ダイヤ消費
    ],
  },
};

let catalogCurrentChain = 0;

// ========================================
// ========================================
// デイリーミッション
// ========================================

// タスク定義（generationに応じて目標値が変わる）
function getDailyTaskDefs() {
  const g = state.dailyMission.generation;
  return [
    {
      label:       `アイテムを${100 + g * 50}個マージする`,
      target:      100 + g * 50,
      rewardLabel: `${HP_ICON} +50`,
      rewardFn()   { addEnergy(50, 'デイリーミッション報酬！'); },
    },
    {
      label:       `依頼を${5 + g * 5}個解決する`,
      target:      5 + g * 5,
      rewardLabel: `${HP_ICON} +25`,
      rewardFn()   { addEnergy(25, 'デイリーミッション報酬！'); },
    },
    {
      label:       `${5 + g * 5}個のダイヤを消費する`,
      target:      5 + g * 5,
      rewardLabel: `${HP_ICON} +100`,
      rewardFn()   { addEnergy(100, 'デイリーミッション報酬！'); },
    },
  ];
}

function saveDailyMission() {
  try { localStorage.setItem('dm', JSON.stringify(state.dailyMission)); } catch(e) {}
}

function loadDailyMission() {
  try {
    const s = localStorage.getItem('dm');
    if (s) {
      const d = JSON.parse(s);
      // tasks配列の構造を維持しながらマージ
      if (d && Array.isArray(d.tasks) && d.tasks.length === 3) {
        state.dailyMission = d;
      }
    }
  } catch(e) {}
}

function checkDailyMissionReset() {
  const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD
  if (state.dailyMission.date !== today) {
    if (state.dailyMission.date !== '') {
      state.dailyMission.generation++;
    }
    state.dailyMission.date = today;
    state.dailyMission.tasks.forEach(t => {
      t.progress = 0;
      t.cleared  = false;
      t.claimed  = false;
    });
    saveDailyMission();
  }
}

// 進捗を加算して条件達成チェック
function _advanceDailyTask(idx, amount = 1) {
  const t = state.dailyMission.tasks[idx];
  if (t.cleared) return;
  const defs = getDailyTaskDefs();
  t.progress = Math.min(t.progress + amount, defs[idx].target);
  if (t.progress >= defs[idx].target) {
    t.cleared = true;
    renderDailyMissionBadge();
    showToast(`📋 デイリーミッション達成！${defs[idx].rewardLabel}`);
  }
  saveDailyMission();
}

function trackDailyMerge()           { _advanceDailyTask(0); }
function trackDailyRequest()         { _advanceDailyTask(1); }
function trackDailyDiamond(amount)   { _advanceDailyTask(2, amount); }

// イベントスロットのバッジ（未受け取り報酬あり → ！）更新
function renderDailyMissionBadge() {
  const badge = document.getElementById('daily-mission-badge');
  if (!badge) return;
  const hasUnclaimed = state.dailyMission.tasks.some(t => t.cleared && !t.claimed);
  badge.classList.toggle('hidden', !hasUnclaimed);
}

// ポップアップ内容レンダリング
function renderDailyMissionPopup() {
  const wrap = document.getElementById('daily-mission-tasks');
  if (!wrap) return;
  wrap.innerHTML = '';
  const defs = getDailyTaskDefs();
  defs.forEach((def, i) => {
    const t    = state.dailyMission.tasks[i];
    const pct  = Math.min(t.progress / def.target * 100, 100);
    const card = document.createElement('div');
    card.className = 'daily-task-card' +
      (t.claimed ? ' claimed' : t.cleared ? ' cleared' : '');

    let actionHtml = '';
    if (t.claimed) {
      actionHtml = `<div class="daily-task-done-label">✅ 受取済</div>`;
    } else if (t.cleared) {
      actionHtml = `<button class="daily-task-claim-btn" data-idx="${i}">受け取る</button>`;
    }

    card.innerHTML = `
      <div class="daily-task-name">${def.label}</div>
      <div class="daily-task-progress-wrap">
        <div class="daily-task-progress-bar">
          <div class="daily-task-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="daily-task-progress-text">${t.progress} / ${def.target}</div>
      </div>
      <div class="daily-task-reward">${def.rewardLabel}</div>
      ${actionHtml}
    `;
    wrap.appendChild(card);
  });

  // 受け取るボタンのイベント
  wrap.querySelectorAll('.daily-task-claim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      const t   = state.dailyMission.tasks[idx];
      if (!t.cleared || t.claimed) return;
      t.claimed = true;
      getDailyTaskDefs()[idx].rewardFn();
      saveDailyMission();
      renderDailyMissionPopup();
      renderDailyMissionBadge();
    });
  });
}

// ========================================
// 初期化
// ========================================
function initGame() {
  // ボードをリセット
  state.board = Array(TOTAL_CELLS).fill(null);

  // ジェネレーター状態初期化
  state.generators = GENERATORS.map(g => ({
    ...g,
    powerLevel: 0,         // パワーアップ段階（現在値）
    maxPowerLevel: 0,      // 過去最高Lv（DOWNしても下がらない）
    everLeveledUp: false,  // 一度でもLvアップ（マージ or UP）した履歴
    downgraded: false,     // DOWNされた後まだ元のLvに戻っていない状態
    originalPowerLevel: 0, // DOWN前のLv（複数回DOWNしても元Lvまで追跡）
  }));

  // 解放済みジェネレーターをボードに配置
  state.generators.filter(g => g.unlocked).forEach(gen => {
    const emptyIdx = state.board.findIndex(c => c === null);
    if (emptyIdx !== -1) {
      state.board[emptyIdx] = { isGenerator: true, genId: gen.id };
    }
  });

  // 発見済みアイテム初期化
  state.discovered = {};
  CHAINS.forEach((_, i) => { state.discovered[i] = {}; });

  // 体力回復タイマー
  state.energyTimer = 30;

  // 累計依頼・ショップリセット
  state.requestCompletedTotal = 0;
  state.totalCoinEarned  = 0;
  state.storyGuideShown  = false;
  state.seenScenes       = [];
  state.shop = { lastFreeEnergy: 0, lastCoinEnergy: 0, lastDiamondEnergy: 0 };
  state.chainInitialStages = {};
  state.recentlyCompletedStages = new Set();
  state.permanentlyExcluded = new Set();

  // リクエスト初期化
  state.requests = [];
  fillRequests();

  renderAll();
  startEnergyTimer();
}

// ========================================
// レンダリング
// ========================================
function renderAll() {
  renderBoard();
  renderGenerators();
  renderHeader();
  renderRequest();
}

// ドラッグ状態管理
let drag = {
  active: false,
  fromIdx: null,
  ghost: null,      // ドラッグ中の幽霊要素
  tapHandled: false, // endDragでタップ処理済みフラグ（click二重発火防止）
};

function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  // 同Lvペアの検出（chainId-stage の組み合わせで2個以上あるものをマーク）
  const pairSet = new Set();
  const countMap = {};
  state.board.forEach(item => {
    if (item && !item.isGenerator) {
      const key = `${item.chainId}-${item.stage}`;
      countMap[key] = (countMap[key] || 0) + 1;
      if (countMap[key] >= 2) pairSet.add(key);
    }
  });

  for (let i = 0; i < TOTAL_CELLS; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;

    const item = state.board[i];
    if (item) {
      cell.classList.add('has-item');

      if (item.isGenerator) {
        // ジェネレータータイル
        const gen = state.generators.find(g => g.id === item.genId);
        cell.classList.add('has-generator');
        cell.innerHTML = `
          <span class="item-emoji">${gen.emoji}</span>
          <span class="item-stage">Lv${gen.powerLevel + 1}</span>
        `;
        // マージ可能ハイライト（同種ジェネレーター）
        if (state.selectedCell !== null && state.selectedCell !== i) {
          const sel = state.board[state.selectedCell];
          if (sel && sel.isGenerator && sel.genId === item.genId) {
            cell.classList.add('merge-target');
          }
        }
        if (i === state.selectedCell) cell.classList.add('selected');
      } else {
        // 通常アイテム
        const chain = CHAINS[item.chainId];
        const emoji = chain.stages[item.stage - 1] || '❓';
        const imgSrc = chain.stageImages?.[item.stage - 1];
        cell.innerHTML = imgSrc
          ? `<img class="item-img item-img-lg" src="${imgSrc}" alt="${emoji}">`
          : `<span class="item-emoji">${emoji}</span>`;
        if (i === state.selectedCell) cell.classList.add('selected');
        // マージ可能ハイライト
        if (state.selectedCell !== null && state.selectedCell !== i) {
          const sel = state.board[state.selectedCell];
          if (sel && !sel.isGenerator && sel.chainId === item.chainId && sel.stage === item.stage) {
            cell.classList.add('merge-target');
          }
        }
        // 同Lvペアがあればシェイクヒント
        if (pairSet.has(`${item.chainId}-${item.stage}`)) {
          cell.classList.add('merge-hint');
        }
      }

      // ドラッグ開始（マウス）
      cell.addEventListener('mousedown', (e) => startDrag(e, i));
      // ドラッグ開始（タッチ）
      cell.addEventListener('touchstart', (e) => startDragTouch(e, i), { passive: false });
    }

    cell.addEventListener('click', () => onCellClick(i));
    board.appendChild(cell);
  }
}

// ========================================
// ドラッグ＆ドロップ
// ========================================
function startDrag(e, fromIdx) {
  if (!state.board[fromIdx]) return;
  e.preventDefault();
  drag.active = true;
  drag.fromIdx = fromIdx;
  drag.tapHandled = false;
  createGhost(e.clientX, e.clientY, fromIdx);

  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);
}

function startDragTouch(e, fromIdx) {
  if (!state.board[fromIdx]) return;
  e.preventDefault();
  drag.active = true;
  drag.fromIdx = fromIdx;
  drag.tapHandled = false;
  const t = e.touches[0];
  createGhost(t.clientX, t.clientY, fromIdx);

  document.addEventListener('touchmove', onDragMoveTouch, { passive: false });
  document.addEventListener('touchend', onDragEndTouch);
  document.addEventListener('touchcancel', onDragEndTouch);
}

function createGhost(x, y, fromIdx) {
  const item = state.board[fromIdx];
  const ghost = document.createElement('div');
  ghost.id = 'drag-ghost';
  ghost.style.cssText = `
    position:fixed; pointer-events:none; z-index:999;
    opacity:0.85;
    transform:translate(-50%,-50%);
    left:${x}px; top:${y}px;
  `;

  if (item.isGenerator) {
    const gen = state.generators.find(g => g.id === item.genId);
    ghost.textContent = gen.emoji;
    ghost.style.fontSize = '36px';
  } else {
    const chain = CHAINS[item.chainId];
    const imgSrc = chain.stageImages?.[item.stage - 1];
    if (imgSrc) {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.style.cssText = 'width:52px;height:52px;object-fit:contain;display:block;';
      ghost.appendChild(img);
    } else {
      ghost.textContent = chain.stages[item.stage - 1] || '❓';
      ghost.style.fontSize = '36px';
    }
  }

  document.body.appendChild(ghost);
  drag.ghost = ghost;
}

function onDragMove(e) {
  if (!drag.ghost) return;
  drag.ghost.style.left = e.clientX + 'px';
  drag.ghost.style.top  = e.clientY + 'px';
  highlightDropTarget(e.clientX, e.clientY);
}

function onDragMoveTouch(e) {
  e.preventDefault();
  if (!drag.ghost) return;
  const t = e.touches[0];
  drag.ghost.style.left = t.clientX + 'px';
  drag.ghost.style.top  = t.clientY + 'px';
  highlightDropTarget(t.clientX, t.clientY);
}

function onDragEnd(e) {
  endDrag(e.clientX, e.clientY);
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
}

function onDragEndTouch(e) {
  const t = e.changedTouches?.[0];
  if (t) endDrag(t.clientX, t.clientY);
  else {
    // touchcancel 等でタッチ座標が取れない場合の強制クリーンアップ
    if (drag.ghost) { drag.ghost.remove(); drag.ghost = null; }
    document.getElementById('drag-ghost')?.remove();
    drag.active = false;
    drag.fromIdx = null;
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('drop-over'));
    renderBoard(); // 残像を消す
  }
  document.removeEventListener('touchmove', onDragMoveTouch);
  document.removeEventListener('touchend', onDragEndTouch);
  document.removeEventListener('touchcancel', onDragEndTouch);
}

function endDrag(x, y) {
  if (drag.ghost) { drag.ghost.remove(); drag.ghost = null; }
  if (!drag.active) return;

  const toIdx = getCellIndexAt(x, y);
  const fromIdx = drag.fromIdx;

  drag.active = false;
  drag.fromIdx = null;
  document.querySelectorAll('.cell').forEach(c => c.classList.remove('drop-over'));

  if (toIdx !== null && toIdx !== fromIdx) {
    // 別セルへのドロップ
    dropItem(fromIdx, toIdx);
  } else {
    // タップ（同一セル）→ ジェネレーターはここで直接処理
    // touchstartのpreventDefault後はclickイベントが発火しないため
    const item = state.board[fromIdx];
    if (item && item.isGenerator) {
      drag.tapHandled = true; // clickイベントでの二重処理を防ぐ
      onGeneratorClick(item.genId);
      return;
    }
    renderBoard();
  }
}

function highlightDropTarget(x, y) {
  document.querySelectorAll('.cell').forEach(c => c.classList.remove('drop-over'));
  const idx = getCellIndexAt(x, y);
  if (idx !== null && idx !== drag.fromIdx) {
    const cells = document.querySelectorAll('.cell');
    cells[idx]?.classList.add('drop-over');
  }
}

function getCellIndexAt(x, y) {
  const cells = document.querySelectorAll('.cell');
  for (const cell of cells) {
    const rect = cell.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return parseInt(cell.dataset.index);
    }
  }
  return null;
}

function dropItem(fromIdx, toIdx) {
  const fromItem = state.board[fromIdx];
  const toItem   = state.board[toIdx];

  if (!fromItem) return;

  if (!toItem) {
    // 空きセルに移動
    state.board[toIdx]   = fromItem;
    state.board[fromIdx] = null;
  } else if (fromItem.isGenerator && toItem.isGenerator && fromItem.genId === toItem.genId) {
    // 同種ジェネレーター → マージでLvアップ
    mergeGenerators(fromIdx, toIdx);
    return;
  } else if (!fromItem.isGenerator && !toItem.isGenerator &&
             toItem.chainId === fromItem.chainId && toItem.stage === fromItem.stage) {
    // 同種・同段階アイテム → マージ
    state.selectedCell = fromIdx;
    mergeItems(fromIdx, toIdx);
    return;
  } else {
    // 異種 → 入れ替え
    state.board[toIdx]   = fromItem;
    state.board[fromIdx] = toItem;
  }

  state.selectedCell = null;
  renderAll();
}

// ========================================
// ジェネレーターマージ処理（Lvアップ）
// ========================================
function mergeGenerators(fromIdx, toIdx) {
  const item = state.board[fromIdx];
  const gen = state.generators.find(g => g.id === item.genId);
  if (!gen || gen.powerLevel >= 4) {
    showToast('最大レベルです');
    state.selectedCell = null;
    renderAll();
    return;
  }
  gen.powerLevel++;
  gen.maxPowerLevel = Math.max(gen.maxPowerLevel, gen.powerLevel);
  gen.everLeveledUp = true;
  gen.downgraded = false;
  state.board[fromIdx] = null;
  state.selectedCell = null;
  showToast(`${gen.emoji} ${gen.name} Lv${gen.powerLevel + 1} にパワーアップ！`);
  trackDailyMerge();
  // 体力ボーナス
  if (gen.powerLevel === 4) addEnergy(100, '最大レベル達成ボーナス！');
  else addEnergy(25, 'Lvアップボーナス！');

  renderAll();
  triggerMergeAnim('#board', toIdx);
}


function renderGenerators() {
  const container = document.getElementById('generators');
  container.innerHTML = '';

  state.generators.filter(g => g.unlocked && g.id !== 8).forEach(gen => {
    const canDown = gen.powerLevel > 0;
    // UPボタンはDOWNした後のみ表示（通常のLvアップはタイルマージのみ）
    const canUp = gen.downgraded && canGeneratorLevelUp(gen);

    if (!canDown && !canUp) return;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:3px;';

    // ジェネレーター名ラベル
    const label = document.createElement('div');
    label.style.cssText = 'font-size:9px;color:#aaa;text-align:center;white-space:nowrap;';
    label.textContent = `${gen.emoji} Lv${gen.powerLevel + 1}`;
    wrap.appendChild(label);

    // UPボタン（DOWN後のみ表示）
    if (canUp) {
      const upBtn = document.createElement('button');
      upBtn.textContent = '▲ UP';
      upBtn.style.cssText = `
        font-size:9px; padding:2px 6px; background:#2a3a6a; border:1px solid #f1c40f;
        border-radius:4px; color:#f1c40f; cursor:pointer; width:60px;
      `;
      upBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onGeneratorLevelUp(gen.id);
      });
      wrap.appendChild(upBtn);
    }

    // DOWNボタン
    if (canDown) {
      const downBtn = document.createElement('button');
      downBtn.textContent = '▼ DOWN';
      downBtn.style.cssText = `
        font-size:9px; padding:2px 6px; background:#333; border:1px solid #666;
        border-radius:4px; color:#aaa; cursor:pointer; width:60px;
      `;
      downBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onGeneratorLevelDown(gen.id);
      });
      wrap.appendChild(downBtn);
    }

    container.appendChild(wrap);
  });
}

function renderHeader() {
  document.getElementById('energy-text').textContent = `${Math.floor(state.energy)}`;
  document.getElementById('coin-display').innerHTML = `${COIN_ICON} ${state.coin}`;
  document.getElementById('diamond-display').textContent = `💎 ${state.diamond}`;
}

// ========================================
// セルクリック処理
// ========================================
function onCellClick(index) {
  const item = state.board[index];

  // 何もない場合
  if (!item) {
    state.selectedCell = null;
    renderBoard();
    return;
  }

  // ジェネレータータイル → タップでアイテム生成
  if (item.isGenerator) {
    // endDragで既に処理済みの場合はスキップ（デスクトップのclick二重発火防止）
    if (drag.tapHandled) {
      drag.tapHandled = false;
      return;
    }
    // 選択状態をリセットしてアイテム生成
    state.selectedCell = null;
    onGeneratorClick(item.genId);
    return;
  }

  const chain = CHAINS[item.chainId];

  // 選択中のセルがある場合
  if (state.selectedCell !== null && state.selectedCell !== index) {
    const selItem = state.board[state.selectedCell];
    if (selItem && selItem.chainId === item.chainId && selItem.stage === item.stage) {
      // マージ実行
      mergeItems(state.selectedCell, index);
      return;
    }
    // 別アイテムを選択
    state.selectedCell = index;
    renderBoard();
    return;
  }

  // 同じセルを2回タップ
  if (state.selectedCell === index) {
    // 体力回復アイテムは2回タップで使用確認
    if (chain.special === 'energy') {
      showUseModal(index);
      return;
    }
    // それ以外は選択解除
    state.selectedCell = null;
    renderBoard();
    return;
  }

  // 新規選択
  state.selectedCell = index;
  renderBoard();
}

// ========================================
// マージアニメーション共通ヘルパー
// ========================================
// boardSelector: '#board' or '#event-board'
// cellIdx: セルインデックス
// 描画後に確実にアニメーションを発火させるため double rAF を使用
function triggerMergeAnim(boardSelector, cellIdx) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const cells = document.querySelectorAll(boardSelector + ' .cell');
      const cell = cells[cellIdx];
      if (!cell) return;
      const target = cell.querySelector('img, .item-emoji, .item-stage') || cell;
      target.animate([
        { transform: 'scale(1)',    offset: 0,    easing: 'ease-in'  },
        { transform: 'scale(0.1)',  offset: 0.3,  easing: 'ease-out' },
        { transform: 'scale(1.25)', offset: 0.75, easing: 'ease-out' },
        { transform: 'scale(1)',    offset: 1                         }
      ], {
        duration: 750,
        fill: 'none'
      });
    });
  });
}

// ========================================
// マージ処理
// ========================================
function mergeItems(fromIdx, toIdx) {
  const item = state.board[fromIdx];
  const nextStage = item.stage + 1;

  if (nextStage > 15) {
    // 最大段階
    state.selectedCell = null;
    renderBoard();
    return;
  }

  // マージ後のアイテムを配置
  state.board[toIdx] = { chainId: item.chainId, stage: nextStage };
  state.board[fromIdx] = null;
  state.selectedCell = null;
  discoverItem(item.chainId, nextStage, toIdx, 'board');
  trackDailyMerge();

  // リクエスト完了チェック
  checkRequestComplete();

  renderAll();
  triggerMergeAnim('#board', toIdx);
}

// ========================================
// ジェネレーターレベルアップ条件チェック
// ========================================

// 各レベルに必要なマージアイテムのステージ（いずれかのチェーンで発見済みが条件）
const GEN_LEVELUP_STAGE = [4, 8, 12, 16]; // Lv1→2, Lv2→3, Lv3→4, Lv4→5

function canGeneratorLevelUp(gen) {
  if (gen.powerLevel >= 4) return false;

  // 自チェーンで該当ステージを発見済みであること
  const requiredStage = GEN_LEVELUP_STAGE[gen.powerLevel];
  const chainDisc = state.discovered[gen.chainId] || {};
  if (!chainDisc[requiredStage]) return false;

  return true;
}

// ========================================
// ジェネレーターレベルアップ・ダウン
// ========================================
function onGeneratorLevelUp(genId) {
  const gen = state.generators.find(g => g.id === genId);
  if (!gen) return;
  if (!canGeneratorLevelUp(gen)) {
    showToast('レベルアップ条件を満たしていません');
    return;
  }

  if (!gen.everLeveledUp) {
    // 未Lvアップ: マージ用タイルをもう1枚ボードに出現（自動出現の補完）
    const tilesOnBoard = state.board.filter(c => c?.isGenerator && c.genId === genId).length;
    if (tilesOnBoard < 2) {
      const emptyIdx = state.board.findIndex(c => c === null);
      if (emptyIdx === -1) {
        const genCellIdx = state.board.findIndex(c => c?.isGenerator && c.genId === genId);
        showBoardFullToast(genCellIdx, false);
        return;
      }
      state.board[emptyIdx] = { isGenerator: true, genId };
      showToast(`${gen.emoji} ${gen.name} がボードに出現！マージしてLvアップ！`);
      renderAll();
      return;
    }
  }
  // Lvアップ済み or 2枚あり: タイル出現なし、既存タイルを直接Lvアップ
  const giveBonus = !gen.downgraded;
  let kept = 0;
  for (let i = 0; i < state.board.length; i++) {
    if (state.board[i]?.isGenerator && state.board[i].genId === genId) {
      if (kept === 0) kept++;
      else state.board[i] = null;
    }
  }
  gen.powerLevel++;
  gen.maxPowerLevel = Math.max(gen.maxPowerLevel, gen.powerLevel);
  gen.everLeveledUp = true;
  // 元のLvまで戻ったら downgraded を解除
  if (gen.powerLevel >= gen.originalPowerLevel) {
    gen.downgraded = false;
    gen.originalPowerLevel = gen.powerLevel;
  }
  showToast(`${gen.emoji} ${gen.name} Lv${gen.powerLevel + 1} にレベルアップ！`);
  // 体力ボーナス（DOWNからの復帰は除外）
  if (giveBonus) {
    if (gen.powerLevel === 4) addEnergy(100, '最大レベル達成ボーナス！');
    else addEnergy(25, 'Lvアップボーナス！');
  }
  renderAll();
}

function onGeneratorLevelDown(genId) {
  const gen = state.generators.find(g => g.id === genId);
  if (!gen || gen.powerLevel <= 0) return;
  // 初回DOWNのとき元のLvを記録
  if (!gen.downgraded) gen.originalPowerLevel = gen.powerLevel;
  gen.powerLevel--;
  gen.downgraded = true;
  showToast(`${gen.name} Lv${gen.powerLevel + 1} にレベルダウン`);
  renderAll();
}

// ========================================
// ジェネレータークリック（アイテム生成）
// ========================================
function onGeneratorClick(genId) {
  const gen = state.generators.find(g => g.id === genId);
  if (!gen) return;

  const cfg = POWER_CONFIG[gen.powerLevel];
  const startStage = cfg.startStage;
  const cost = ENERGY_COST[gen.powerLevel]; // Lv1=1, Lv2=2, Lv3=4, Lv4=8, Lv5=16

  // 出力不可チェック（stage6以上）
  if (startStage > MAX_OUTPUT_STAGE) {
    showToast('出力できません（段階上限）');
    return;
  }

  // 体力チェック（テスト中は無限）
  // if (state.energy < cost) {
  //   showToast(`体力が足りません（必要: ${cost}）`);
  //   return;
  // }

  // 空きセルを探す
  const emptyIdx = state.board.findIndex(c => c === null);
  if (emptyIdx === -1) {
    const genCellIdx = state.board.findIndex(c => c?.isGenerator && c.genId === genId);
    showBoardFullToast(genCellIdx, false);
    return;
  }

  // Power → Lucky の順で判定（Power優先、どちらも発動しない場合は通常出力）
  const chainMaxStage = CHAINS[gen.chainId].stages.length;
  let outputStage = startStage;
  let isLucky = false, isPower = false;

  const powerStage = rollPower(gen.powerLevel, chainMaxStage);
  if (powerStage !== null) {
    outputStage = powerStage;
    isPower = true;
  } else {
    const luckyMult = rollLucky(gen.powerLevel);
    if (luckyMult !== null) {
      const ls = Math.min(Math.floor(startStage * luckyMult), chainMaxStage);
      if (ls > startStage) { outputStage = ls; isLucky = true; }
    }
  }

  // 体力消耗・アイテム配置
  state.energy -= cost;
  state.board[emptyIdx] = { chainId: gen.chainId, stage: outputStage };
  discoverItem(gen.chainId, outputStage, emptyIdx, 'board');

  // ジェネレータータイルから対象セルへ飛び出す演出
  const genCellIdx = state.board.findIndex((c, i) => i !== emptyIdx && c?.isGenerator && c.genId === genId);
  const showCellId = genCellIdx !== -1 ? genCellIdx : emptyIdx;
  const emoji = CHAINS[gen.chainId].stages[outputStage - 1];
  flyItemAnimation(showCellId, emptyIdx, emoji);
  if (isPower) showPowerOnCell(showCellId, 'board');
  else if (isLucky) showLuckyOnCell(showCellId, 'board');

  renderAll();
}

// Lucky! テキストをアイテムセルの上にフェードアウト表示
// Lucky判定ヘルパー：倍率を返す（発動しない場合はnull）
function rollLucky(powerLv) {
  const cfg = LUCKY_CONFIG[powerLv] ?? LUCKY_CONFIG[0];
  const prob = cfg.probMin + Math.random() * (cfg.probMax - cfg.probMin);
  if (Math.random() < prob) {
    return cfg.multMin + Math.random() * (cfg.multMax - cfg.multMin);
  }
  return null;
}

// Power判定ヘルパー：出力ステージを返す（発動しない場合はnull）
function rollPower(powerLv, chainMaxStage) {
  const bonus = GEN_POWER_BONUS[powerLv];
  if (!bonus) return null;
  const stage = bonus.outStage !== null ? Math.min(bonus.outStage, chainMaxStage) : chainMaxStage;
  if (stage >= chainMaxStage) return null; // 最大レベルアイテムはパワーアップでは出力しない
  if (Math.random() < 0.05) return stage;  // Power確率 5% 固定
  return null;
}

// ジェネレーターセル近くに特殊テキスト（Lucky!/Power!）を表示
function showSpecialOnCell(cellIdx, boardId, text, color) {
  setTimeout(() => {
    const cells = document.querySelectorAll(`#${boardId} .cell`);
    const cell = cells[cellIdx];
    if (!cell) return;
    const rect = cell.getBoundingClientRect();
    const el = document.createElement('div');
    el.innerHTML = text;
    el.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top}px;
      transform: translate(-50%, -100%) scale(1.2);
      color: ${color};
      font-size: 13px;
      font-weight: bold;
      pointer-events: none;
      z-index: 200;
      text-shadow: 0 1px 4px #000;
      white-space: nowrap;
      animation: lucky-fade 1.4s ease-out forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }, 750);
}

function showLuckyOnCell(cellIdx, boardId = 'board') {
  showSpecialOnCell(cellIdx, boardId, '🍀 Lucky!', '#4cff6e');
}

function showPowerOnCell(cellIdx, boardId = 'board') {
  showSpecialOnCell(cellIdx, boardId, `${HP_ICON} Power!`, '#e74c3c');
}

// アイテムが fromIdx セルから toIdx セルへ湾曲しながら飛ぶアニメーション
function flyItemAnimation(fromIdx, toIdx, emoji) {
  const cells = document.querySelectorAll('.cell');
  const fromCell = cells[fromIdx];
  const toCell   = cells[toIdx];
  if (!fromCell || !toCell) return;

  const fromRect = fromCell.getBoundingClientRect();
  const toRect   = toCell.getBoundingClientRect();

  // 始点・終点の中心座標
  const startX = fromRect.left + fromRect.width  / 2;
  const startY = fromRect.top  + fromRect.height / 2;
  const endX   = toRect.left   + toRect.width    / 2;
  const endY   = toRect.top    + toRect.height   / 2;

  // ベジェ曲線の制御点：距離に比例して上方向にアーチを張る
  const dist      = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const arcHeight = Math.max(50, dist * 0.45);
  const cpX = (startX + endX) / 2;
  const cpY = (startY + endY) / 2 - arcHeight;

  const el = document.createElement('div');
  el.textContent = emoji;
  el.style.cssText = `
    position: fixed;
    left: 0; top: 0;
    font-size: 30px;
    line-height: 1;
    pointer-events: none;
    z-index: 100;
    opacity: 0;
    will-change: transform, opacity;
  `;
  document.body.appendChild(el);

  const DURATION = 750; // ms（ゆっくり）
  const startTime = performance.now();

  function animate(now) {
    const raw = Math.min((now - startTime) / DURATION, 1);

    // 二次ベジェ曲線で位置を計算
    const x = (1 - raw) * (1 - raw) * startX + 2 * (1 - raw) * raw * cpX + raw * raw * endX;
    const y = (1 - raw) * (1 - raw) * startY + 2 * (1 - raw) * raw * cpY + raw * raw * endY;

    // スケール：ふわっと膨らんで着地で縮む
    const scale = raw < 0.4
      ? 0.5 + raw * 2.5          // 0.5 → 1.5（膨らむ）
      : 1.5 - (raw - 0.4) * 1.2; // 1.5 → 0.9（縮む）

    // 不透明度：最初にふわっと現れ、終盤でフェードアウト
    const opacity = raw < 0.15
      ? raw / 0.15               // 0→1 フェードイン
      : raw > 0.75
        ? (1 - raw) / 0.25       // 1→0 フェードアウト
        : 1;

    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
    el.style.opacity   = opacity;

    if (raw < 1) {
      requestAnimationFrame(animate);
    } else {
      el.remove();
    }
  }

  requestAnimationFrame(animate);
}

// ========================================
// リクエスト処理
// ========================================

// ジェネレーターの最大パワーレベルを取得（そのチェーンの中で最高）
function getMaxPowerLevel(chainId) {
  const gen = state.generators.find(g => g.chainId === chainId && g.unlocked);
  return gen ? gen.powerLevel : 0;
}

// パワーレベルに対応するステージ範囲
// Lv1(0): 1〜4, Lv2(1): 4〜8, Lv3(2): 8〜12, Lv4(3): 12〜16, Lv5(4): 16〜20
// 依頼人定義（画像対応）
const REQUESTERS = [
  // 第一章（id: 0-5）
  { id: 0, name: '依頼人①', img: 'img/Chapter1/Chara/image_merge_order_chara_00.png' },
  { id: 1, name: '依頼人②', img: 'img/Chapter1/Chara/image_merge_order_chara_01a.png' },
  { id: 2, name: '依頼人③', img: 'img/Chapter1/Chara/image_merge_order_chara_02.png' },
  { id: 3, name: '依頼人④', img: 'img/Chapter1/Chara/image_merge_order_chara_03.png' },
  { id: 4, name: '依頼人⑤', img: 'img/Chapter1/Chara/image_merge_order_chara_04.png' },
  { id: 5, name: '依頼人⑥', img: 'img/Chapter1/Chara/image_merge_order_chara_05.png' },
  // 第二章（id: 6-10）
  { id: 6,  name: 'ジン',   img: 'img/Chapter2/Chara/image_merge_order_chara_06a.png' },
  { id: 7,  name: 'リナ',   img: 'img/Chapter2/Chara/image_merge_order_chara_07.png' },
  { id: 8,  name: 'ユウ',   img: 'img/Chapter2/Chara/image_merge_order_chara_08.png' },
  { id: 9,  name: 'ハルト', img: 'img/Chapter2/Chara/image_merge_order_chara_09a.png' },
  { id: 10, name: 'タツオ', img: 'img/Chapter2/Chara/image_merge_order_chara_10.png' },
  // 第三章（id: 11-17）
  { id: 11, name: 'フミコ',   img: 'img/Chapter3/chara/image_merge_order_chara_15.png' },
  { id: 12, name: 'コウジ',   img: 'img/Chapter3/chara/image_merge_order_chara_16.png' },
  { id: 13, name: 'サチコ',   img: 'img/Chapter3/chara/image_merge_order_chara_17.png' },
  { id: 14, name: 'ノブオ',   img: 'img/Chapter3/chara/image_merge_order_chara_18.png' },
  { id: 15, name: 'ミドリ',   img: 'img/Chapter3/chara/image_merge_order_chara_19.png' },
  { id: 16, name: 'リョウタ', img: 'img/Chapter3/chara/image_merge_order_chara_20.png' },
  { id: 17, name: 'アキラ',   img: 'img/Chapter3/chara/image_merge_order_chara_21.png' },
  // 第四章（id: 18-22）
  { id: 18, name: 'タケシ',   img: 'img/Chapter4/chara/image_merge_order_chara_22.png' },
  { id: 19, name: 'レイコ',   img: 'img/Chapter4/chara/image_merge_order_chara_23.png' },
  { id: 20, name: 'カズヤ',   img: 'img/Chapter4/chara/image_merge_order_chara_24.png' },
  { id: 21, name: 'ハルカ',   img: 'img/Chapter4/chara/image_merge_order_chara_25.png' },
  { id: 22, name: 'シゲル',   img: 'img/Chapter4/chara/image_merge_order_chara_26.png' },
];

const STAGE_RANGE = [
  [1,  4 ],
  [4,  8 ],
  [8,  12],
  [12, 16],
  [16, 20],
];

// ジェネレーター最大Lvに応じた依頼ステージのティア設定
// permanentMax: このLv以下は完了後二度と出ない
// repeatMax:    このLv以下は繰り返し可（但し直後は出ない）
const STAGE_TIER_CONFIG = [
  { permanentMin: 4, permanentMax:  8, repeatMin:  9, repeatMax: 12 }, // Tier1: gen最大Lv1-2
  { permanentMin: 9, permanentMax: 13, repeatMin: 14, repeatMax: 17 }, // Tier2: gen最大Lv3
  { permanentMin:14, permanentMax: 17, repeatMin: 18, repeatMax: 20 }, // Tier3: gen最大Lv4-5
];

function getStageTierConfig(gen) {
  const m = gen.maxPowerLevel; // 0=Lv1, 1=Lv2, 2=Lv3, 3=Lv4, 4=Lv5
  if (m <= 1) return STAGE_TIER_CONFIG[0];
  if (m === 2) return STAGE_TIER_CONFIG[1];
  return STAGE_TIER_CONFIG[2];
}

// コイン報酬計算（ステージ範囲に応じて100〜20,000）、10の位は四捨五入
// Lv4以降は2/3に設定
function calcCoinReward(stage) {
  const ratio = (stage - 1) / 19; // stage 1〜20 を 0〜1 に正規化
  const raw = 100 + (20000 - 100) * Math.pow(ratio, 1.5);
  const base = Math.round(raw / 10) * 10;
  if (stage >= 4) return Math.round((base * 2 / 3) / 10) * 10;
  return base;
}

// ランダムに1つのアイテムを生成（チェーン・ステージ）
// アイテムを1つ生成。
// ・チェーンのイントロ（Lv1-3）が未完了なら Lv1-3 の未完了ステージを生成
// ・イントロ完了済みチェーンは Lv4+ を生成
// excludeStages: 生成を禁止するstageの集合（イントロのLv重複防止）
// lv4Only: true の場合 Lv4+ のみ生成（2個目アイテム用）
function generateOneItem(excludeStages, lv4Only = false) {
  const unlocked = state.generators.filter(g => g.unlocked && g.chainId !== 8);
  if (unlocked.length === 0) return null;

  // 依頼に絶対出さないアイテム（chain10のstage1とstage2）
  const BLOCKED_ITEMS = new Set(['10-1', '10-2']);

  for (let attempt = 0; attempt < 60; attempt++) {
    const gen = unlocked[Math.floor(Math.random() * unlocked.length)];
    const chainIntroSet  = state.chainInitialStages[gen.chainId] || new Set();
    const chainIntroDone = chainIntroSet.size >= 3;

    if (!chainIntroDone && !lv4Only) {
      // このチェーンのイントロ未完了 → Lv1-3 の未完了ステージをピック
      const candidates = [1, 2, 3].filter(
        s => !chainIntroSet.has(s) && !excludeStages.has(s)
      );
      if (candidates.length === 0) continue;
      const stage = candidates[Math.floor(Math.random() * candidates.length)];
      if (BLOCKED_ITEMS.has(`${gen.chainId}-${stage}`)) continue;
      return { chainId: gen.chainId, stage, isInitial: true };
    } else {
      // イントロ完了済み or 2個目 → ティア設定に基づくLv4+
      const tierCfg = getStageTierConfig(gen);
      const minS = tierCfg.permanentMin;
      const maxS = Math.min(tierCfg.repeatMax, CHAINS[gen.chainId].stages.length);
      if (minS >= maxS) continue; // チェーン長が足りなければスキップ
      const stage = Math.floor(Math.random() * (maxS - minS)) + minS;
      if (excludeStages.has(stage)) continue;
      if (state.permanentlyExcluded.has(`${gen.chainId}-${stage}`)) continue;
      if (BLOCKED_ITEMS.has(`${gen.chainId}-${stage}`)) continue;
      return { chainId: gen.chainId, stage, isInitial: false };
    }
  }
  return null;
}

// 依頼人1人分の依頼を生成
// イントロ依頼（Lv1-3）は1アイテム固定、Lv4+ はランダムに1〜2アイテム
function generateRequesterRequest(characterId, excludeStages) {
  const firstItem = generateOneItem(excludeStages);
  if (!firstItem) return null;
  const items = [{ chainId: firstItem.chainId, stage: firstItem.stage }];
  if (!firstItem.isInitial && Math.random() < 0.5) {
    const exclude2 = new Set([...excludeStages, firstItem.stage]);
    const second = generateOneItem(exclude2, true); // 2個目はLv4+のみ
    if (second) items.push({ chainId: second.chainId, stage: second.stage });
  }
  const coin = items.reduce((sum, item) => sum + calcCoinReward(item.stage), 0);
  return { characterId, items, coin };
}

// 依頼を補充
// ・いずれかのチェーンのイントロ（Lv1-3全完了）が済んでいれば最大5人、未済なら最大3人
// ・イントロ未完了チェーンのLv1-3は重複Lv禁止、Lv4+は重複チェックなし
// ・イントロ完了済みチェーンのLv1-3残存依頼は除去
function fillRequests() {
  const MIN_SLOTS = 3;
  // いずれか1チェーンでもイントロ完了 → Lv4+モード（最大5人）
  const anyIntroDone = Object.values(state.chainInitialStages).some(s => s && s.size >= 3);
  const maxSlots = anyIntroDone ? 5 : 3;

  // イントロ完了済みチェーンのLv1-3依頼を除去（古い依頼の掃除）
  state.requests = state.requests.filter(r =>
    r.items.every(it => {
      const introSet  = state.chainInitialStages[it.chainId] || new Set();
      return it.stage >= 4 || introSet.size < 3; // Lv4+ or そのチェーンがまだイントロ中
    })
  );

  // 補充ヘルパー（extraExclude: 追加で除外するステージ集合）
  function doFill(extraExclude) {
    const usedCharIds = new Set(state.requests.map(r => r.characterId));
    const usedStages = new Set([
      ...state.requests.flatMap(r => r.items.map(it => it.stage)),
      ...extraExclude,
    ]);
    const available = REQUESTERS.filter(r => !usedCharIds.has(r.id) && !state.usedOnceCharIds.has(r.id));
    let retry = 0;
    while (state.requests.length < maxSlots && available.length > 0 && retry < 50) {
      const ci = Math.floor(Math.random() * available.length);
      const character = available[ci];
      const req = generateRequesterRequest(character.id, usedStages);
      if (!req) { retry++; continue; }
      state.requests.push(req);
      req.items.forEach(it => usedStages.add(it.stage));
      available.splice(ci, 1);
      retry = 0;
    }
  }

  // まず「直前完了ステージ除外」付きで補充
  doFill(state.recentlyCompletedStages);

  // 最低3件に満たない場合、除外を緩めて再補充
  if (state.requests.length < MIN_SLOTS) {
    doFill(new Set());
  }

  // 補充完了後にリセット（次回以降は再び候補に戻す）
  state.recentlyCompletedStages = new Set();
}

// 依頼が達成可能か確認（同じアイテムが複数要求される場合も考慮）
function requestCompletable(req) {
  const boardCopy = state.board.map(x => x);
  for (const item of req.items) {
    const idx = boardCopy.findIndex(b => b && !b.isGenerator && b.chainId === item.chainId && b.stage === item.stage);
    if (idx === -1) return false;
    boardCopy[idx] = null;
  }
  return true;
}

function checkRequestComplete() {
  renderRequest();
}

// ========================================
// 依頼レンダリング
// ========================================
function renderRequest() {
  const panel = document.getElementById('request-slots-wrap');
  panel.innerHTML = '<div id="request-label">依頼</div>';

  state.requests.forEach((req, i) => {
    const character = REQUESTERS[req.characterId];
    const completable = requestCompletable(req);

    const itemsHtml = req.items.map(item => {
      const chain = CHAINS[item.chainId];
      const emoji = chain.stages[item.stage - 1] || '❓';
      const imgSrc = chain.stageImages?.[item.stage - 1];
      const icon = imgSrc
        ? `<img class="req-item-img" src="${imgSrc}" alt="${emoji}">`
        : emoji;
      return `<span class="req-item-badge">${icon}</span>`;
    }).join('');

    const charHtml = character?.img
      ? `<img class="req-char-img" src="${character.img}" alt="${character.name}">`
      : `<div class="req-char-figure">${character?.emoji || '👤'}</div>`;

    const div = document.createElement('div');
    div.className = 'request-slot' + (completable ? ' completable' : '');
    div.innerHTML = `
      <div class="req-char-wrap">
        ${charHtml}
      </div>
      <div class="req-slot-frame">
        <div class="req-items">${itemsHtml}</div>
        <div class="req-coin-row">
          <span class="req-coin">${COIN_ICON}${req.coin.toLocaleString()}</span>
          ${completable ? `<button class="req-complete-btn">依頼済</button>` : ''}
        </div>
      </div>
    `;
    if (completable) {
      div.querySelector('.req-complete-btn').addEventListener('click', e => {
        e.stopPropagation();
        completeRequest(i);
      });
    }
    panel.appendChild(div);
  });
}

function completeRequest(index) {
  const req = state.requests[index];
  if (!req) return;

  if (!requestCompletable(req)) {
    showToast('該当アイテムがありません');
    return;
  }

  // ボードからアイテムを消費（重複対応）
  const boardCopy = [...state.board];
  for (const item of req.items) {
    const idx = boardCopy.findIndex(b => b && !b.isGenerator && b.chainId === item.chainId && b.stage === item.stage);
    if (idx !== -1) {
      state.board[idx] = null;
      boardCopy[idx] = null;
    }
  }

  state.coin += req.coin;
  state.totalCoinEarned += req.coin;
  state.requestCompletedTotal++;
  trackDailyRequest();
  checkStoryGuide();
  showRewardInPanel('依頼完了！', document.getElementById('request-panel'), '#ff8c00');
  if (state.requestCompletedTotal % 10 === 0) {
    addEnergy(25, `依頼${state.requestCompletedTotal}回達成ボーナス！`);
  }

  // チェーンごとのイントロ完了ステージを記録
  req.items.forEach(item => {
    state.chainFirstFillDone[item.chainId] = true;
    if (item.stage >= 1 && item.stage <= 3) {
      if (!state.chainInitialStages[item.chainId]) state.chainInitialStages[item.chainId] = new Set();
      state.chainInitialStages[item.chainId].add(item.stage);
    }
    // 直前に完了したステージとして記録（次の補充で除外）
    state.recentlyCompletedStages.add(item.stage);
    // ティアのpermanent範囲なら完了後二度と出さない
    if (item.stage >= 4) {
      const gen = state.generators.find(g => g.chainId === item.chainId && g.unlocked);
      if (gen) {
        const tierCfg = getStageTierConfig(gen);
        if (item.stage >= tierCfg.permanentMin && item.stage <= tierCfg.permanentMax) {
          state.permanentlyExcluded.add(`${item.chainId}-${item.stage}`);
        }
      }
    }
  });

  // 1回限りキャラクター（ミユ id:1）は完了後に永続除外
  const ONCE_ONLY_CHAR_IDS = new Set([1]);
  if (ONCE_ONLY_CHAR_IDS.has(req.characterId)) {
    state.usedOnceCharIds.add(req.characterId);
  }

  state.requests.splice(index, 1);
  fillRequests();
  renderAll();
}

// ========================================
// 体力回復アイテム使用
// ========================================
function showUseModal(cellIndex) {
  const item = state.board[cellIndex];
  const chain = CHAINS[item.chainId];
  const recovery = chain.recovery[item.stage - 1];
  const emoji = chain.stages[item.stage - 1];

  state.pendingUse = { cellIndex };

  document.getElementById('use-item-icon').textContent = emoji;
  document.getElementById('use-item-name').textContent = `${chain.name} Lv${item.stage}`;
  document.getElementById('use-item-desc').textContent = `体力を ${recovery} 回復します`;
  document.getElementById('use-modal').classList.remove('hidden');
}

document.getElementById('use-btn').addEventListener('click', () => {
  if (!state.pendingUse) return;
  const { cellIndex } = state.pendingUse;
  const item = state.board[cellIndex];
  const chain = CHAINS[item.chainId];
  const recovery = chain.recovery[item.stage - 1];

  state.energy += recovery;
  state.board[cellIndex] = null;
  state.pendingUse = null;
  state.selectedCell = null;

  document.getElementById('use-modal').classList.add('hidden');
  showToast(`体力 +${recovery}！`);
  renderAll();
});

document.getElementById('cancel-btn').addEventListener('click', () => {
  state.pendingUse = null;
  state.selectedCell = null;
  document.getElementById('use-modal').classList.add('hidden');
  renderBoard();
});

// ========================================
// 体力回復タイマー
// ========================================
function startEnergyTimer() {
  setInterval(() => {
    if (state.energy < state.maxEnergy) {
      state.energyTimer--;
      if (state.energyTimer <= 0) {
        state.energy = Math.min(state.maxEnergy, state.energy + 1);
        state.energyTimer = 30;
        renderHeader();
        renderEventHeader();
      }
      const timerText = `${state.energyTimer}s`;
      document.getElementById('energy-timer').textContent = timerText;
      const evTimer = document.getElementById('ev-energy-timer');
      if (evTimer) evTimer.textContent = timerText;
    } else {
      document.getElementById('energy-timer').textContent = 'MAX';
      const evTimer = document.getElementById('ev-energy-timer');
      if (evTimer) evTimer.textContent = '';
    }
  }, 1000);
}

// ========================================
// アイテム発見処理
// ========================================
function discoverItem(chainId, stage, cellIdx = null, boardId = 'board') {
  if (state.discovered[chainId][stage]) return; // 既発見
  state.discovered[chainId][stage] = true;
  state.diamond += 1;
  if (cellIdx !== null) {
    showSpecialOnCell(cellIdx, boardId, '新アイテム発見！', '#f9c846');
  } else {
    showToast('新アイテム発見！');
  }
  renderHeader();

  // Lv8発見で次のジェネレーターを解放（UNLOCK_CHAINに基づく）
  if (stage >= 8) {
    const unlock = UNLOCK_CHAIN.find(u => u.triggerChainId === chainId);
    if (unlock) {
      const nextGen = state.generators.find(g => g.chainId === unlock.unlockChainId);
      if (nextGen && !nextGen.unlocked) {
        nextGen.unlocked = true;
        // ボードにジェネレータータイルを配置
        const emptyIdx = state.board.findIndex(c => c === null);
        if (emptyIdx !== -1) {
          state.board[emptyIdx] = { isGenerator: true, genId: nextGen.id };
        }
        showToast(`${nextGen.emoji} ${nextGen.name}ジェネレーター解放！`);
        // 既存の依頼はそのまま、空きスロットだけ補充
        fillRequests();
      }
    }
  }

  // ジェネレーターLvアップ条件達成 → 対象ジェネレーターのタイルを自動出現
  state.generators.filter(g => g.unlocked && g.chainId === chainId).forEach(gen => {
    const reqStage = GEN_LEVELUP_STAGE[gen.powerLevel];
    if (stage === reqStage && canGeneratorLevelUp(gen)) {
      const tilesOnBoard = state.board.filter(c => c?.isGenerator && c.genId === gen.id).length;
      if (tilesOnBoard < 2) {
        const emptyIdx = state.board.findIndex(c => c === null);
        if (emptyIdx !== -1) {
          state.board[emptyIdx] = { isGenerator: true, genId: gen.id };
          showToast(`${gen.emoji} ${gen.name} がボードに出現！マージしてLvアップ！`);
        }
      }
    }
  });

  // UPボタン・依頼の更新
  renderGenerators();
  fillRequests();
}

// ========================================
// アイテムリスト 発見・解放システム
// ========================================

// 第一章マージアイテムを発見（初回のみ）
function discoverEventItem(stage) {
  if (eventState.discovered[stage]) return;
  eventState.discovered[stage] = true;
  updateCatalogBadge();
}

// 第二章マージアイテムを発見（初回のみ）
function discoverSeizoItem(stage) {
  if (eventState.seizoDiscovered[stage]) return;
  eventState.seizoDiscovered[stage] = true;
  updateCatalogBadge();
  // 第二章マージアイテムが初めて出現したときに赤いメッセージを表示
  if (!eventState.seizoFirstItemShown) {
    eventState.seizoFirstItemShown = true;
    setTimeout(() => showToastRed('第二章のマージアイテムが出現しました！依頼に活用しましょう！'), 600);
  }
}

// 第三章マージアイテムを発見（初回のみ）
function discoverKanteItem(stage) {
  if (eventState.kanteDiscovered[stage]) return;
  eventState.kanteDiscovered[stage] = true;
  updateCatalogBadge();
}

function discoverKeikakuItem(stage) {
  if (eventState.keikakuDiscovered[stage]) return;
  eventState.keikakuDiscovered[stage] = true;
  updateCatalogBadge();
}

// ジェネレーターのレベルを発見（初回のみ）
// genType: 'ch1' / 'ch2', level: 0始まり
function discoverGen(genType, level) {
  const key = `${genType}_${level}`;
  if (eventState.genDiscovered[key]) return;
  eventState.genDiscovered[key] = true;
  updateCatalogBadge();
}

// 未解放アイテムがあるか確認
function hasUnrevealedItems() {
  for (const s of Object.keys(eventState.discovered)) {
    if (eventState.discovered[s] && !eventState.revealed[s]) return true;
  }
  for (const s of Object.keys(eventState.seizoDiscovered)) {
    if (eventState.seizoDiscovered[s] && !eventState.seizoRevealed[s]) return true;
  }
  for (const s of Object.keys(eventState.kanteDiscovered)) {
    if (eventState.kanteDiscovered[s] && !eventState.kanteRevealed[s]) return true;
  }
  for (const s of Object.keys(eventState.keikakuDiscovered)) {
    if (eventState.keikakuDiscovered[s] && !eventState.keikakuRevealed[s]) return true;
  }
  for (const k of Object.keys(eventState.genDiscovered)) {
    if (eventState.genDiscovered[k] && !eventState.genRevealed[k]) return true;
  }
  return false;
}

// カタログボタンのアテンション演出を更新
function updateCatalogBadge() {
  const active = hasUnrevealedItems();
  document.querySelectorAll('.catalog-access-btn').forEach(btn => {
    btn.classList.toggle('catalog-badge-active', active);
  });
}

// アイテムリスト内の「？」をタップして解放（💎+1）
// itemType: 'event' | 'seizo' | 'kante' | 'keikaku' | 'ch1gen' | 'ch2gen' | 'ch3gen' | 'ch4gen'
function revealCatalogItem(itemType, id) {
  if (itemType === 'event') {
    if (!eventState.discovered[id] || eventState.revealed[id]) return;
    eventState.revealed[id] = true;
  } else if (itemType === 'seizo') {
    if (!eventState.seizoDiscovered[id] || eventState.seizoRevealed[id]) return;
    eventState.seizoRevealed[id] = true;
  } else if (itemType === 'kante') {
    if (!eventState.kanteDiscovered[id] || eventState.kanteRevealed[id]) return;
    eventState.kanteRevealed[id] = true;
  } else if (itemType === 'keikaku') {
    if (!eventState.keikakuDiscovered[id] || eventState.keikakuRevealed[id]) return;
    eventState.keikakuRevealed[id] = true;
  } else if (itemType === 'ch1gen') {
    const k = `ch1_${id}`;
    if (!eventState.genDiscovered[k] || eventState.genRevealed[k]) return;
    eventState.genRevealed[k] = true;
  } else if (itemType === 'ch2gen') {
    const k = `ch2_${id}`;
    if (!eventState.genDiscovered[k] || eventState.genRevealed[k]) return;
    eventState.genRevealed[k] = true;
  } else if (itemType === 'ch3gen') {
    const k = `ch3_${id}`;
    if (!eventState.genDiscovered[k] || eventState.genRevealed[k]) return;
    eventState.genRevealed[k] = true;
  } else if (itemType === 'ch4gen') {
    const k = `ch4_${id}`;
    if (!eventState.genDiscovered[k] || eventState.genRevealed[k]) return;
    eventState.genRevealed[k] = true;
  } else { return; }

  state.diamond += 1;
  showToast('💎+1 アイテムを解放しました！');
  renderHeader();
  renderEventHeader();
  updateCatalogBadge();
  renderCatalog();
}

// ========================================
// アイテムリスト レンダリング
// ========================================
function renderCatalog() {
  const tabsEl = document.getElementById('catalog-gen-tabs');
  tabsEl.innerHTML = '';

  const evTab = document.createElement('div');
  evTab.className = 'catalog-tab' + (catalogCurrentChain === 'event' ? ' active' : '');
  evTab.textContent = EVENT_CHAIN.name;
  evTab.addEventListener('click', () => { catalogCurrentChain = 'event'; renderCatalog(); });
  tabsEl.appendChild(evTab);

  if (eventState.fireGenUnlocked) {
    const tab2 = document.createElement('div');
    tab2.className = 'catalog-tab' + (catalogCurrentChain === SEIZO_CHAIN_ID ? ' active' : '');
    tab2.textContent = CHAINS[SEIZO_CHAIN_ID].name;
    tab2.addEventListener('click', () => { catalogCurrentChain = SEIZO_CHAIN_ID; renderCatalog(); });
    tabsEl.appendChild(tab2);
  }

  if (eventState.kanteGenUnlocked) {
    const tab3 = document.createElement('div');
    tab3.className = 'catalog-tab' + (catalogCurrentChain === KANTEITA_CHAIN_ID ? ' active' : '');
    tab3.textContent = CHAINS[KANTEITA_CHAIN_ID].name;
    tab3.addEventListener('click', () => { catalogCurrentChain = KANTEITA_CHAIN_ID; renderCatalog(); });
    tabsEl.appendChild(tab3);
  }

  if (eventState.keikakuGenUnlocked) {
    const tab4 = document.createElement('div');
    tab4.className = 'catalog-tab' + (catalogCurrentChain === KEIKAKU_CHAIN_ID ? ' active' : '');
    tab4.textContent = CHAINS[KEIKAKU_CHAIN_ID].name;
    tab4.addEventListener('click', () => { catalogCurrentChain = KEIKAKU_CHAIN_ID; renderCatalog(); });
    tabsEl.appendChild(tab4);
  }

  const listEl = document.getElementById('catalog-list');
  listEl.innerHTML = '';

  // アイテムカード生成ヘルパー
  // state: 'locked' | 'pending' | 'revealed'
  function makeCard(imgSrc, emoji, lvLabel, name, state, onReveal) {
    const div = document.createElement('div');
    if (state === 'revealed') {
      div.className = 'catalog-item discovered';
      div.innerHTML = imgSrc
        ? `<img class="catalog-img" src="${imgSrc}" alt="${emoji}">`
        : `<span class="catalog-emoji">${emoji}</span>`;
      div.innerHTML += `<span class="catalog-stage">${lvLabel}</span>
                        <span class="catalog-name">${name}</span>`;
    } else if (state === 'pending') {
      div.className = 'catalog-item catalog-pending';
      div.innerHTML = `<button class="catalog-reveal-btn">？</button>
                       <span class="catalog-stage">${lvLabel}</span>
                       <span class="catalog-name">???</span>`;
      div.querySelector('.catalog-reveal-btn').addEventListener('click', onReveal);
    } else {
      // locked
      div.className = 'catalog-item undiscovered';
      div.innerHTML = `<span class="catalog-emoji catalog-locked-q">？</span>
                       <span class="catalog-stage">${lvLabel}</span>
                       <span class="catalog-name">???</span>`;
    }
    return div;
  }

  if (catalogCurrentChain === 'event') {
    // ── ジェネレーター（第一章）
    const genHeader = document.createElement('div');
    genHeader.className = 'catalog-section-header';
    genHeader.textContent = 'ジェネレーター';
    listEl.appendChild(genHeader);

    EVENT_GEN_IMAGES.forEach((imgSrc, idx) => {
      const key = `ch1_${idx}`;
      const disc = !!eventState.genDiscovered[key];
      const rev  = !!eventState.genRevealed[key];
      const lvLabel = `Lv${idx + 1}`;
      const name    = EVENT_GEN_NAMES[idx] ?? lvLabel;
      const itemState = rev ? 'revealed' : disc ? 'pending' : 'locked';
      const card = makeCard(imgSrc, '🗂️', lvLabel, name, itemState, () => revealCatalogItem('ch1gen', idx));
      listEl.appendChild(card);
    });

    // ── マージアイテム（第一章）
    const itemHeader = document.createElement('div');
    itemHeader.className = 'catalog-section-header';
    itemHeader.textContent = 'マージアイテム';
    listEl.appendChild(itemHeader);

    EVENT_CHAIN.stages.forEach((emoji, idx) => {
      const stage = idx + 1;
      const disc  = !!eventState.discovered[stage];
      const rev   = !!eventState.revealed[stage];
      const imgSrc   = EVENT_CHAIN.stageImages[idx];
      const stageName = EVENT_CHAIN.stageNames?.[idx] ?? `${EVENT_CHAIN.name} Lv${stage}`;
      const itemState = rev ? 'revealed' : disc ? 'pending' : 'locked';
      const card = makeCard(imgSrc, emoji, `Lv${stage}`, stageName, itemState, () => revealCatalogItem('event', stage));
      listEl.appendChild(card);
    });

  } else if (catalogCurrentChain === SEIZO_CHAIN_ID) {
    // ── ジェネレーター（第二章）
    const genHeader = document.createElement('div');
    genHeader.className = 'catalog-section-header';
    genHeader.textContent = 'ジェネレーター';
    listEl.appendChild(genHeader);

    SEIZO_GEN_IMAGES.forEach((imgSrc, idx) => {
      const key = `ch2_${idx}`;
      const disc = !!eventState.genDiscovered[key];
      const rev  = !!eventState.genRevealed[key];
      const lvLabel = `Lv${idx + 1}`;
      const name    = SEIZO_GEN_NAMES[idx] ?? lvLabel;
      const itemState = rev ? 'revealed' : disc ? 'pending' : 'locked';
      const card = makeCard(imgSrc, '⚙️', lvLabel, name, itemState, () => revealCatalogItem('ch2gen', idx));
      listEl.appendChild(card);
    });

    // ── マージアイテム（第二章）
    const itemHeader = document.createElement('div');
    itemHeader.className = 'catalog-section-header';
    itemHeader.textContent = 'マージアイテム';
    listEl.appendChild(itemHeader);

    const chain = CHAINS[SEIZO_CHAIN_ID];
    chain.stages.forEach((emoji, idx) => {
      const stage = idx + 1;
      const disc  = !!eventState.seizoDiscovered[stage];
      const rev   = !!eventState.seizoRevealed[stage];
      const imgSrc    = chain.stageImages?.[idx];
      const stageName = chain.stageNames?.[idx] ?? `${chain.name} Lv${stage}`;
      const itemState = rev ? 'revealed' : disc ? 'pending' : 'locked';
      const card = makeCard(imgSrc, emoji, `Lv${stage}`, stageName, itemState, () => revealCatalogItem('seizo', stage));
      listEl.appendChild(card);
    });

  } else if (catalogCurrentChain === KANTEITA_CHAIN_ID) {
    // ── ジェネレーター（第三章）
    const genHeader = document.createElement('div');
    genHeader.className = 'catalog-section-header';
    genHeader.textContent = 'ジェネレーター';
    listEl.appendChild(genHeader);

    KANTEITA_GEN_IMAGES.forEach((imgSrc, idx) => {
      const key = `ch3_${idx}`;
      const disc = !!eventState.genDiscovered[key];
      const rev  = !!eventState.genRevealed[key];
      const lvLabel = `Lv${idx + 1}`;
      const name    = KANTEITA_GEN_NAMES[idx] ?? lvLabel;
      const itemState = rev ? 'revealed' : disc ? 'pending' : 'locked';
      const card = makeCard(imgSrc, '🔬', lvLabel, name, itemState, () => revealCatalogItem('ch3gen', idx));
      listEl.appendChild(card);
    });

    // ── マージアイテム（第三章）
    const itemHeader = document.createElement('div');
    itemHeader.className = 'catalog-section-header';
    itemHeader.textContent = 'マージアイテム';
    listEl.appendChild(itemHeader);

    const kChain = CHAINS[KANTEITA_CHAIN_ID];
    kChain.stages.forEach((emoji, idx) => {
      const stage = idx + 1;
      const disc  = !!eventState.kanteDiscovered[stage];
      const rev   = !!eventState.kanteRevealed[stage];
      const imgSrc    = kChain.stageImages?.[idx];
      const stageName = kChain.stageNames?.[idx] ?? `${kChain.name} Lv${stage}`;
      const itemState = rev ? 'revealed' : disc ? 'pending' : 'locked';
      const card = makeCard(imgSrc, emoji, `Lv${stage}`, stageName, itemState, () => revealCatalogItem('kante', stage));
      listEl.appendChild(card);
    });

  } else if (catalogCurrentChain === KEIKAKU_CHAIN_ID) {
    // ── ジェネレーター（第四章）
    const genHeader = document.createElement('div');
    genHeader.className = 'catalog-section-header';
    genHeader.textContent = 'ジェネレーター';
    listEl.appendChild(genHeader);

    KEIKAKU_GEN_IMAGES.forEach((imgSrc, idx) => {
      const key = `ch4_${idx}`;
      const disc = !!eventState.genDiscovered[key];
      const rev  = !!eventState.genRevealed[key];
      const lvLabel = `Lv${idx + 1}`;
      const name    = KEIKAKU_GEN_NAMES[idx] ?? lvLabel;
      const itemState = rev ? 'revealed' : disc ? 'pending' : 'locked';
      const card = makeCard(imgSrc, '📐', lvLabel, name, itemState, () => revealCatalogItem('ch4gen', idx));
      listEl.appendChild(card);
    });

    // ── マージアイテム（第四章）
    const itemHeader = document.createElement('div');
    itemHeader.className = 'catalog-section-header';
    itemHeader.textContent = 'マージアイテム';
    listEl.appendChild(itemHeader);

    const kkChain = CHAINS[KEIKAKU_CHAIN_ID];
    kkChain.stages.forEach((emoji, idx) => {
      const stage = idx + 1;
      const disc  = !!eventState.keikakuDiscovered[stage];
      const rev   = !!eventState.keikakuRevealed[stage];
      const imgSrc    = kkChain.stageImages?.[idx];
      const stageName = kkChain.stageNames?.[idx] ?? `${kkChain.name} Lv${stage}`;
      const itemState = rev ? 'revealed' : disc ? 'pending' : 'locked';
      const card = makeCard(imgSrc, emoji, `Lv${stage}`, stageName, itemState, () => revealCatalogItem('keikaku', stage));
      listEl.appendChild(card);
    });
  }
}

// ========================================
// 体力加算ヘルパー
// ========================================
function addEnergy(amount, _reason) {
  state.energy += amount;
  showEnergyGain(amount);
  renderHeader();
  renderEventHeader();
}

// 24時間残り時間を返す（null = 取得可能）
const SHOP_COOLDOWN = 24 * 60 * 60 * 1000;
function shopRemaining(lastTs) {
  const rem = SHOP_COOLDOWN - (Date.now() - lastTs);
  if (rem <= 0) return null;
  const h = Math.floor(rem / 3600000);
  const m = Math.floor((rem % 3600000) / 60000);
  return `${h}時間${m}分`;
}

// ========================================
// トースト通知
// ========================================
function showToast(msg) {
  const el = document.createElement('div');
  el.innerHTML = msg;
  el.style.cssText = `
    position: fixed; bottom: 14px; left: 50%; transform: translateX(-50%);
    background: rgba(0,0,0,0.82); color: #fff; padding: 6px 14px;
    border-radius: 16px; font-size: 12px; z-index: 500;
    pointer-events: none; max-width: 80vw; text-align: center;
    white-space: normal; word-break: break-all;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// ========================================
// 章完了バナー演出
// ========================================
// imgSrc: 表示する画像パス
// displayMs: 表示時間（ミリ秒、デフォルト 2800ms）
function showChapterCompleteBanner(imgSrc, displayMs = 1800) {
  // 既存オーバーレイがあれば即削除
  document.getElementById('chapter-complete-overlay')?.remove();
  document.getElementById('chapter-complete-flash')?.remove();

  // 白背景（バナー表示中ずっと維持）
  const flash = document.createElement('div');
  flash.id = 'chapter-complete-flash';
  flash.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:8999;opacity:0;pointer-events:none;transition:opacity 0.15s ease-in';
  document.body.appendChild(flash);

  // バナー本体
  const overlay = document.createElement('div');
  overlay.id = 'chapter-complete-overlay';
  overlay.style.zIndex = '9000'; // 白背景の上
  const img = document.createElement('img');
  img.className = 'chapter-complete-img';
  img.src = imgSrc;
  img.alt = '章完了';
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  // 白背景フェードイン → バナースタンプアニメ開始
  requestAnimationFrame(() => {
    flash.style.opacity = '1';
    setTimeout(() => {
      requestAnimationFrame(() => overlay.classList.add('fade-in'));
    }, 150);
  });

  // タップで即消去
  overlay.addEventListener('click', () => dismiss());

  // 自動消去
  const timer = setTimeout(() => dismiss(), displayMs);

  function dismiss() {
    clearTimeout(timer);
    overlay.removeEventListener('click', dismiss);
    // バナーと白背景を同時にフェードアウト
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    flash.style.transition = 'opacity 0.4s ease-out';
    flash.style.opacity = '0';
    overlay.addEventListener('animationend', () => {
      overlay.remove();
      flash.remove();
    }, { once: true });
  }
}

// ジェネレータータイルの直上にトーストを表示（ボード満杯などの通知用）
// パネル要素のすぐ下にトーストを表示（依頼完了など）
function showToastRed(msg) {
  const el = document.createElement('div');
  el.innerHTML = msg;
  el.style.cssText = `
    position: fixed; bottom: 14px; left: 50%; transform: translateX(-50%);
    background: rgba(180,0,0,0.92); color: #fff; padding: 8px 18px;
    border-radius: 16px; font-size: 13px; font-weight: bold; z-index: 500;
    pointer-events: none; max-width: 80vw; text-align: center;
    white-space: normal; word-break: break-all;
    animation: toast-pop 3s ease-out forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function showToastNearPanel(msg, panelEl) {
  if (!panelEl) { showToast(msg); return; }
  const rect = panelEl.getBoundingClientRect();
  const el = document.createElement('div');
  el.innerHTML = msg;
  el.style.cssText = `
    position:fixed;
    left:${rect.left + rect.width / 2}px;
    top:${rect.bottom + 8}px;
    transform:translate(-50%, 0);
    background:rgba(10,30,70,0.92);
    color:#fff;
    padding:6px 18px;
    border-radius:20px;
    font-size:14px;
    font-weight:bold;
    pointer-events:none;
    z-index:9999;
    white-space:nowrap;
    animation:toast-pop 2s ease-out forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2100);
}

// ナビパネルの直上（盤面下部）にトーストを表示（ジェネレーターLvアップ体力ボーナスなど）
function showAboveNaviToast(msg) {
  const panel = document.getElementById('navi-hint-panel');
  let topY;
  if (panel && !panel.classList.contains('hidden')) {
    const rect = panel.getBoundingClientRect();
    topY = rect.top - 8;
  } else {
    const board = document.getElementById('event-board-wrap');
    const rect = board?.getBoundingClientRect();
    topY = rect ? rect.bottom - 40 : window.innerHeight - 80;
  }
  const el = document.createElement('div');
  el.innerHTML = msg;
  el.style.cssText = `
    position:fixed; left:50%; top:${topY}px;
    transform:translate(-50%, -100%);
    background:rgba(0,0,0,0.82); color:#fff; padding:6px 14px;
    border-radius:16px; font-size:12px; z-index:500;
    pointer-events:none; max-width:80vw; text-align:center;
    white-space:normal; word-break:break-all;
    animation:toast-pop 0.25s ease-out;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// 依頼人パネルの中央にトーストを表示（依頼完了メッセージ）
function showRewardInPanel(msg, panelEl, textColor = '#fff') {
  if (!panelEl) { showToast(msg); return; }
  const rect = panelEl.getBoundingClientRect();
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `
    position:fixed;
    left:${rect.left + rect.width / 2}px;
    top:${rect.top + rect.height / 2}px;
    transform:translate(-50%, -50%);
    background:rgba(10,30,70,0.92); color:${textColor}; padding:8px 18px;
    border-radius:20px; font-size:14px; font-weight:bold;
    pointer-events:none; z-index:9999; white-space:nowrap;
    animation:toast-pop 2s ease-out forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2100);
}

// 任意のDOM要素の近くにフロートテキストを表示（lucky-fade アニメ適用）
function showFloatNearEl(text, color, el) {
  if (!el) { showToast(text); return; }
  const rect = el.getBoundingClientRect();
  const div = document.createElement('div');
  div.textContent = text;
  div.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top}px;
    transform: translate(-50%, -50%) scale(1.2);
    color: ${color};
    font-size: 15px;
    font-weight: bold;
    pointer-events: none;
    z-index: 9999;
    text-shadow: 0 1px 5px #000, 0 0 8px rgba(0,0,0,0.6);
    white-space: nowrap;
    animation: lucky-fade 1.4s ease-out forwards;
  `;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1400);
}

// デバッグ用：デバッグ画面を閉じずにその場で表示するフロートテキスト
function showSpecialFixed(text, color) {
  const div = document.createElement('div');
  div.innerHTML = text;
  div.style.cssText = `
    position: fixed;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%) scale(1.2);
    color: ${color};
    font-size: 18px;
    font-weight: bold;
    pointer-events: none;
    z-index: 99999;
    text-shadow: 0 1px 6px #000;
    white-space: nowrap;
    animation: lucky-fade 1.4s ease-out forwards;
  `;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1400);
}

// 体力回復演出: ⚡がボード/ジェネレーター/ボタンから弧を描いて体力表示へ飛び込む
function showEnergyGain(amount) {
  const eventVisible = !document.getElementById('event-screen')?.classList.contains('hidden');
  const energyEl = eventVisible
    ? document.getElementById('ev-energy')
    : document.getElementById('energy-wrap');
  if (!energyEl) { showToast(`${HP_ICON} +${amount}`); return; }

  // +N テキスト（オレンジ、体力の上に浮かぶ）
  showFloatNearEl(`+${amount}`, '#ff8c00', energyEl);

  const rect = energyEl.getBoundingClientRect();
  const targetX = rect.left + rect.width  / 2;
  const targetY = rect.top  + rect.height / 2;

  // 出発源の候補：ボードセル・ジェネレーター・ボタン類
  const sources = [];
  const boardSel = eventVisible ? '#event-board .cell' : '#board .cell';
  document.querySelectorAll(boardSel).forEach(cell => {
    const r = cell.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) {
      sources.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  });
  ['story-btn', 'ev-settings-btn', 'ev-catalog-btn', 'daily-mission-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0) sources.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  });
  // フォールバック：ターゲット下方
  if (sources.length === 0) {
    sources.push({ x: targetX, y: targetY + 200 });
  }

  const BOLT_COUNT = 20;
  for (let i = 0; i < BOLT_COUNT; i++) {
    setTimeout(() => {
      const src = sources[Math.floor(Math.random() * sources.length)];
      const bolt = document.createElement('div');
      bolt.innerHTML = HP_ICON;
      bolt.style.cssText = `
        position: fixed;
        left: ${src.x}px;
        top:  ${src.y}px;
        width: 100px;
        height: 100px;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        will-change: left, top, transform, opacity;
      `;
      document.body.appendChild(bolt);

      // 弧の制御点（出発と到達の中間・やや上方）
      const cpX = (src.x + targetX) / 2 + (Math.random() - 0.5) * 100;
      const cpY = Math.min(src.y, targetY) - 60 - Math.random() * 80;
      const duration = 550 + Math.random() * 200;
      const startTime = performance.now();

      function animateBolt(now) {
        const t = Math.min((now - startTime) / duration, 1);
        // ease-in-out
        const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        // 2次ベジェ曲線
        const bx = (1 - e) * (1 - e) * src.x + 2 * (1 - e) * e * cpX + e * e * targetX;
        const by = (1 - e) * (1 - e) * src.y + 2 * (1 - e) * e * cpY + e * e * targetY;
        const sc = 1 - e * 0.88;
        const op = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;
        bolt.style.left      = `${bx}px`;
        bolt.style.top       = `${by}px`;
        bolt.style.transform = `translate(-50%,-50%) scale(${sc})`;
        bolt.style.opacity   = `${op}`;
        if (t < 1) {
          requestAnimationFrame(animateBolt);
        } else {
          bolt.remove();
        }
      }
      requestAnimationFrame(animateBolt);
    }, i * 55);
  }
}

// 「捜査盤面が満杯です」専用トースト（赤・立体・背景透明）
function showBoardFullToast(cellIdx, isEventBoard) {
  const boardId = isEventBoard ? 'event-board' : 'board';
  const cells = document.querySelectorAll(`#${boardId} .cell`);
  const cell = (cellIdx !== null && cellIdx >= 0) ? cells[cellIdx] : null;
  const el = document.createElement('div');
  el.textContent = '捜査盤面が満杯です';
  el.style.cssText = `
    position: fixed;
    background: transparent;
    color: #ff2222;
    font-size: 15px;
    font-weight: bold;
    text-shadow:
      1px 1px 0 #000, -1px -1px 0 #000,
      1px -1px 0 #000, -1px 1px 0 #000,
      2px 3px 5px rgba(0,0,0,0.85);
    padding: 6px 12px;
    z-index: 500;
    pointer-events: none;
    text-align: center;
    white-space: nowrap;
  `;
  if (cell) {
    const rect = cell.getBoundingClientRect();
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top  = `${Math.max(rect.top - 8, 10)}px`;
    el.style.transform = 'translate(-50%, -100%)';
  } else {
    el.style.left = '50%';
    el.style.top  = '40%';
    el.style.transform = 'translate(-50%, -50%)';
  }
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function showCellToast(msg, cellIdx, isEventBoard) {
  const boardId = isEventBoard ? 'event-board' : 'board';
  const cells = document.querySelectorAll(`#${boardId} .cell`);
  const cell = (cellIdx !== null && cellIdx >= 0) ? cells[cellIdx] : null;
  if (!cell) { showToast(msg); return; }
  const rect = cell.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = Math.max(rect.top - 8, 10);
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `
    position: fixed; left: ${x}px; top: ${y}px;
    transform: translate(-50%, -100%);
    background: rgba(0,0,0,0.82); color: #fff; padding: 6px 14px;
    border-radius: 16px; font-size: 12px; z-index: 500;
    pointer-events: none; max-width: 80vw; text-align: center;
    white-space: normal; word-break: break-all;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// ========================================
// 登場人物データ
// ========================================
const CHARACTERS = [
  { img: 'img/Chapter1/Chara/image_merge_order_chara_00.png',  name: 'ヤス',     age: '29歳', desc: '探偵事務所の助手' },
  { img: 'img/Chapter1/Chara/image_merge_order_chara_01a.png', name: 'ミユ',     age: '9歳',  desc: '猫を探している女の子' },
  { img: 'img/Chapter1/Chara/image_merge_order_chara_02.png',  name: 'ナナコ',   age: '28歳', desc: 'ケンイチの妻' },
  { img: 'img/Chapter1/Chara/image_merge_order_chara_03.png',  name: 'ケンイチ', age: '34歳', desc: 'ナナコの夫' },
  { img: 'img/Chapter1/Chara/image_merge_order_chara_04.png',  name: 'ミサキ',   age: '27歳', desc: '会社員' },
  { img: 'img/Chapter1/Chara/image_merge_order_chara_05.png',  name: 'シンジ',   age: '27歳', desc: '配達員' },
  { img: 'img/Chapter2/Chara/image_merge_order_chara_06a.png',  name: 'ジン',     age: '39歳', desc: '不動産管理会社勤務' },
  { img: 'img/Chapter2/Chara/image_merge_order_chara_07.png',  name: 'リナ',     age: '37歳', desc: 'シングルマザー' },
  { img: 'img/Chapter2/Chara/image_merge_order_chara_08.png',  name: 'ユウ',     age: '10歳', desc: 'リナの子供' },
  { img: 'img/Chapter2/Chara/image_merge_order_chara_09a.png',  name: 'ハルト',   age: '20歳', desc: '大学生' },
  { img: 'img/Chapter2/Chara/image_merge_order_chara_10.png',  name: 'タツオ',   age: '44歳', desc: '警備員' },
  { img: 'img/Chapter3/chara/image_merge_order_chara_15.png', name: 'フミコ',   age: '71歳', desc: '旅館女将・依頼人' },
  { img: 'img/Chapter3/chara/image_merge_order_chara_16.png', name: 'コウジ',   age: '47歳', desc: '旅館の跡取り' },
  { img: 'img/Chapter3/chara/image_merge_order_chara_17.png', name: 'サチコ',   age: '44歳', desc: '故人の長女' },
  { img: 'img/Chapter3/chara/image_merge_order_chara_18.png', name: 'ノブオ',   age: '67歳', desc: '弁護士' },
  { img: 'img/Chapter3/chara/image_merge_order_chara_19.png', name: 'ミドリ',   age: '52歳', desc: '旅館の番頭' },
  { img: 'img/Chapter3/chara/image_merge_order_chara_20.png', name: 'リョウタ', age: '24歳', desc: '故人の孫' },
  { img: 'img/Chapter3/chara/image_merge_order_chara_21.png', name: 'アキラ',   age: '40歳', desc: '故人の隠し子' },
  // 第四章
  { img: 'img/Chapter4/chara/image_merge_order_chara_22.png', name: 'タケシ', age: '35歳', desc: '不動産会社社員・内部告発者' },
  { img: 'img/Chapter4/chara/image_merge_order_chara_23.png', name: 'レイコ', age: '42歳', desc: '法務担当・被害者' },
  { img: 'img/Chapter4/chara/image_merge_order_chara_24.png', name: 'カズヤ', age: '55歳', desc: '不動産会社社長' },
  { img: 'img/Chapter4/chara/image_merge_order_chara_25.png', name: 'ハルカ', age: '28歳', desc: '地権者の娘' },
  { img: 'img/Chapter4/chara/image_merge_order_chara_26.png', name: 'シゲル', age: '68歳', desc: '地元の古老' },
];

function renderCharacters() {
  const list = document.getElementById('characters-list');
  list.innerHTML = '';
  const ch2Unlocked = !!eventState.fireGenUnlocked;
  const ch3Unlocked = !!eventState.kanteGenUnlocked;
  const ch4Unlocked = !!eventState.keikakuGenUnlocked;
  CHARACTERS.forEach((c, idx) => {
    // 第二章キャラクター（idx 6〜10）は製造機解放後のみ表示
    if (idx >= 6 && idx <= 10 && !ch2Unlocked) return;
    // 第三章キャラクター（idx 11〜17）は鑑定台解放後のみ表示
    if (idx >= 11 && idx <= 17 && !ch3Unlocked) return;
    // 第四章キャラクター（idx 18〜）は設計台解放後のみ表示
    if (idx >= 18 && !ch4Unlocked) return;
    // 章ラベルを挿入
    if (idx === 1) {
      const label = document.createElement('div');
      label.className = 'character-chapter-label';
      label.textContent = '第一章';
      list.appendChild(label);
    } else if (idx === 6) {
      const label = document.createElement('div');
      label.className = 'character-chapter-label';
      label.textContent = '第二章';
      list.appendChild(label);
    } else if (idx === 11) {
      const label = document.createElement('div');
      label.className = 'character-chapter-label';
      label.textContent = '第三章';
      list.appendChild(label);
    } else if (idx === 18) {
      const label = document.createElement('div');
      label.className = 'character-chapter-label';
      label.textContent = '第四章';
      list.appendChild(label);
    }
    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
      <img class="character-img" src="${c.img}" alt="${c.name}">
      <div class="character-info">
        <div class="character-name">${c.name}</div>
        <div class="character-age">${c.age}</div>
        <div class="character-desc">${c.desc}</div>
      </div>
    `;
    list.appendChild(card);
  });
}

document.getElementById('characters-close').addEventListener('click', () => {
  document.getElementById('characters-screen').classList.add('hidden');
});

// ========================================
// 設定ページ
// ========================================
document.getElementById('settings-btn').addEventListener('click', () => {
  if (isTutorialInProgress()) return;
  hideNaviHint();
  document.getElementById('settings-screen').classList.remove('hidden');
});

document.getElementById('ev-settings-btn').addEventListener('click', () => {
  if (isTutorialInProgress()) return;
  hideNaviHint();
  document.getElementById('settings-screen').classList.remove('hidden');
});

// ========================================
// デバッグモード
// ========================================
const debugState = {
  infiniteEnergy:  false,
  infiniteCoin:    false,
  infiniteDiamond: false,
};

// デバッグフロート（常時左下表示）
document.getElementById('dbf-open').addEventListener('click', () => {
  document.getElementById('debug-screen').classList.remove('hidden');
});
document.getElementById('debug-close').addEventListener('click', () => {
  document.getElementById('debug-screen').classList.add('hidden');
});

document.getElementById('dbf-energy').addEventListener('change', function() {
  debugState.infiniteEnergy = this.checked;
  if (this.checked) { state.energy = 99999; state.maxEnergy = 99999; renderEventHeader(); }
});
document.getElementById('dbf-coin').addEventListener('change', function() {
  debugState.infiniteCoin = this.checked;
  if (this.checked) { state.coin = 9999999; renderEventHeader(); }
});
document.getElementById('dbf-diamond').addEventListener('change', function() {
  debugState.infiniteDiamond = this.checked;
  if (this.checked) { state.diamond = 9999999; renderEventHeader(); }
});

// フロートの 🕵️全解放 ボタン
document.getElementById('dbf-kankei').addEventListener('click', () => {
  if (!state.seenScenes) state.seenScenes = [];
  const allKankei = [
    ...CH1_KANKEI_NODES, ...CH1_KANKEI_EDGES, ...CH1_KANKEI_BADGES,
    ...CH2_KANKEI_NODES, ...CH2_KANKEI_EDGES, ...CH2_KANKEI_BADGES,
    ...CH3_KANKEI_NODES, ...CH3_KANKEI_EDGES, ...CH3_KANKEI_BADGES,
  ];
  allKankei.forEach(item => {
    if (!state.seenScenes.includes(item.unlockScene)) state.seenScenes.push(item.unlockScene);
  });
  // 各章プルダウンを表示するため解放フラグもオン
  eventState.fireGenUnlocked  = true;
  eventState.kanteGenUnlocked = true;
  openKankeiScreen();
});

document.getElementById('debug-gen-lv-up').addEventListener('click', () => {
  // パワーレベルをLv1→Lv2→Lv4→Lv8→Lv16→Lv1とループ
  const genTile = eventState.board.find(c => c && c.isEventGen && !c.isFireGen);
  if (!genTile) { showToast('第一章ジェネレーターがありません'); return; }
  const next = (eventState.genPowerLevel + 1) % POWER_COSTS.length;
  eventState.genPowerLevel = next;
  const cost = POWER_COSTS[next];
  showToast(`出力Lv → ${cost}${HP_ICON}`);
  renderEventBoard();
  renderEventHeader();
});

document.getElementById('debug-firegen-lv-up').addEventListener('click', () => {
  if (!eventState.fireGenUnlocked) { showToast('第二章ジェネレーターはまだ解放されていません'); return; }
  // 最初の製造機タイルをループLvアップ
  const fireTile = eventState.board.find(c => c && c.isFireGen);
  if (!fireTile) { showToast('第二章ジェネレータータイルがありません'); return; }
  const maxLv = SEIZO_GEN_IMAGES.length - 1;
  fireTile.seizoLevel = ((fireTile.seizoLevel ?? 0) + 1) % (maxLv + 1);
  eventState.seizoGenLevel  = fireTile.seizoLevel;
  eventState.firePowerLevel = getFireGenMaxAvailablePowerLv(fireTile.seizoLevel);
  showToast(`第二章ジェネレーター Lv${fireTile.seizoLevel + 1} に！`);
  renderEventBoard();
});

document.getElementById('debug-spawn-coin5').addEventListener('click', () => {
  const emptyIdx = eventState.board.findIndex(c => c === null);
  if (emptyIdx === -1) { showToast('ボードが満杯です'); return; }
  eventState.board[emptyIdx] = { isCoin: true, coinLv: COIN_MAX_LV };
  renderEventBoard();
  showToast(`${COIN_ICON} Lv5コインを出しました`);
});

// ポップアップ文字確認ボタン（デバッグ画面を閉じずにその場で表示）
document.getElementById('debug-popup-lucky').addEventListener('click', () => {
  showSpecialFixed('🍀 Lucky!', '#4cff6e');
});
document.getElementById('debug-popup-power').addEventListener('click', () => {
  showSpecialFixed(`${HP_ICON} Power!`, '#e74c3c');
});
document.getElementById('debug-popup-levelup').addEventListener('click', () => {
  const ringEl = document.getElementById('player-level-ring');
  showFloatNearEl(`プレイヤーLv${state.playerLevel + 1}！`, '#f9c846', ringEl ?? document.getElementById('debug-screen'));
  if (ringEl) {
    ringEl.classList.add('player-level-up-flash');
    setTimeout(() => ringEl.classList.remove('player-level-up-flash'), 800);
  }
});
document.getElementById('debug-popup-genlvup').addEventListener('click', () => {
  showSpecialFixed('メモ机 Lv3！', '#f9c846');
});
document.getElementById('debug-popup-request').addEventListener('click', () => {
  showSpecialFixed('依頼完了！', '#ff8c00');
});
document.getElementById('debug-popup-discover').addEventListener('click', () => {
  showSpecialFixed('新アイテム発見！', '#f9c846');
});
document.getElementById('debug-popup-energy').addEventListener('click', () => {
  showEnergyGain(25);
});
document.getElementById('debug-popup-bonus').addEventListener('click', () => {
  showEnergyGain(25);
});
document.getElementById('debug-popup-bubble').addEventListener('click', () => {
  showToast('💎-6 しゃぼん玉を割りました');
});
document.getElementById('debug-popup-storycost').addEventListener('click', () => {
  showToast('コインが足りません');
});
document.getElementById('debug-popup-maxlv').addEventListener('click', () => {
  showToast('最大レベルです');
});

// アドベンチャーシーン再生ボタン（各章）
['ch1', 'ch2', 'ch3', 'ch4'].forEach(ch => {
  const btn = document.getElementById(`debug-adv-${ch}-play`);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const sel = document.getElementById(`debug-adv-${ch}-select`);
    const sceneId = sel?.value;
    if (!sceneId) { showToast('シーンを選択してください'); return; }
    document.getElementById('debug-screen').classList.add('hidden');
    openAdventureScene(sceneId);
  });
});

// ========================================
// アドベンチャーシーン
// ========================================
const ADV_SCENES = {
  // デバッグ確認用テストシーン
  test: {
    title:         'アドベンチャーシーンテスト',
    leftImg:       'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:      'img/Chapter1/Chara/image_merge_order_chara_01a.png',
    rightEntrance: 'slide',  // 右からスライドイン
    autoClose:     false,
    script: [
      { speaker: 'ヤス', text: 'ヤスです',             side: 'left'  },
      { speaker: 'ミユ', text: '猫を探しています',       side: 'right' },
      { speaker: 'ヤス', text: 'わかりました！探します', side: 'left'  },
    ],
  },
  // チュートリアル#2の直後に挿入されるシーン
  scene01: {
    title:         '',
    leftImg:       'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:      'img/Chapter1/Chara/image_merge_order_chara_01.png',
    leftEntrance:  'slide',  // ヤスは左からスライドイン
    flipLeft:      true,     // ヤスは左右反転で表示
    rightEntrance: 'none',   // ミユは最初非表示・セリフ時にスライドイン
    autoClose:     false,
    script: [
      { speaker: 'ヤス', text: 'ご依頼内容をお聞かせください。',                          side: 'left'                               },
      { speaker: 'ミユ', text: '猫が居なくなっちゃったの・・・。\n探してもらえますか？',   side: 'right', showRight: true, slideRight: true },
      { speaker: 'ヤス', text: 'それは、困りましたね。\n早速、探しましょう。',              side: 'left'                               },
      { speaker: 'ミユ', text: 'ありがとうございます！',                                   side: 'right'                              },
    ],
  },
  // 第一章スライド06（6回目のコイン支払い時）
  scene07: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    autoClose:    false,
    script: [
      // [0]
      { speaker: 'ヤス', text: '配達記録の会社名...「ハヤブサ便」...ですね。', side: 'left' },
      // [1]
      { speaker: 'ヤス', text: '（記録を調べる）', side: 'left' },
      // [2] 伏線①：名前を見て一瞬「間」を置く
      { speaker: 'ヤス', text: '担当者は...シンジ...という方です。', side: 'left' },
      // [3]
      { speaker: 'ヤス', text: '...なるほど。', side: 'left' },
      // [4]
      { speaker: 'ヤス', text: '少し...調べてみましょうか。', side: 'left' },
    ],
  },
  // 第一章スライド07（7回目のコイン支払い時）
  scene08: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter1/Chara/image_merge_order_chara_05.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    rightEntrance:'slide',
    autoClose:    false,
    script: [
      { speaker: 'シンジ', text: '失礼します！ハヤブサ便のシンジと申します。ご連絡いただいたとのことで。', side: 'right' },
      { speaker: 'ヤス',   text: 'ありがとうございます。わざわざ来ていただいて。', side: 'left' },
      { speaker: 'シンジ', text: 'いえ！お役に立てるなら。何でしょうか？', side: 'right' },
      { speaker: 'ヤス',   text: '先日、こちらのお宅に配達された荷物について伺いたくて。', side: 'left' },
      { speaker: 'シンジ', text: 'はい、確かに配達しました。ご不満な点がありましたでしょうか？', side: 'right' },
      { speaker: 'ヤス',   text: '荷物の差出人を確認できますか？', side: 'left' },
      { speaker: 'シンジ', text: 'もちろんです...少々お待ちください...（確認する）...お名前の記載がないですね...匿名での依頼でした。', side: 'right' },
      { speaker: 'ヤス',   text: '匿名での配達は、よくあることですか？', side: 'left' },
      { speaker: 'シンジ', text: 'たまにはありますよ。プレゼントとか、サプライズとかで。怪しいことは何もないと思いますが...。', side: 'right' },
      { speaker: 'ヤス',   text: 'そうですか...ありがとうございました。', side: 'left' },
      { speaker: 'シンジ', text: 'こちらこそ！何かあればいつでも連絡ください！', side: 'right' },
    ],
  },
  // 第一章スライド08（8回目のコイン支払い時）
  scene09: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter1/Chara/image_merge_order_chara_04.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    rightEntrance:'slide',
    autoClose:    false,
    script: [
      { speaker: 'ミサキ', text: 'すみません...', side: 'right' },
      { speaker: 'ヤス',   text: 'どうされましたか？', side: 'left' },
      { speaker: 'ミサキ', text: '元彼に...つけ回されていて...。警察に相談したんですが、証拠がないと言われてしまって。', side: 'right' },
      { speaker: 'ヤス',   text: 'いつ頃から、ですか？', side: 'left' },
      { speaker: 'ミサキ', text: '別れてから３ヶ月くらい...最初は偶然かと思っていたんですけど...明らかに、追いかけてきてて。', side: 'right' },
      { speaker: 'ヤス',   text: 'その方のお名前は？', side: 'left' },
      { speaker: 'ミサキ', text: '...シンジ、といいます。', side: 'right' },
      { speaker: 'ヤス',   text: '職業は？', side: 'left' },
      { speaker: 'ミサキ', text: '配送の仕事をしています...ハヤブサ便、という会社で。', side: 'right' },
    ],
  },
  // 第一章スライド09（9回目のコイン支払い時）
  scene10: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter1/Chara/image_merge_order_chara_04.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    rightEntrance:'fade',
    autoClose:    false,
    script: [
      { speaker: 'ミサキ', text: 'シンジが...私以外の誰かにも、何かしているような気がしていて...。', side: 'right' },
      { speaker: 'ヤス',   text: '少し、調べてみました。', side: 'left' },
      { speaker: 'ミサキ', text: '...何かわかりましたか？', side: 'right' },
      // 伏線②：調べればわかることをすでに知っているような口調
      { speaker: 'ヤス',   text: 'シンジさんの行動を辿ると...通常の配達以外に、特定の住所へ繰り返し足を運んでいる記録がありました。', side: 'left' },
      { speaker: 'ミサキ', text: '...誰の家ですか？', side: 'right' },
      { speaker: 'ヤス',   text: 'まだ確認中です。もう少し調べさせてください。', side: 'left' },
      { speaker: 'ミサキ', text: '...お願いします。', side: 'right' },
    ],
  },
  // 第一章スライド10（10回目のコイン支払い時）
  scene11: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter1/Chara/image_merge_order_chara_03.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    rightEntrance:'slide',
    autoClose:    false,
    script: [
      { speaker: 'ヤス',     text: 'ケンイチさん、少し気になることがあって。', side: 'left' },
      { speaker: 'ケンイチ', text: '...何でしょうか。', side: 'right' },
      { speaker: 'ヤス',     text: '最近、見知らぬ人物につけられていると感じることはありませんか？', side: 'left' },
      { speaker: 'ケンイチ', text: '...いえ、特には...。', side: 'right' },
      { speaker: 'ヤス',     text: '外出先で、不審なことは？', side: 'left' },
      { speaker: 'ケンイチ', text: '...何もないです。', side: 'right' },
      { speaker: 'ヤス',     text: '...そうですか。失礼しました。', side: 'left' },
      // ヤス独り言・伏線
      { speaker: 'ヤス',     text: '（独り言）...やはり、何かある。', side: 'left' },
    ],
  },
  // 第一章スライド11（11回目のコイン支払い時）不倫現場を目撃
  scene12: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_road_night.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    autoClose:    false,
    script: [
      { speaker: 'ヤス', text: '（独り言）...いた。', side: 'left' },
      { speaker: 'ヤス', text: '...ケンイチさんと、あの女性は...。', side: 'left' },
      { speaker: 'ヤス', text: '（しばらく観察する）...', side: 'left' },
      { speaker: 'ヤス', text: '...なるほど。シンジさんが怒るのも、無理はない。', side: 'left' },
    ],
  },
  // 第一章スライド12（12回目のコイン支払い時）ミサキに突きつける
  scene13: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter1/Chara/image_merge_order_chara_04.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    rightEntrance:'fade',
    autoClose:    false,
    script: [
      { speaker: 'ヤス',   text: '昨夜、ケンイチさんとご一緒でしたよね。', side: 'left' },
      { speaker: 'ミサキ', text: '...（沈黙）', side: 'right' },
      { speaker: 'ヤス',   text: '正直に話していただけますか。', side: 'left' },
      { speaker: 'ミサキ', text: '...（長い沈黙）...はい。', side: 'right' },
      { speaker: 'ヤス',   text: 'シンジさんは、それを知っている。', side: 'left' },
      { speaker: 'ミサキ', text: '...おそらく。だから、ケンイチさんの家族にも...。', side: 'right' },
      { speaker: 'ヤス',   text: '...なぜ、もっと早く話してくれなかったのですか。', side: 'left' },
      { speaker: 'ミサキ', text: '...言えなかったんです。ケンイチさんは、奥さんもいるから...。', side: 'right' },
    ],
  },
  // 第一章スライド13（13回目のコイン支払い時）夜のシンジ尾行
  scene14: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_road_night.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    autoClose:    false,
    script: [
      { speaker: 'ヤス', text: '...また、この時間に動いている。', side: 'left' },
      { speaker: 'ヤス', text: 'ハヤブサ便の制服を着て...それでも、配達ではないな。', side: 'left' },
      { speaker: 'ヤス', text: '（しばらく観察する）...', side: 'left' },
      // シンジの裏の顔の片鱗
      { speaker: 'ヤス', text: '...昼間とは、まるで別の顔だ。', side: 'left' },
    ],
  },
  // 第一章スライド14（14回目のコイン支払い時）証拠の整理
  scene15: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    autoClose:    false,
    script: [
      { speaker: 'ヤス', text: '...整理しましょう。', side: 'left' },
      { speaker: 'ヤス', text: 'ナナコさんへ届けられた荷物...中に入っていたのは、漬物石のような大きな石だった。', side: 'left' },
      // 謎の石を中央表示（※石のアイコン画像が必要。現在は仮置き）
      { showCenter: 'img/Chapter1/Icon/image_merge_icon1_07.png' },
      { speaker: 'ヤス', text: '差出人不明...そして配達のタイミングで猫のミケちゃんが姿を消した...', side: 'left' },
      { speaker: 'ヤス', text: '...荷物を届けると同時に、猫のミケちゃんを連れ去った...なるほど....そういうことですね...', side: 'left' },
      { speaker: 'ヤス', text: 'それから、ミサキさんへのストーカー行為。配達ルートを使い、行動を把握していた。', side: 'left' },
      { speaker: 'ヤス', text: 'ケンイチさんへの嫌がらせも、配達の仕事を装って近づいていた。', side: 'left' },
      // 謎の石への含み（別章への伏線）
      { speaker: 'ヤス', text: '...この石だけは、少し気になりますね。', side: 'left' },
      { speaker: 'ヤス', text: '全てに、シンジさんが関わっている。', side: 'left' },
    ],
  },
  // 第一章スライド15（15回目のコイン支払い時）シンジ対峙・豹変
  scene16: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter1/Chara/image_merge_order_chara_05.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    rightEntrance:'slide',
    autoClose:    false,
    script: [
      { speaker: 'シンジ', text: '...呼びましたか？', side: 'right' },
      { speaker: 'ヤス',   text: 'はい。確認したいことがあって。', side: 'left' },
      { speaker: 'シンジ', text: '何でしょう？', side: 'right' },
      // 証拠①：謎の石
      { speaker: 'ヤス',   text: 'ナナコさんへ届けた荷物の中身...あの石は、何ですか？', side: 'left' },
      { speaker: 'シンジ', text: '...荷物、ですか？いろいろ運びますから。', side: 'right' },
      { speaker: 'ヤス',   text: '差出人はあなたです。配達記録に、あなたの担当便として残っている。', side: 'left' },
      { speaker: 'シンジ', text: '...（沈黙）', side: 'right' },
      // 証拠②：猫の誘拐
      { speaker: 'ヤス',   text: 'その荷物を届けた日の夜、猫のミケちゃんがいなくなっています...配達ルートの記録と、移動時間が一致している...', side: 'left' },
      { speaker: 'シンジ', text: '...それは...たまたまじゃないですか。', side: 'right' },
      // 証拠③：ストーカー
      { speaker: 'ヤス',   text: 'ミサキさんへの接触も、全て配達の仕事に紛れている。同じルートに、週に３回以上。', side: 'left' },
      { speaker: 'シンジ', text: '...（長い沈黙）', side: 'right' },
      // 豹変：表の顔→裏の顔
      { speaker: 'シンジ', text: '...ハ。', side: 'right', changeRightImg: 'img/Chapter1/Chara/image_merge_order_chara_05a.png' },
      { speaker: 'シンジ', text: '全部わかってるんですね。...まあ、いいですよ。ミサキが裏切ったのが悪いんで。', side: 'right',
        changeRightImg: 'img/Chapter1/Chara/image_merge_order_chara_05b.png' },
      { speaker: 'ヤス',   text: 'ケンイチさんの家族まで巻き込んだのは。', side: 'left' },
      { speaker: 'シンジ', text: 'あの男にも家族にも、痛い目に合わせたかった...それだけですよ...', side: 'right' },
    ],
  },
  // 第一章スライド16・完結（16回目のコイン支払い時）逃走
  scene17: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter1/Chara/image_merge_order_chara_05b.png',
    bg:           'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade',
    flipLeft:     true,
    rightEntrance:'fade',
    autoClose:    false,
    script: [
      { speaker: 'ヤス',   text: '警察に連絡します。動かないでください。', side: 'left' },
      { speaker: 'シンジ', text: '...少しだけ、外の空気を吸ってきていいですか。', side: 'right' },
      { speaker: 'ヤス',   text: '...わかりました。', side: 'left' },
      // シンジが去る
      { hideAll: true, autoAdvance: true, advanceDelay: 600 },
      // 背景を戻してから沈黙の「...」を表示
      { setBg: 'img/bg/image_merge_bg_light.png', autoAdvance: true, advanceDelay: 300 },
      { sound: '...', autoAdvance: true, advanceDelay: 1200 },
      { sound: '...', autoAdvance: true, advanceDelay: 1200 },
      { sound: '...', autoAdvance: true, advanceDelay: 1200 },
      // ヤスが静かに現れる・伏線④
      { speaker: 'ヤス', text: '...行かれましたね。', side: 'left', showLeft: true, slideLeft: true, flipLeft: true },
    ],
  },
  // ===== 第二章 =====
  // 第二章 Scene01（17回目のコイン支払い時）リナ来訪
  c2s01: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_07.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'リナ',  text: 'すみません...', side: 'right' },
      { speaker: 'ヤス',  text: 'どうされましたか？', side: 'left' },
      { speaker: 'リナ',  text: '住んでいるマンションで...おかしなことが続いていて...', side: 'right' },
      { speaker: 'ヤス',  text: 'おかしなこと、というのは？', side: 'left' },
      { speaker: 'リナ',  text: '廊下に知らない荷物が置かれていたり...ドアに傷がついていたり...', side: 'right' },
      { speaker: 'ヤス',  text: 'いつ頃から、ですか？', side: 'left' },
      { speaker: 'リナ',  text: '先月くらいから...少しずつ...エスカレートしている気がして...', side: 'right' },
      { speaker: 'ヤス',  text: 'わかりました...少し、調べさせてください。', side: 'left' },
    ],
  },
  // 第二章 Scene02（18回目）現場へ
  c2s02: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_07.png',
    bg:           'img/Chapter2/bg/image_merge_bg_sunrisehills.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      // 背景チェンジ→マンション外（仮: road_light）
      { hideAll: true, changeBg: 'img/Chapter2/bg/image_merge_bg_sunrisehills.png', autoAdvance: true },
      { speaker: 'リナ',  text: 'ここです...「サンライズ ヒルズ」というマンションです。', side: 'right', showRight: true, slideRight: true },
      { speaker: 'ヤス',  text: '管理会社はどちらですか？', side: 'left', showLeft: true, slideLeft: true, flipLeft: true },
      { speaker: 'リナ',  text: '「青葉不動産」さんです...担当の方は、ジンさんという方で...', side: 'right' },
      { speaker: 'ヤス',  text: '最近、管理会社の方と何か話しましたか？', side: 'left' },
      { speaker: 'リナ',  text: '先月、「老朽化のため建て替えを検討している」と言われました...でも、まだ何も決まっていないと...', side: 'right' },
      { speaker: 'ヤス',  text: '...なるほど。', side: 'left' },
    ],
  },
  // 第二章 Scene03（19回目）タツオと初接触
  c2s03: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_10.png',
    bg:           'img/Chapter2/bg/image_merge_bg_Apartmentexterior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'タツオ', text: '...何か？', side: 'right' },
      { speaker: 'ヤス',   text: 'こちらのマンションの警備の方ですか？', side: 'left' },
      { speaker: 'タツオ', text: '...そうですが。', side: 'right' },
      { speaker: 'ヤス',   text: '最近、不審な人物や出来事をご覧になりましたか？', side: 'left' },
      { speaker: 'タツオ', text: '...何も見ていません。', side: 'right' },
      { speaker: 'ヤス',   text: 'そうですか...何かあればご連絡ください。', side: 'left' },
      { speaker: 'タツオ', text: '...（無言）', side: 'right' },
    ],
  },
  // 第二章 Scene04（20回目）リナの部屋
  c2s04: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_07.png',
    bg:           'img/Chapter2/bg/image_merge_bg_Apartmentinterior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'リナ',  text: 'どうぞ...散らかっていてすみません。', side: 'right' },
      { speaker: 'ヤス',  text: 'ドアの傷、見せてもらえますか？', side: 'left' },
      { speaker: 'リナ',  text: 'これです...引っ掻いたような跡が...', side: 'right' },
      { speaker: 'ヤス',  text: '...鍵穴の周りですね。開けようとした跡かもしれません。', side: 'left' },
      { speaker: 'リナ',  text: '...開けようとした、ということですか？', side: 'right' },
      { speaker: 'ヤス',  text: '他に、気になったことは？', side: 'left' },
      { speaker: 'リナ',  text: '管理会社から...「退去を検討してもらえないか」と手紙が来ていて...', side: 'right' },
      { speaker: 'ヤス',  text: 'その手紙を見せてもらえますか？', side: 'left' },
    ],
  },
  // 第二章 Scene05（21回目）ユウの証言①
  c2s05: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_07.png',
    right2Img:    'img/Chapter2/Chara/image_merge_order_chara_08.png',
    bg:           'img/Chapter2/bg/image_merge_bg_Apartmentinterior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade',
    right2Entrance:'none', autoClose: false,
    script: [
      { speaker: 'ユウ',  text: 'ただいまー！', side: 'right2', showRight2: true, slideRight2: true, shiftRight: true },
      { speaker: 'リナ',  text: 'お帰り。こちら、探偵さんよ。', side: 'right' },
      { speaker: 'ユウ',  text: '探偵さん！すごい！', side: 'right2' },
      { speaker: 'ヤス',  text: 'こんにちは。最近、変なことを見たりしなかった？', side: 'left' },
      { speaker: 'ユウ',  text: 'うーん...この前、夜中にトイレに起きたら...廊下に知らないおじさんがいた。', side: 'right2' },
      { speaker: 'リナ',  text: 'え...！そんなこと聞いてなかったよ？', side: 'right' },
      { speaker: 'ユウ',  text: 'だって、怖かったんだもん...スーツのおじさんで...ずっとドアを見てた。', side: 'right2' },
      { speaker: 'ヤス',  text: 'そのおじさん、また来たら教えてね。', side: 'left' },
    ],
  },
  // 第二章 Scene06（22回目）タツオを再び訪ねる
  c2s06: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_10.png',
    bg:           'img/Chapter2/bg/image_merge_bg_Apartmentexterior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'タツオ', text: '...また、あなたですか。', side: 'right' },
      { speaker: 'ヤス',   text: '少しだけ、お時間よろしいですか。', side: 'left' },
      { speaker: 'タツオ', text: '...何を聞きたいんですか。', side: 'right' },
      { speaker: 'ヤス',   text: '夜中に、このマンションのドア付近にいた人物を見ませんでしたか？', side: 'left' },
      { speaker: 'タツオ', text: '...（長い沈黙）...見ていません。', side: 'right' },
      { speaker: 'ヤス',   text: 'そうですか...ところで、こちらの警備、長いんですか？', side: 'left' },
      { speaker: 'タツオ', text: '...３年になります。', side: 'right' },
      { speaker: 'ヤス',   text: '大変な仕事ですね...何か困ったことがあれば、いつでも。', side: 'left' },
      { speaker: 'タツオ', text: '...（名刺を見つめる）...', side: 'right' },
    ],
  },
  // 第二章 Scene07（23回目）ハルトと出会う
  c2s07: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_09a.png',
    bg:           'img/Chapter2/bg/image_merge_bg_Apartmentexterior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ハルト', text: 'あ、すみません！ぶつかりそうになって...！', side: 'right' },
      { speaker: 'ヤス',   text: 'いえ、大丈夫ですよ。こちらのマンションの方ですか？', side: 'left' },
      { speaker: 'ハルト', text: 'はい！305号室です。大学生で、ここ２年住んでるんです。', side: 'right' },
      { speaker: 'ヤス',   text: '最近、こちらで何かおかしなことはありませんでしたか？', side: 'left' },
      { speaker: 'ハルト', text: '最近、管理会社さんがよく来るな、とは思ってましたけど。', side: 'right' },
      { speaker: 'ヤス',   text: '管理会社の方が？', side: 'left' },
      { speaker: 'ハルト', text: 'はい。僕、そこでバイトしてるんですよ。だから余計に気になって。', side: 'right' },
      { speaker: 'ヤス',   text: 'バイト先で、何か気になることは？', side: 'left' },
      { speaker: 'ハルト', text: '...それが、なんか最近、雰囲気がおかしくて。', side: 'right' },
    ],
  },
  // 第二章 Scene08（24回目）ハルトが語る
  c2s08: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_09a.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ハルト', text: '先日、上司のジンさんから「あのマンションの住人に退去を促す書類を配ってほしい」って頼まれたんです。', side: 'right' },
      { speaker: 'ヤス',   text: '退去を促す書類、ですか。', side: 'left' },
      { speaker: 'ハルト', text: 'でも、なんか様式が...公式のものじゃないみたいで...断ったんです。', side: 'right' },
      { speaker: 'ヤス',   text: 'そうしたら？', side: 'left' },
      { speaker: 'ハルト', text: '「余計なことを気にするな」って怒られて...。ジンさん、いつもは優しいんですけど...', side: 'right' },
      { speaker: 'ヤス',   text: 'ジンさん、最近、様子が違いますか？', side: 'left' },
      { speaker: 'ハルト', text: 'はい...何かに追い詰められているみたいで...僕、心配で。', side: 'right' },
      { speaker: 'ヤス',   text: '話してくれてありがとう。', side: 'left' },
    ],
  },
  // 第二章 Scene09（25回目）ジン来訪・調査依頼・ヤスの囁き
  c2s09: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_06a.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ジン',  text: '突然すみません...こちら、探偵事務所さんですよね。', side: 'right' },
      { speaker: 'ヤス',  text: 'どうされましたか？', side: 'left' },
      { speaker: 'ジン',  text: '管理している物件で...住人への嫌がらせが起きていまして。調査をお願いできますか。', side: 'right' },
      { speaker: 'ヤス',  text: '詳しく聞かせてください。', side: 'left' },
      { speaker: 'ジン',  text: 'ドアに細工をされたり、不審な封筒が届いたり...誰がやっているのか、全く見当がつかなくて。', side: 'right' },
      { speaker: 'ヤス',  text: '物件名と住所を教えていただけますか？', side: 'left' },
      { speaker: 'ジン',  text: '「サンライズ ヒルズ」というマンションです。こちらに...', side: 'right' },
      // 伏線①：間を置き、少し微笑む
      { speaker: 'ヤス',  text: '...なるほど。', side: 'left' },
      // ヤスの囁き
      { speaker: 'ヤス',  text: 'それは...直接、動いた方が早いかもしれませんね。', side: 'left' },
      { speaker: 'ジン',  text: '直接...？', side: 'right' },
    ],
  },
  // 第二章 Scene10（26回目）ジンが去った後・ヤス独り言
  c2s10: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose:    false,
    script: [
      // 伏線②
      { speaker: 'ヤス', text: '...順調ですね。', side: 'left' },
      { speaker: 'ヤス', text: 'あとは...どう動くか、でしょうか。', side: 'left' },
    ],
  },
  // 第二章 Scene11（27回目）リナが過去を語る
  c2s11: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_07.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',  text: '本日はどうされましたか？', side: 'left' },
      { speaker: 'リナ',  text: '...実は、前の夫が...ユウが小さい頃に、家を出て行ったんです。', side: 'right' },
      { speaker: 'ヤス',  text: 'そうでしたか...', side: 'left' },
      { speaker: 'リナ',  text: '色々あって...やっと、ユウと安心して暮らせる場所を見つけたと思ったのに...', side: 'right' },
      { speaker: 'ヤス',  text: 'このマンションが、大切な場所なんですね。', side: 'left' },
      { speaker: 'リナ',  text: 'はい...だから、絶対に追い出されたくなくて。', side: 'right' },
      { speaker: 'ヤス',  text: '必ず、何とかしましょう。', side: 'left' },
    ],
  },
  // 第二章 Scene12（28回目）タツオが重い口を開く
  c2s12: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_10.png',
    bg:           'img/bg/image_merge_bg_road_light.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'タツオ', text: '探偵さん...少しお話、いいですか。', side: 'right' },
      { speaker: 'ヤス',   text: 'もちろんです。', side: 'left' },
      { speaker: 'タツオ', text: '私は...昔、仕事中に事故があって...冤罪で訴えられたことがあって。', side: 'right' },
      { speaker: 'ヤス',   text: 'それは...大変でしたね。', side: 'left' },
      { speaker: 'タツオ', text: '無罪にはなりましたが...その後、仕事を見つけるのが大変で。やっとここに落ち着いたんです。', side: 'right' },
      { speaker: 'ヤス',   text: 'ジンさんに、その話を...？', side: 'left' },
      { speaker: 'タツオ', text: '...履歴書に書いてあったんでしょう。「また問題を起こしたくなければ黙っていろ」と言われました。', side: 'right' },
      { speaker: 'ヤス',   text: 'ひどい話ですね...', side: 'left' },
      { speaker: 'タツオ', text: '...夜中に来ていたのは、ジンさんです。私は...見ていました。', side: 'right' },
    ],
  },
  // 第二章 Scene13（29回目）ハルトが内情を暴露
  c2s13: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_09a.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',   text: '少しお時間よろしいですか？', side: 'left' },
      { speaker: 'ハルト', text: '...やっぱり、話します。', side: 'right' },
      { speaker: 'ヤス',   text: '聞かせてください。', side: 'left' },
      { speaker: 'ハルト', text: 'ジンさんから先週、「301号室と501号室の前に、これを置いてきてほしい」って頼まれました。', side: 'right' },
      { speaker: 'ヤス',   text: '何を置くように？', side: 'left' },
      { speaker: 'ハルト', text: '封筒です。中身は見せてもらえなかったんですが...「住んでいられなくなるようなこと」って言ってて。', side: 'right' },
      { speaker: 'ヤス',   text: '置きましたか？', side: 'left' },
      { speaker: 'ハルト', text: '...置きました。怖かったけど、断れなくて...僕も、悪いことしたと思ってます。', side: 'right' },
      { speaker: 'ヤス',   text: '正直に話してくれてありがとう。守秘義務があるので、安心してくださいね。', side: 'left' },
    ],
  },
  // 第二章 Scene14（30回目）ユウの証言②
  c2s14: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_07.png',
    right2Img:    'img/Chapter2/Chara/image_merge_order_chara_08.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade',
    right2Entrance:'fade',
    rightShifted:  true, autoClose: false,
    script: [
      { speaker: 'ユウ',  text: 'お兄さんに話したいことがあって...', side: 'right2' },
      { speaker: 'ヤス',  text: '聞かせてくれる？', side: 'left' },
      { speaker: 'ユウ',  text: 'この前のおじさん、また来てた。', side: 'right2' },
      { speaker: 'リナ',  text: 'えっ！？いつ？', side: 'right' },
      { speaker: 'ユウ',  text: '昨日の夜...同じスーツのおじさん。', side: 'right2' },
      { speaker: 'ヤス',  text: 'どんな顔だったか、覚えてる？', side: 'left' },
      { speaker: 'ユウ',  text: 'うーん...眼鏡はしてなくて...ちょっと疲れた顔のおじさん。', side: 'right2' },
      { speaker: 'ヤス',  text: '（写真を見せる）この人？', side: 'left' },
      { speaker: 'ユウ',  text: '...うん！このおじさん！', side: 'right2' },
      { speaker: 'リナ',  text: '...ジンさん？', side: 'right' },
    ],
  },
  // 第二章 Scene15（31回目）証拠を整理・ヤス独り言
  c2s15: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose:    false,
    script: [
      { speaker: 'ヤス', text: 'タツオさんの証言...ハルトさんの証言...ユウくんの目撃...', side: 'left' },
      { speaker: 'ヤス', text: 'そして、ジンさん自身の言葉...。', side: 'left' },
      // 伏線③：静かな満足感
      { speaker: 'ヤス', text: '...全てが繋がりそうですね...', side: 'left' },
    ],
  },
  // 第二章 Scene15b（32回目）夜間証拠収集
  c2s15b: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_road_night.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose:    false,
    script: [
      { speaker: 'ヤス', text: '...いましたね。', side: 'left' },
      { speaker: 'ヤス', text: '（スマートフォンを向ける）', side: 'left' },
      { sound: 'カシャッ...', autoAdvance: true, advanceDelay: 800 },
      { speaker: 'ヤス', text: 'これで...証拠が揃いましたね...', side: 'left' },
    ],
  },
  // 第二章 Scene16（33回目）ジンに証拠を突きつける
  c2s16: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_06a.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ヤス',  text: 'ジンさん...お呼び立てしてすみません...少しお話よいですか？', side: 'left' },
      { speaker: 'ジン',  text: '依頼の件...何かわかりましたか？', side: 'right' },
      { speaker: 'ヤス',  text: 'はい、調査が進みました。実は...犯人が、わかりました。', side: 'left' },
      { speaker: 'ジン',  text: '...それは、誰ですか。', side: 'right' },
      { speaker: 'ヤス',  text: '嫌がらせをしていたのは...あなたではないですか、ジンさん。', side: 'left' },
      { speaker: 'ジン',  text: '...っ。私が...何を根拠に。', side: 'right' },
      { speaker: 'ヤス',  text: 'タツオさんが証言してくださいました。深夜にドア付近にいたのを、ずっと見ていたと。', side: 'left' },
      { speaker: 'ジン',  text: '...それは、たまたま見回りをしていただけで...', side: 'right' },
      { speaker: 'ヤス',  text: 'ハルトさんも話してくれました。301号室と501号室に封筒を置くよう、指示されたと。', side: 'left' },
      { speaker: 'ジン',  text: '...あいつが...', side: 'right' },
      { speaker: 'ヤス',  text: '10歳の子どもも、あなたの顔を覚えていました。写真を見せたら、すぐに。', side: 'left' },
      { speaker: 'ジン',  text: '...', side: 'right' },
      { speaker: 'ヤス',  text: 'そして...これが、先日の夜に撮影したものです。', side: 'left' },
      { speaker: 'ジン',  text: '...（長い沈黙）', side: 'right' },
      { speaker: 'ヤス',  text: '...いかがですか。', side: 'left' },
    ],
  },
  // 第二章 Scene17（34回目）ジンが吐露
  c2s17: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_06a.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { sound: '...' },
      { sound: '...' },
      { sound: '...' },
      { speaker: 'ジン',  text: '...わかりました。話します。', side: 'right' },
      { speaker: 'ヤス',  text: '聞かせてください。', side: 'left' },
      { speaker: 'ジン',  text: 'マンションを建て替えれば...会社の損失を取り戻せる。住人さえいなくなれば、話は早い。', side: 'right' },
      { speaker: 'ヤス',  text: '...タツオさんの件も、あなたが仕組んだんですか。', side: 'left' },
      { speaker: 'ジン',  text: '...業務上の損失を、誰かに被せる必要があった。', side: 'right' },
      { speaker: 'ヤス',  text: '冤罪だったんですね。タツオさんにとっては。', side: 'left' },
      { speaker: 'ジン',  text: '...私には、やるしかなかった。', side: 'right' },
    ],
  },
  // 第二章 Scene18（35回目）全行為が判明
  c2s18: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_06a.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',  text: '確認させてください...深夜の訪問も、封筒も、全てジンさんが？', side: 'left' },
      { speaker: 'ジン',  text: '...はい。', side: 'right' },
      { speaker: 'ヤス',  text: 'ハルトさんにも、指示を出しましたか？', side: 'left' },
      { speaker: 'ジン',  text: '...出しました。', side: 'right' },
      { speaker: 'ヤス',  text: 'タツオさんを脅したことも？', side: 'left' },
      { speaker: 'ジン',  text: '...全て、私がやりました。', side: 'right' },
      { speaker: 'ヤス',  text: '...そうですか。', side: 'left' },
    ],
  },
  // 第二章 Scene19（36回目）対峙・逃走
  c2s19: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter2/Chara/image_merge_order_chara_06a.png',
    bg:           'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',  text: '警察に話しましょう。私も同行します。', side: 'left' },
      { speaker: 'ジン',  text: '...そうですね。でも、その前に...会社に連絡してもいいですか？', side: 'right' },
      { speaker: 'ヤス',  text: '...わかりました。', side: 'left' },
      { speaker: 'ジン',  text: '（立ち上がる）...少し、外の空気を吸ってきます。', side: 'right' },
      { hideAll: true, autoAdvance: true, advanceDelay: 600 },
      { setBg: 'img/bg/image_merge_bg_light.png', autoAdvance: true, advanceDelay: 300 },
      { sound: '...', autoAdvance: true, advanceDelay: 1200 },
      { sound: '...', autoAdvance: true, advanceDelay: 1200 },
      { sound: '...', autoAdvance: true, advanceDelay: 1200 },
      { speaker: 'ヤス', text: '...さて、行かれましたかね...', side: 'left', showLeft: true, slideLeft: true, flipLeft: true },
    ],
  },
  // 第二章 Scene20（37回目）エピローグ・ヤスの伏線④
  c2s20: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose:    false,
    script: [
      { speaker: 'ヤス', text: 'リナさんとユウくんの暮らしは...守れましたね。', side: 'left' },
      { speaker: 'ヤス', text: 'ジンさんも...ようやく楽になれたでしょう。', side: 'left' },
      // 伏線④：すでに「次」を知っているような口調
      { speaker: 'ヤス', text: '...次は、どんな依頼が来るでしょうか。', side: 'left' },
    ],
  },
  // ===== 第三章 =====
  // 第三章 Scene01（38回目）フミコ来訪
  c3s01: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_15.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'フミコ', text: '突然すみません...。こちら、探偵事務所ですよね...？', side: 'right' },
      { speaker: 'ヤス',   text: 'ええ。どうぞ、お座りください。', side: 'left' },
      { speaker: 'フミコ', text: '...実は、主人の遺言書のことで...どうしても腑に落ちないことがありまして。', side: 'right' },
      { speaker: 'ヤス',   text: '遺言書、ですか。', side: 'left' },
      { speaker: 'フミコ', text: 'あの人は「旅館は家族全員で守るもの」と...ずっとそう言っていたんです。でも遺言書には、長男だけに旅館を渡すと...', side: 'right' },
      { speaker: 'ヤス',   text: '...それは、ご主人のお気持ちと違う、と。', side: 'left' },
      { speaker: 'フミコ', text: 'はい。あの人が、そんな遺言を書くはずがないんです。', side: 'right' },
    ],
  },
  // 第三章 Scene02（39回目）白鷺亭へ・ヤスの伏線①
  c3s02: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_15.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { hideAll: true, changeBg: 'img/Chapter3/bg/image_merge_bg_inn_exterior.png', autoAdvance: true },
      { speaker: 'フミコ', text: 'こちらです。「白鷺亭」...主人が五十年以上、営んできた旅館です。', side: 'right', showRight: true, slideRight: true },
      // 伏線①：どこか含みのある一言
      { speaker: 'ヤス',   text: '...これは...立派な旅館ですね。', side: 'left', showLeft: true, slideLeft: true, flipLeft: true },
      { speaker: 'フミコ', text: '？...何か、おっしゃいましたか？', side: 'right' },
      { speaker: 'ヤス',   text: 'いえ...早速、中を拝見させてください。', side: 'left' },
    ],
  },
  // 第三章 Scene03（40回目）コウジと初接触
  c3s03: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_16.png',
    bg:           'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'コウジ', text: '...あんたが探偵か。母が頼んだとか言ってたが。', side: 'right' },
      { speaker: 'ヤス',   text: 'はい。少し、お話を聞かせていただけますか？', side: 'left' },
      { speaker: 'コウジ', text: '断る。遺言書は正式なものだ。部外者が口を出すことは何もない。', side: 'right' },
      { speaker: 'ヤス',   text: '...そうですか。では、なぜそこまで急いで話を終わらせようとするのでしょう？', side: 'left' },
      { speaker: 'コウジ', text: '...っ。余計なことを考えるな。', side: 'right' },
    ],
  },
  // 第三章 Scene04（41回目）サチコと遭遇
  c3s04: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_17.png',
    bg:           'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'サチコ', text: '...探偵さんですか？母から聞いています。', side: 'right' },
      { speaker: 'ヤス',   text: 'サチコさんですね。遠いところをわざわざ。', side: 'left' },
      { speaker: 'サチコ', text: 'お父さんが亡くなって...そんなすぐに遺言書の話が出て。正直、私もおかしいとは思っていたんです。', side: 'right' },
      { speaker: 'ヤス',   text: 'おかしい、とは？', side: 'left' },
      { speaker: 'サチコ', text: 'お父さんは...私のことも、アキラのことも...ちゃんと考えていたはずなんです。あんな遺言、書くはずがない。', side: 'right' },
      { speaker: 'ヤス',   text: '...アキラ、というのは？', side: 'left' },
      { speaker: 'サチコ', text: '...今は、まだ言えません。でも、調べていただければわかります。', side: 'right' },
    ],
  },
  // 第三章 Scene05（42回目）ミドリへの聞き込み
  c3s05: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_19.png',
    bg:           'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ミドリ', text: '...旦那様は、穏やかな方でございました。お客様にも、従業員にも、分け隔てなく。', side: 'right' },
      { speaker: 'ヤス',   text: '亡くなられる前、何か変わったことはありませんでしたか？', side: 'left' },
      { speaker: 'ミドリ', text: 'それは...。', side: 'right' },
      { speaker: 'ヤス',   text: 'ミドリさん？', side: 'left' },
      { speaker: 'ミドリ', text: '...旦那様は、いつも通りでございました。変わったことなど、特には...。', side: 'right' },
      { speaker: 'ヤス',   text: '...わかりました。何かあれば、いつでも話してください。', side: 'left' },
    ],
  },
  // 第三章 Scene06（43回目）リョウタと廊下で偶然
  c3s06: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_20.png',
    bg:           'img/Chapter3/bg/image_merge_bg_inn_interior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ヤス',     text: 'こんにちわ...', side: 'left' },
      { speaker: 'リョウタ', text: 'あ...探偵さんですか？おばあちゃんから聞いてました。', side: 'right' },
      { speaker: 'ヤス',     text: 'リョウタさんですね...突然ですが、おじい様のこと、聞いてもいいですか？', side: 'left' },
      { speaker: 'リョウタ', text: 'そうですね...おじいちゃんは、いつもフミコおばあちゃんのことが一番大事と言ってました。そして旅館は家族全員で守っていくと言ってました。', side: 'right' },
      { speaker: 'ヤス',     text: '...お父様とは、旅館の話はされていましたか？', side: 'left' },
      { speaker: 'リョウタ', text: 'うーん...おじいちゃんは、旅館を父さんに任せることは考えてなかったみたいで...父さんも、それは知ってたみたいで...。', side: 'right' },
      { speaker: 'ヤス',     text: '...大事なことを教えてくれてありがとう。', side: 'left' },
    ],
  },
  // 第三章 Scene07（44回目）遺言書を確認
  c3s07: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_15.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',   text: 'こちらが、遺言書の原本ですね。', side: 'left', showCenter: 'img/Chapter3/icon/image_merge_icon3_05.png' },
      { speaker: 'フミコ', text: 'はい。ノブオさん...主人の長年の友人で弁護士の方が持ってきてくださいました。', side: 'right' },
      { speaker: 'ヤス',   text: '...日付と、インクの色が。少し、気になります。', side: 'left' },
      { speaker: 'フミコ', text: '？', side: 'right' },
      { speaker: 'ヤス',   text: '専門家に鑑定をお願いした方がよさそうです。筆跡の分析も含めて。', side: 'left' },
      { speaker: 'フミコ', text: '...もし、書き換えられていたとしたら...一体、誰が...。', side: 'right' },
    ],
  },
  // 第三章 Scene08（45回目）ノブオ弁護士と面会
  c3s08: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_18.png',
    bg:           'img/Chapter3/bg/image_merge_bg_lawyer_office_rain.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ノブオ', text: '探偵さん...ですか。フミコさんに頼まれた？', side: 'right' },
      { speaker: 'ヤス',   text: 'はい。遺言書の件で、少々お話を。', side: 'left' },
      { speaker: 'ノブオ', text: '遺言書は、正式な手続きを経て作成されたものです。ケイスケ君が...ご本人が直接、私に依頼してきたものですよ。', side: 'right' },
      { speaker: 'ヤス',   text: '作成されたのは、いつ頃でしたか？', side: 'left' },
      { speaker: 'ノブオ', text: '...亡くなる、三週間ほど前でしたか。ただ...遺言書は正式なものです。正式に作成された、ものです。', side: 'right' },
      { speaker: 'ヤス',   text: '...そうですか。ありがとうございました。', side: 'left' },
    ],
  },
  // 第三章 Scene09（46回目）アキラ登場
  c3s09: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_21.png',
    bg:           'img/Chapter3/bg/image_merge_bg_inn_exterior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'アキラ', text: '...ここが、白鷺亭か。', side: 'right' },
      { speaker: 'ヤス',   text: 'どちら様ですか？', side: 'left' },
      { speaker: 'アキラ', text: '俺は...オジロ ケイスケの子です。遺産の権利があるはずなんです。', side: 'right' },
      { speaker: 'ヤス',   text: '...ケイスケさんの、お子さん。', side: 'left' },
      { speaker: 'アキラ', text: '信じてもらえないのはわかってます。でも...俺は本当のことを言ってる。', side: 'right' },
      { speaker: 'ヤス',   text: '...少し、話を聞かせてください。', side: 'left' },
    ],
  },
  // 第三章 Scene10（47回目）コウジがアキラを追い出す
  c3s10: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_16.png',
    bg:           'img/Chapter3/bg/image_merge_bg_inn_exterior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'コウジ', text: '出て行け！証拠もないのに乗り込んできやがって！', side: 'right' },
      { speaker: 'ヤス',   text: 'コウジさん、少し落ち着いて——', side: 'left' },
      { speaker: 'コウジ', text: 'あんたも黙ってろ！そいつは詐欺師だ！親父に隠し子なんているわけがない！', side: 'right' },
      { speaker: 'ヤス',   text: '...（コウジさんの目に、怒りだけでなく焦りが見える）', side: 'left' },
      { speaker: 'コウジ', text: 'とにかく、関係ない奴はここに来るな。遺産は決まっている。', side: 'right' },
    ],
  },
  // 第三章 Scene11（48回目）アキラの身元調査
  c3s11: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_21.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'アキラ', text: '母は...父のことを名前しか教えてくれなかった。「オジロさんという立派な人だった」って。', side: 'right' },
      { speaker: 'ヤス',   text: 'DNA鑑定の結果が出るまでには、少し時間がかかります。', side: 'left' },
      { speaker: 'アキラ', text: '金が目当てだと思ってるでしょう。...正直、遺産なんてどうでもいい。ただ、父親がどんな人だったのか、それだけが知りたかった。', side: 'right' },
      { speaker: 'ヤス',   text: '...その気持ちは、本物に見えます。', side: 'left' },
      { speaker: 'アキラ', text: '...ありがとう。信じてくれる人が、一人でもいれば。', side: 'right' },
    ],
  },
  // 第三章 Scene12（49回目）ミドリが夜こっそり接触
  c3s12: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_19.png',
    bg:           'img/bg/image_merge_bg.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ミドリ', text: '...探偵さん。夜分に申し訳ありません。', side: 'right' },
      { speaker: 'ヤス',   text: 'ミドリさん...何かあったんですか？', side: 'left' },
      { speaker: 'ミドリ', text: 'はっきりとは言えないのですが...旦那様が亡くなる少し前。ノブオさんが旅館に来られて、旦那様とふたりで長い時間、お話しされていました。', side: 'right' },
      { speaker: 'ヤス',   text: 'その後、何か変化はありましたか？', side: 'left' },
      { speaker: 'ミドリ', text: '旦那様が...どこか、ふっきれたような顔をされていて...。それが少し、気になって。', side: 'right' },
      { speaker: 'ヤス',   text: '...大事な話をありがとうございます。また何か思い出したら、話してください。', side: 'left' },
    ],
  },
  // 第三章 Scene13（50回目）フミコが書斎で手紙発見
  c3s13: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_15.png',
    bg:           'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'フミコ', text: '主人の書斎を整理していたら...古い手紙が出てきたんです。', side: 'right' },
      { speaker: 'ヤス',   text: '内容は？', side: 'left' },
      { speaker: 'フミコ', text: '...コウジのことが書いてありました。「旅館を継がせるつもりはない。あの子には、別の道を見つけてほしい」と...。', side: 'right' },
      { speaker: 'ヤス',   text: '遺言書の内容と、真逆ですね。', side: 'left' },
      { speaker: 'フミコ', text: 'ええ...。やっぱり、おかしいんです。あの遺言書は、主人が本当に望んだものじゃない。', side: 'right' },
      { speaker: 'ヤス',   text: '...この手紙、お借りできますか。', side: 'left' },
    ],
  },
  // 第三章 Scene14（51回目）ノブオの事務所を調査
  c3s14: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/Chapter3/bg/image_merge_bg_lawyer_office.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose:    false,
    script: [
      { speaker: 'ヤス', text: '...ノブオ弁護士の事務所。記録を辿れれば。', side: 'left' },
      { speaker: 'ヤス', text: '...（古い決算書、依頼人との契約書...）', side: 'left' },
      { speaker: 'ヤス', text: '...これは。十五年前の横領に関する記録...いくつかの書類に、不自然な修正が入っている。', side: 'left' },
      { speaker: 'ヤス', text: '...ノブオさんには、何か隠していることがある。', side: 'left' },
    ],
  },
  // 第三章 Scene15（52回目）リョウタの重要証言
  c3s15: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_20.png',
    bg:           'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'リョウタ', text: 'あの...探偵さん。一つ、気になることがあって。', side: 'right' },
      { speaker: 'ヤス',     text: 'なんでしょう？', side: 'left' },
      { speaker: 'リョウタ', text: 'ノブオさんが来た翌日...おじいちゃんの様子がすごくおかしかったんです。', side: 'right' },
      { speaker: 'ヤス',     text: 'おかしい、とは？', side: 'left' },
      { speaker: 'リョウタ', text: '笑顔がなくて、部屋にこもって...俺が話しかけても、上の空で。それまでと全然違って...。', side: 'right' },
      { speaker: 'ヤス',     text: '...そのことを、覚えていてくれてありがとう。', side: 'left' },
    ],
  },
  // 第三章 Scene16（53回目）コウジとサチコの口論
  c3s16: {
    title:        '',
    leftImg:      'img/Chapter3/chara/image_merge_order_chara_16.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_17.png',
    bg:           'img/Chapter3/bg/image_merge_bg_inn_interior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'サチコ', text: 'お兄さん、何か知ってるんじゃないの？あの遺言書、本当にお父さんが書いたの？', side: 'right' },
      { speaker: 'コウジ', text: '...うるさい。父さんが書いたものだ。それだけだ。', side: 'left' },
      { speaker: 'サチコ', text: '違う。お父さんはそんな人じゃなかった。私たちみんなのことを考えてた。アキラさんのことも——', side: 'right' },
      { speaker: 'コウジ', text: 'あいつの名前を出すな！', side: 'left' },
      { speaker: 'サチコ', text: '（静かに）...お兄さん、もう止めて。お父さんが悲しむよ。', side: 'right' },
    ],
  },
  // 第三章 Scene17（54回目）ミドリが遂に口を開く
  c3s17: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_19.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ミドリ', text: '...もう、黙っていられません。', side: 'right' },
      { speaker: 'ヤス',   text: 'ミドリさん。', side: 'left' },
      { speaker: 'ミドリ', text: 'ノブオさんに言われたんです。「旦那様の遺言のことは誰にも言うな。言えば旅館を辞めさせる」と...。', side: 'right' },
      { speaker: 'ヤス',   text: 'ノブオさんが、直接？', side: 'left' },
      { speaker: 'ミドリ', text: 'はい。でも...旦那様が遺してくれたものを、このまま黙って見過ごすことなんて、私にはできません。', side: 'right' },
      { speaker: 'ヤス',   text: '...話してくれてありがとうございます。必ず、守ります。', side: 'left' },
    ],
  },
  // 第三章 Scene18（55回目）ノブオを尾行
  c3s18: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_road_night.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose:    false,
    script: [
      { speaker: 'ヤス', text: '...ノブオさん。夜に一人で、どちらへ。', side: 'left' },
      { speaker: 'ヤス', text: '...（尾行を続ける。路地を折れ、銀行の方向へ）', side: 'left' },
      { speaker: 'ヤス', text: '...（貸金庫のある支店。書類らしきものを抱えている）', side: 'left' },
      { speaker: 'ヤス', text: '...隠したいものがある。だから、ここに。', side: 'left' },
    ],
  },
  // 第三章 Scene19（56回目）筆跡鑑定の結果
  c3s19: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_15.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',   text: '筆跡鑑定の結果が出ました。', side: 'left' },
      { speaker: 'フミコ', text: '...どうでしたか？', side: 'right' },
      { speaker: 'ヤス',   text: '遺言書の後半部分——コウジさんに旅館を渡す、という箇所が。明らかに後から書き加えられています。インクの成分と日付のズレが証拠です。', side: 'left' },
      { speaker: 'フミコ', text: '...やっぱり。あの人は、そんなことしない。', side: 'right' },
      { speaker: 'ヤス',   text: 'ご主人は、本来の遺志を書いていた。誰かが、それを書き換えた。', side: 'left' },
      { speaker: 'フミコ', text: '...許せない。でも...誰が...。', side: 'right' },
    ],
  },
  // 第三章 Scene20（57回目）アキラのDNA結果
  c3s20: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_21.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',   text: 'DNA鑑定の結果が出ました。', side: 'left', showCenter: 'img/Chapter3/icon/image_merge_icon3_09.png' },
      { speaker: 'アキラ', text: '...本当に？', side: 'right' },
      { speaker: 'ヤス',   text: '間違いありません。あなたは、オジロ ケイスケさんの血縁です。', side: 'left' },
      { speaker: 'アキラ', text: '...（しばらく黙って）...そうか。本当に、俺の父さんだったんだ。', side: 'right' },
      { speaker: 'ヤス',   text: 'あなたには、相続の権利があります。', side: 'left' },
      { speaker: 'アキラ', text: '...金はいらない。ただ...父さんのことを、もう少し知りたい。それだけです。', side: 'right' },
    ],
  },
  // 第三章 Scene21（58回目）ノブオに証拠を突きつける
  c3s21: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_18.png',
    bg:           'img/Chapter3/bg/image_merge_bg_lawyer_office_messy.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',   text: '筆跡鑑定の結果、遺言書の一部が書き換えられていることが確認されました。', side: 'left' },
      { speaker: 'ノブオ', text: '...それは。何かの、手違いでは...。', side: 'right' },
      { speaker: 'ヤス',   text: 'あなたが貸金庫に保管している書類。それが、本来の遺言書ではないですか？', side: 'left', showCenter: 'img/Chapter3/icon/image_merge_icon3_13.png' },
      { speaker: 'ノブオ', text: '...何を、言っているんですか。そんなものは——', side: 'right', setRightImg: 'img/Chapter3/chara/image_merge_order_chara_18a.png' },
      { speaker: 'ヤス',   text: 'ミドリさんから聞きました。リョウタさんからも。ノブオさん、あなたが脅していたと。', side: 'left' },
      { speaker: 'ノブオ', text: '...っ。', side: 'right' },
    ],
  },
  // 第三章 Scene22（59回目）ノブオ一部自白・伏線②
  c3s22: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_18a.png',
    bg:           'img/Chapter3/bg/image_merge_bg_lawyer_office_night.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ノブオ', text: '...わかりました。私が...コウジさんのために、遺言書を書き直した。', side: 'right', showCenter: 'img/Chapter3/icon/image_merge_icon3_08.png' },
      { speaker: 'ヤス',   text: 'コウジさんに頼まれたんですか？', side: 'left' },
      { speaker: 'ノブオ', text: 'いや...コウジさんは知らない。私が...勝手に。でも、私一人で思いついたことじゃない。ある人から...言われなければ、私は動かなかった。', side: 'right' },
      // 伏線②：ヤスへの間接的な言及
      { speaker: 'ヤス',   text: 'ある人、とは？', side: 'left' },
      { speaker: 'ノブオ', text: '...それだけは。それだけは、言えない。', side: 'right' },
      { speaker: 'ヤス',   text: '...（言えない、ではなく——言いたくない。か）', side: 'left' },
    ],
  },
  // 第三章 Scene23（60回目）コウジが証拠隠滅を図る
  c3s23: {
    title:        '',
    leftImg:      'img/Chapter3/chara/image_merge_order_chara_16.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_17.png',
    bg:           'img/Chapter3/bg/image_merge_bg_inn_interior.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'コウジ', text: '（書類を掴もうとする）全部、なかったことにすれば——', side: 'left', showCenter: 'img/Chapter3/icon/image_merge_icon3_05.png' },
      { speaker: 'サチコ', text: 'やめて、お兄さん。', side: 'right' },
      { speaker: 'コウジ', text: 'サチコ...。', side: 'left' },
      { speaker: 'リョウタ', text: '（廊下から）父さん。おじいちゃんは...こんなことを望んでいなかったよ。', side: 'right' },
      { speaker: 'コウジ', text: '...（手を止める）...俺は...旅館を守りたかっただけだ。', side: 'left' },
      { speaker: 'サチコ', text: '守りたいなら、お父さんの気持ちを守って。旅館じゃなくて。', side: 'right' },
    ],
  },
  // 第三章 Scene24（61回目）真の遺言書
  c3s24: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_19.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'slide', autoClose: false,
    script: [
      { speaker: 'ミドリ', text: '...実は。旦那様から、預かっていたものがあります。', side: 'right' },
      { speaker: 'ヤス',   text: '...それは。', side: 'left' },
      { speaker: 'ミドリ', text: '「何かあった時には、これを。お前だけは信用できる」と、おっしゃって。', side: 'right' },
      { speaker: 'ヤス',   text: '...（封筒を受け取る。開くと——本来の遺言書が）', side: 'left', showCenter: 'img/Chapter3/icon/image_merge_icon3_16.png' },
      { speaker: 'ミドリ', text: '旦那様は...最後まで、家族全員のことを考えていらっしゃいました。', side: 'right' },
      { speaker: 'ヤス',   text: '...ありがとうございます、ミドリさん。ご主人の気持ちは、必ず届けます。', side: 'left' },
    ],
  },
  // 第三章 Scene25（62回目）フミコへの報告・依頼完了
  c3s25: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:     'img/Chapter3/chara/image_merge_order_chara_15.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance:'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',   text: '...本来の遺言書が見つかりました。ご主人は、旅館を家族全員で守ってほしいと、書いていました。', side: 'left' },
      { speaker: 'フミコ', text: '...（しばらく黙って）。', side: 'right' },
      { speaker: 'フミコ', text: 'あの人の...気持ちが、伝わりました。', side: 'right' },
      { speaker: 'ヤス',   text: 'ご主人は、ずっとあなたのことを思っていました。', side: 'left' },
      { speaker: 'フミコ', text: '...ありがとうございます。本当に、ありがとう。', side: 'right' },
    ],
  },
  // 第三章 Scene26（63回目）後日談・ヤスの伏線③
  c3s26: {
    title:        '',
    leftImg:      'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg:           'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose:    false,
    script: [
      { speaker: 'ヤス', text: 'フミコさんも、ようやく安心されましたね。', side: 'left' },
      { speaker: 'ヤス', text: '...白鷺亭は、これからも残っていくでしょう。あの場所に。', side: 'left' },
      // 伏線③：「あの場所に」——何かを知りすぎているような口ぶり
      { speaker: 'ヤス', text: '...うまくいきましたね。', side: 'left' },
      { sound: '...', autoAdvance: true, advanceDelay: 1500 },
      { speaker: 'ヤス', text: '...さて。次は、どんな依頼が来るでしょうか。', side: 'left' },
    ],
  },
  // ===== 第四章：土地に眠る嘘 =====
  // 第四章 Scene01：タケシが事務所を訪れる
  c4s01: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_22.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'タケシ', text: '...失礼します。ヤスヒコ探偵事務所、ですよね。', side: 'right' },
      { speaker: 'ヤス',   text: 'ええ。どうぞ、お掛けください。', side: 'left' },
      { speaker: 'タケシ', text: '...実は、勤めている会社のことで。誰にも言えなくて...。', side: 'right' },
      { speaker: 'ヤス',   text: '落ち着いて。ここは守秘義務があります。', side: 'left' },
      { speaker: 'タケシ', text: '会社が...土地の書類を改ざんしているんです。住民が気づかないうちに、土地が奪われていく。', side: 'right' },
      { speaker: 'ヤス',   text: '...具体的に、聞かせてください。', side: 'left' },
    ],
  },
  // 第四章 Scene02：タケシが詳細を話す
  c4s02: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_22.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'タケシ', text: '私が担当している地区では、都市計画の名目で古い住宅地の買収が進んでいます。でも、申請書の数字が...実際の土地台帳と一致していないんです。', side: 'right' },
      { speaker: 'ヤス',   text: 'それは、意図的な改ざんだと？', side: 'left' },
      { speaker: 'タケシ', text: '上の方から「細かいことは気にするな」と言われました。でも私には...どうしても。', side: 'right' },
      { speaker: 'ヤス',   text: '証拠はありますか？', side: 'left' },
      { speaker: 'タケシ', text: '...コピーを取っておきました。', side: 'right', showCenter: 'img/Chapter4/icon/image_merge_icon4_06.png' },
      { speaker: 'ヤス',   text: '...これは。調査してみましょう。', side: 'left' },
    ],
  },
  // 第四章 Scene03：開発予定地へ
  c4s03: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_old_town.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '...これが、開発予定地か。', side: 'left' },
      { speaker: 'ヤス', text: '（古い住宅地図と現地を見比べる）...番地がずれている。地図上の区画と、実際の境界線が違う。', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_02.png' },
      { speaker: 'ヤス', text: '...これは確かに、意図的に変えなければこうはならない。', side: 'left' },
    ],
  },
  // 第四章 Scene04：ハルカと出会う
  c4s04: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_25.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_field.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'ハルカ', text: 'あの...ここで何をされているんですか？', side: 'right' },
      { speaker: 'ヤス',   text: 'この土地について、少し調べているんです。失礼ですが、こちらの地権者の方ですか？', side: 'left' },
      { speaker: 'ハルカ', text: 'はい...父がこの土地を守ってきました。でも、開発業者から売却を迫られていて。', side: 'right' },
      { speaker: 'ヤス',   text: '断っているにも関わらず？', side: 'left' },
      { speaker: 'ハルカ', text: 'ええ。それに...提示された価格が、市場価格より明らかに低くて。でも「これが相場だ」と言われて。', side: 'right' },
      { speaker: 'ヤス',   text: '...詳しく話を聞かせていただけますか。', side: 'left' },
    ],
  },
  // 第四章 Scene05：シゲルへの聞き込み
  c4s05: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_26.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_old_town.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'シゲル', text: 'あんた、探偵かね。まあ、お上がりなさい。', side: 'right' },
      { speaker: 'ヤス',   text: 'この辺りの土地について、昔からご存知だと聞いて。', side: 'left' },
      { speaker: 'シゲル', text: '五十年以上ここに住んどる。この辺の地図なら頭に入っとる。...何かおかしなことに気づいたかね？', side: 'right' },
      { speaker: 'ヤス',   text: '境界線が変わっているようです。', side: 'left' },
      { speaker: 'シゲル', text: 'やっぱりか。三年前から、少しずつ変わっておった。わしが役所に言っても、「測量し直した」の一点張りで。', side: 'right' },
      { speaker: 'ヤス',   text: '...その測量図、見たことはありますか？', side: 'left' },
    ],
  },
  // 第四章 Scene06：測量図の矛盾を発見
  c4s06: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '（公的な測量図と、会社が使っている測量図を並べる）', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_03.png' },
      { speaker: 'ヤス', text: '...数値が違う。ハルカさんの土地が、会社の図では八十坪少なくなっている。', side: 'left' },
      { speaker: 'ヤス', text: '...しかも、その分は隣接する会社所有地に加算されている。これは明らかな...。', side: 'left' },
    ],
  },
  // 第四章 Scene07：レイコと接触
  c4s07: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_23.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_lobby.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'レイコ', text: '...探偵さん、ですか。アポなしでいらっしゃるとは。', side: 'right' },
      { speaker: 'ヤス',   text: '御社の土地取引について、少々確認したいことがありまして。', side: 'left' },
      { speaker: 'レイコ', text: '法務担当の私への質問なら、お受けする前に理由をお聞かせください。', side: 'right' },
      { speaker: 'ヤス',   text: '測量図と土地台帳の数値に、不一致があります。', side: 'left' },
      { speaker: 'レイコ', text: '...（わずかに表情が変わる）...それは、確認します。今日のところは。', side: 'right' },
      { speaker: 'ヤス',   text: '（何かを知っている。でも言えない——）', side: 'left' },
    ],
  },
  // 第四章 Scene08：土地台帳の改ざんを確認
  c4s08: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '（役所で土地台帳の閲覧を請求する）', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_04.png' },
      { speaker: 'ヤス', text: '...ここだ。三年前の更新記録。登録変更の欄に、本来あるはずの地権者の署名がない。', side: 'left' },
      { speaker: 'ヤス', text: '...代わりに押されているのは、会社のゴム印だけ。こんなことが通ってしまったのか。', side: 'left' },
    ],
  },
  // 第四章 Scene09：カズヤに接触
  c4s09: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_24.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_company.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'カズヤ', text: '...探偵？どのような御用件でしょうか。', side: 'right' },
      { speaker: 'ヤス',   text: '御社が進めている開発計画について、確認したいことがあります。土地の境界線に関して。', side: 'left' },
      { speaker: 'カズヤ', text: '（わずかに笑みを浮かべて）すべて適法に行っております。問題があれば、弁護士を通していただけますか。', side: 'right' },
      { speaker: 'ヤス',   text: '弁護士を通す前に、直接確認したかったので。', side: 'left' },
      { speaker: 'カズヤ', text: '...我々は法律の範囲内で動いています。それ以上でも以下でもない。', side: 'right' },
      { speaker: 'ヤス',   text: '（この余裕は、証拠を持たれても大丈夫という自信か——）', side: 'left' },
    ],
  },
  // 第四章 Scene10：タケシが内部告発メモを提出
  c4s10: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_22.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'タケシ', text: 'これを...社内で密かにメモしていたものです。', side: 'right', showCenter: 'img/Chapter4/icon/image_merge_icon4_09.png' },
      { speaker: 'ヤス',   text: '（受け取って読む）...日付、金額、指示を出した人物の名前まで記録されている。', side: 'left' },
      { speaker: 'タケシ', text: '社長のカズヤさんが直接、部下に「数字を合わせろ」と言うのを聞いた時から書き始めました。', side: 'right' },
      { speaker: 'ヤス',   text: 'これは、重要な証拠になります。身の安全には気をつけてください。', side: 'left' },
      { speaker: 'タケシ', text: '...わかっています。でも、もう引けない。', side: 'right' },
    ],
  },
  // 第四章 Scene11：現場の隠し撮り
  c4s11: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_construction.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '（建設現場の外から観察する）...境界線を示す杭の位置が、公的な測量図と明らかに違う。', side: 'left' },
      { speaker: 'ヤス', text: '（写真を撮る）...現時点での境界杭の位置、記録しておく。', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_10.png' },
      { speaker: 'ヤス', text: '...後から言い訳できないように、GPS座標も記録した。これは動かぬ証拠になる。', side: 'left' },
    ],
  },
  // 第四章 Scene12：レイコの苦悩
  c4s12: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_23.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_lobby.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'レイコ', text: '...先日は、失礼しました。少し、話せますか。', side: 'right' },
      { speaker: 'ヤス',   text: 'もちろんです。', side: 'left' },
      { speaker: 'レイコ', text: '私は...書類の不備に気づいていました。でも、指摘するたびに上から圧力がかかって。「問題ない」「気にするな」と。', side: 'right' },
      { speaker: 'ヤス',   text: 'それを黙認させられていた、と。', side: 'left' },
      { speaker: 'レイコ', text: '私も...被害者なんです。でも証拠を出せば、私も共犯と見られる。どうすれば。', side: 'right' },
      { speaker: 'ヤス',   text: '...話してくれたことで、状況は変わります。一緒に考えましょう。', side: 'left' },
    ],
  },
  // 第四章 Scene13：ハルカが脅迫を打ち明ける
  c4s13: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_25.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_field.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'ハルカ', text: '実は...先週、見知らぬ人に声をかけられました。「売らないと困ることになる」と。', side: 'right' },
      { speaker: 'ヤス',   text: 'それは脅迫です。警察に——', side: 'left' },
      { speaker: 'ハルカ', text: '父は体が弱くて。もし何かあったら、と思うと...届けられなくて。', side: 'right' },
      { speaker: 'ヤス',   text: 'わかりました。私が動きます。ハルカさんとお父様を、必ず守ります。', side: 'left' },
      { speaker: 'ハルカ', text: '...お願いします。この土地は、父が一生かけて守ってきたものなんです。', side: 'right' },
    ],
  },
  // 第四章 Scene14：シゲルの証言
  c4s14: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_26.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_old_town.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'シゲル', text: '...あの会社が来る前、この辺りで起きた昔の話をしよう。三十年前、似たような開発話があった。その時も、土地の値段をごまかされた人がいてな。', side: 'right' },
      { speaker: 'ヤス',   text: 'その時の話を、詳しく聞かせてもらえますか。', side: 'left' },
      { speaker: 'シゲル', text: '当時の開発会社の社長が...今のカズヤの父親だったんじゃ。親子二代で、同じことをやっとる。', side: 'right' },
      { speaker: 'ヤス',   text: '...（それは手がかりになる）記録や証人は残っていますか？', side: 'left' },
      { speaker: 'シゲル', text: 'わしが覚えとる。それと...当時の書類がこの家のどこかにあるはずじゃ。', side: 'right' },
    ],
  },
  // 第四章 Scene15：改ざんの全体像が見えてくる
  c4s15: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '（都市計画図と申請書を並べて比較する）', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_05.png' },
      { speaker: 'ヤス', text: '...段階的に変えている。都市計画図を先に変更し、それに合わせて申請書を作る。役所も騙されてきた。', side: 'left' },
      { speaker: 'ヤス', text: '...これは一人でできることじゃない。組織的な犯罪だ。しかも、相当長い時間をかけて準備されている。', side: 'left' },
    ],
  },
  // 第四章 Scene16：録音データを入手
  c4s16: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_22.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'タケシ', text: 'これを...社長が部下に指示を出している場面を、録音しました。', side: 'right', showCenter: 'img/Chapter4/icon/image_merge_icon4_11.png' },
      { speaker: 'ヤス',   text: '（再生して聴く）...「あの土地は数字を合わせておけ、後はこっちで処理する」。これは...。', side: 'left' },
      { speaker: 'タケシ', text: '社長の声です。間違いない。', side: 'right' },
      { speaker: 'ヤス',   text: 'よく、これを。危険な目に遭いませんでしたか。', side: 'left' },
      { speaker: 'タケシ', text: '...社用携帯を持って会議室に入っただけです。でも、これで証拠になりますよね。', side: 'right' },
      { speaker: 'ヤス',   text: '十分です。大切にしてください。', side: 'left' },
    ],
  },
  // 第四章 Scene17：タケシが姿を消す
  c4s17: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '（タケシへの電話がつながらない）...昨日まで連絡が取れていたのに。', side: 'left' },
      { speaker: 'ヤス', text: '自宅を訪ねてみたが、すでに引っ越した形跡がある。それも、急いで。', side: 'left' },
      { speaker: 'ヤス', text: '...消された？いや——保護されている可能性もある。とにかく、動きを確認しなければ。', side: 'left' },
    ],
  },
  // 第四章 Scene18：レイコの決意
  c4s18: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_23.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_lobby.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'レイコ', text: '...タケシさんが消えたことは知っています。私も、もう限界です。', side: 'right' },
      { speaker: 'ヤス',   text: 'レイコさん、無理はしないでください。', side: 'left' },
      { speaker: 'レイコ', text: 'でも...このまま黙っていたら、ハルカさんたちの土地が奪われる。私が知っていることを、全部話します。', side: 'right' },
      { speaker: 'ヤス',   text: 'あなたの証言は、重要な意味を持ちます。でも、身の安全を最優先に。', side: 'left' },
      { speaker: 'レイコ', text: '...もう怖くはありません。怖いのは、何もしなかったという後悔の方が。', side: 'right' },
    ],
  },
  // 第四章 Scene19：カズヤが逃げようとしている
  c4s19: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_parking_night.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '（深夜の駐車場でカズヤを尾行する）...大きな荷物を持っている。', side: 'left' },
      { speaker: 'ヤス', text: '（電話で話す声が聞こえる）...「手を打っておけ。明日には出る」...逃げるつもりか。', side: 'left' },
      { speaker: 'ヤス', text: '...（急いで動かなければ。証拠を固める前に消えられたら——）', side: 'left' },
    ],
  },
  // 第四章 Scene20：不正送金の明細を発見
  c4s20: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_23.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'レイコ', text: '...これが、私が保管していた送金記録です。', side: 'right', showCenter: 'img/Chapter4/icon/image_merge_icon4_12.png' },
      { speaker: 'ヤス',   text: '（見る）...市の担当官への振り込みがある。これは収賄の証拠です。', side: 'left' },
      { speaker: 'レイコ', text: 'はい。土地台帳の変更が通ったのは、こういう裏取引があったからです。', side: 'right' },
      { speaker: 'ヤス',   text: 'よく、これを保管していてくれました。', side: 'left' },
      { speaker: 'レイコ', text: '...いつか必要になると思っていました。こういう日のために。', side: 'right' },
    ],
  },
  // 第四章 Scene21：タケシが保護されていたと判明
  c4s21: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_22.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'slide', autoClose: false,
    script: [
      { speaker: 'タケシ', text: '...ご心配をかけました。警察の方に保護してもらっていました。', side: 'right' },
      { speaker: 'ヤス',   text: 'よかった。無事でしたか。', side: 'left' },
      { speaker: 'タケシ', text: '社内で、自分が調べていることがバレたようで。でも...録音データと内部メモ、ちゃんと渡してあります。', side: 'right' },
      { speaker: 'ヤス',   text: '証拠は揃っています。あとは、正式に告発状を出す段階です。', side: 'left' },
      { speaker: 'タケシ', text: '...私が、証言します。怖いけど。でも、ここまで来たら。', side: 'right' },
    ],
  },
  // 第四章 Scene22：カズヤへの最後の尋問
  c4s22: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_24.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_company.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',   text: '録音データがあります。送金記録もある。測量図の改ざん証拠も。', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_16.png' },
      { speaker: 'カズヤ', text: '...（初めて余裕が崩れる）それは。', side: 'right' },
      { speaker: 'ヤス',   text: '土地台帳の変更も、市の担当官への贈賄も。すべて記録されています。', side: 'left' },
      { speaker: 'カズヤ', text: '...証拠があったとして、私が実際に指示したという確証は——', side: 'right' },
      { speaker: 'ヤス',   text: 'あなたの声で、直接指示を出しています。録音で。', side: 'left' },
      { speaker: 'カズヤ', text: '...（沈黙）', side: 'right' },
    ],
  },
  // 第四章 Scene23：証人の供述書を作成
  c4s23: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_26.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'シゲル', text: '三十年前の話も、わしが証言する。親子二代でやってきたことの証言にもなるじゃろ。', side: 'right' },
      { speaker: 'ヤス',   text: 'ありがとうございます。供述書として正式に記録させてください。', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_13.png' },
      { speaker: 'シゲル', text: 'こんな歳になって、わしに出番が来るとは思わなかったわい。でも...この土地は守らんといかん。', side: 'right' },
      { speaker: 'ヤス',   text: 'シゲルさんの証言が、すべてをつなげる鍵になります。', side: 'left' },
    ],
  },
  // 第四章 Scene24：ハルカへの報告
  c4s24: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_25.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_field.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'ヤス',   text: '証拠が揃いました。告発状を当局に提出します。この土地の境界は、正式な測量図に基づいて回復されるはずです。', side: 'left' },
      { speaker: 'ハルカ', text: '...本当に、ですか。', side: 'right' },
      { speaker: 'ヤス',   text: 'タケシさん、レイコさん、シゲルさん、みなさんが証言してくれます。', side: 'left' },
      { speaker: 'ハルカ', text: '...（涙をこらえながら）父に、報告できます。ありがとうございます。本当に、ありがとうございます。', side: 'right' },
    ],
  },
  // 第四章 Scene25：弁護士への相談
  c4s25: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '（弁護士からの意見書を受け取る）', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_14.png' },
      { speaker: 'ヤス', text: '...「収集された証拠は、詐欺・公文書偽造・収賄の容疑を立証するに十分なものと判断される」。', side: 'left' },
      { speaker: 'ヤス', text: '...あとは、当局に動いてもらうだけだ。長かったが——ようやくここまで来た。', side: 'left' },
    ],
  },
  // 第四章 Scene26：告発状の提出
  c4s26: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_22.png',
    bg: 'img/bg/image_merge_bg_light.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'タケシ', text: '...出しました。告発状、受理されました。', side: 'right', showCenter: 'img/Chapter4/icon/image_merge_icon4_17.png' },
      { speaker: 'ヤス',   text: 'お疲れ様でした。ここからは、当局が動く番です。', side: 'left' },
      { speaker: 'タケシ', text: '...会社には、もう戻れないかもしれない。でも、それでよかったと思っています。', side: 'right' },
      { speaker: 'ヤス',   text: 'あなたが動いたから、土地が守られる。それは、変わらない事実です。', side: 'left' },
      { speaker: 'タケシ', text: '...ありがとうございました。あなたに頼んで、正解でした。', side: 'right' },
    ],
  },
  // 第四章 Scene27：カズヤ逮捕
  c4s27: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '（ニュースを見ている）...不動産会社社長、公文書偽造・収賄の疑いで逮捕。', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_18.png' },
      { speaker: 'ヤス', text: '...関与した市の職員も複数名が聴取を受けているとのこと。', side: 'left' },
      { speaker: 'ヤス', text: '...タケシさんが動かなければ、これはずっと闇に埋もれていたはずだ。', side: 'left' },
    ],
  },
  // 第四章 Scene28：レイコの後日談
  c4s28: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_23.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_lobby.png',
    leftEntrance: 'fade', flipLeft: true,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'レイコ', text: '...私は、会社を離れることになりました。でも、後悔はしていません。', side: 'right' },
      { speaker: 'ヤス',   text: '次は、どうされるんですか。', side: 'left' },
      { speaker: 'レイコ', text: '不動産の適正な取引を支援するNPOに関わろうと思っています。同じことが起きないように。', side: 'right' },
      { speaker: 'ヤス',   text: 'それは...あなたらしい選択ですね。', side: 'left' },
      { speaker: 'レイコ', text: 'ありがとうございました。あなたが背中を押してくれたから、動けました。', side: 'right' },
    ],
  },
  // 第四章 Scene29：ハルカとシゲル、土地にて
  c4s29: {
    title: '',
    leftImg:  'img/Chapter4/chara/image_merge_order_chara_25.png',
    rightImg: 'img/Chapter4/chara/image_merge_order_chara_26.png',
    bg: 'img/Chapter4/bg/image_merge_bg_ch4_field.png',
    leftEntrance: 'fade', flipLeft: false,
    rightEntrance: 'fade', autoClose: false,
    script: [
      { speaker: 'ハルカ', text: 'シゲルさん...この景色、変わらずにありますね。', side: 'left' },
      { speaker: 'シゲル', text: 'ああ。変わらんのが一番じゃ。あんた、よく頑張ったな。', side: 'right' },
      { speaker: 'ハルカ', text: '父が...退院したら、一緒にここを歩こうと約束しました。', side: 'left' },
      { speaker: 'シゲル', text: '...いい話じゃ。この土地は、次の世代にも残っていく。それでいい。', side: 'right' },
      { speaker: 'ハルカ', text: 'ありがとうございます、シゲルさん。あなたの証言がなかったら。', side: 'left' },
      { speaker: 'シゲル', text: 'お互い様じゃ。長生きするもんじゃなあ。', side: 'right' },
    ],
  },
  // 第四章 Scene30：ヤスの独白・完結
  c4s30: {
    title: '',
    leftImg:  'img/Chapter1/Chara/image_merge_order_chara_00.png',
    bg: 'img/bg/image_merge_bg_hiruma.png',
    leftEntrance: 'fade', flipLeft: true,
    autoClose: false,
    script: [
      { speaker: 'ヤス', text: '土地は、元の境界線に戻された。タケシさんは、新しい職場で働き始めた。レイコさんは、NPOの活動を続けている。', side: 'left' },
      { speaker: 'ヤス', text: 'シゲルさんはいつも通り、あの古い家で過ごしている。ハルカさんのお父様は、回復に向かっているとのこと。', side: 'left' },
      { speaker: 'ヤス', text: '...判決は、下された。', side: 'left', showCenter: 'img/Chapter4/icon/image_merge_icon4_19.png' },
      { speaker: 'ヤス', text: '...それでも、まだ終わっていないことがある気がした。', side: 'left' },
      { sound: '...', autoAdvance: true, advanceDelay: 1500 },
      { speaker: 'ヤス', text: '...さて。次は、どんな依頼が来るでしょうか。', side: 'left' },
    ],
  },
  // ===== 第一章スライド01（2,000コインで解放）=====
  scene02: {
    title:         '',
    leftImg:       'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:      'img/Chapter1/Chara/image_merge_order_chara_01a.png',
    bg:            'img/bg/image_merge_bg_hiruma.png',
    rightEntrance: 'slide',   // ミユが右からスライドイン
    leftEntrance:  'none',    // ヤスは後から登場
    autoClose:     false,
    script: [
      // ─── フェーズ1: 依頼事務所 ───
      // [0] ミユ（右スライドイン後）が話す
      { speaker: 'ミユ', text: 'すみません…！ミケがいなくなっちゃって…！', side: 'right' },
      // [1] ミユ暗転 + ヤス（左右反転）が左からスライドイン
      { speaker: 'ヤス', text: 'なるほど...最後に見かけたのは、どちらですか？', side: 'left',
        showLeft: true, slideLeft: true, flipLeft: true },
      // [2] ヤス暗転 ミユ明転
      { speaker: 'ミユ', text: 'こっちです！', side: 'right' },
      // [3] 両キャラ消去 → 背景チェンジ（自動進行）
      { hideAll: true, changeBg: 'img/bg/image_merge_bg_road_light.png',
        autoAdvance: true },
      // ─── フェーズ2: 道路 ───
      // [4] ミユが右からスライドイン（再登場）
      { speaker: 'ミユ', text: 'この道です…さっきまでいたのに…', side: 'right',
        showRight: true, slideRight: true },
      // [5] ミユ暗転 + ヤス（左右反転）が左からスライドイン
      { speaker: 'ヤス', text: '急に居なくなったのですか？', side: 'left',
        showLeft: true, slideLeft: true, flipLeft: true },
      // [6] ヤス暗転 ミユ明転
      { speaker: 'ミユ', text: 'はい...', side: 'right' },
      // [7] ミユ暗転 ヤス明転
      { speaker: 'ヤス', text: 'わかりました...すぐに探しましょう！', side: 'left' },
    ],
  },
  // 第一章スライド05（プレイヤーLv1・5回目のコイン支払い時）
  scene06: {
    title:         '',
    leftImg:       'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:      'img/Chapter1/Chara/image_merge_order_chara_03.png',
    right2Img:     'img/Chapter1/Chara/image_merge_order_chara_02.png',
    bg:            'img/bg/image_merge_bg_hiruma.png',
    leftEntrance:  'fade',   // ヤス（反転）即表示
    flipLeft:      true,
    rightEntrance: 'fade',   // ケンイチ即表示
    rightShifted:  true,     // ケンイチは左にずれた状態でスタート
    right2Entrance: 'fade',  // ナナコ即表示
    autoClose:     false,
    script: [
      // [0]
      { speaker: 'ヤス', text: '配達記録か何かお持ちですか？...', side: 'left' },
      // [1]
      { speaker: 'ナナコ', text: 'はい...こちらでしょうか？...', side: 'right2' },
      // [2] ヤスが確認する（ト書き）
      { speaker: 'ヤス', text: '（配達記録の担当者名を確認する）', side: 'left' },
      // [3]
      { speaker: 'ケンイチ', text: '...？...どうかされましたか？...', side: 'right' },
      // [4]
      { speaker: 'ヤス', text: 'いえ...何でもありません...', side: 'left' },
      // [5]
      { speaker: 'ヤス', text: '奥様...配達記録ありがとうございました...', side: 'left' },
      // [6]
      { speaker: 'ナナコ', text: 'こちら、どうしたら良いでしょうか？...', side: 'right2' },
      // [7]
      { speaker: 'ヤス', text: 'その前に...ひとつ伺ってもよろしいですか？', side: 'left' },
      // [8]
      { speaker: 'ナナコ', text: '...何でしょうか？...', side: 'right2' },
      // [9]
      { speaker: 'ヤス', text: '猫のミケちゃんが居なくなったのは、配達の前ですか？後ですか？...', side: 'left' },
      // [10]
      { speaker: 'ナナコ', text: 'わたしの記憶では...後だったかと思います...', side: 'right2' },
      // [11] 最終
      { speaker: 'ヤス', text: 'そうですか...', side: 'left' },
    ],
  },
  // 第一章スライド04（プレイヤーLv1・4回目のコイン支払い時）
  scene05: {
    title:         '',
    leftImg:       'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:      'img/Chapter1/Chara/image_merge_order_chara_03.png',
    right2Img:     'img/Chapter1/Chara/image_merge_order_chara_02.png',   // ナナコ
    bg:            'img/bg/image_merge_bg_hiruma.png',
    leftEntrance:  'fade',   // ヤス（反転）即表示
    flipLeft:      true,
    rightEntrance: 'fade',   // ケンイチ即表示
    right2Entrance: 'none',  // ナナコは後から登場
    autoClose:     false,
    script: [
      // [0] ドアノック（サウンドナレーション）
      { sound: 'トントン...' },
      // [1] ナナコが右からスライドイン（ケンイチも左にずれる）
      { speaker: 'ナナコ', text: '突然すみません！...ケンイチの妻です...', side: 'right2',
        showRight2: true, slideRight2: true, shiftRight: true },
      // [2]
      { speaker: 'ヤス', text: 'どうされました？...', side: 'left' },
      // [3] 中央にダンボールアイテム表示
      { showCenter: 'img/Chapter1/Icon/image_merge_icon1_06.png' },
      // [4]
      { speaker: 'ナナコ', text: '実は、届いた荷物に身に覚えがなくて...', side: 'right2' },
      // [5]
      { speaker: 'ヤス', text: '荷物ですか？...', side: 'left' },
      // [6]
      { speaker: 'ケンイチ', text: '警察には、届けたのか？...', side: 'right' },
      // [7]
      { speaker: 'ナナコ', text: 'まだなの...アナタが娘のお礼に探偵事務所に行くと聞いて、慌てて付いてきたから...', side: 'right2' },
      // [8]
      { speaker: 'ヤス', text: 'ちなみに、中身はご覧になりましたか？', side: 'left' },
      // [9]
      { speaker: 'ナナコ', text: 'いえ、怖くて開けてません...ただ、かなり重いものが入っている気がしてます...', side: 'right2' },
      // [10]
      { speaker: 'ヤス', text: '配送業社の方にもお伝えしましたか？...', side: 'left' },
      // [11]
      { speaker: 'ナナコ', text: 'それが、いつもと違う配送業社だったんです...ですので、お伝えはまだ...', side: 'right2' },
      // [12] 最終
      { speaker: 'ヤス', text: 'なるほど...', side: 'left' },
    ],
  },
  // 第一章スライド03（プレイヤーLv1・3回目のコイン支払い時）
  scene04: {
    title:         '',
    leftImg:       'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:      'img/Chapter1/Chara/image_merge_order_chara_03.png',
    bg:            'img/bg/image_merge_bg_hiruma.png',
    leftEntrance:  'slide',   // ヤス（反転）が左からスライドイン
    flipLeft:      true,
    rightEntrance: 'none',    // ケンイチは後から登場
    autoClose:     false,
    script: [
      // [0] ヤス（反転）スライドイン
      { speaker: 'ヤス', text: '次の方、どうぞ！...', side: 'left' },
      // [1] ケンイチが右からスライドイン
      { speaker: 'ケンイチ', text: '先日は、娘がご迷惑をおかけしました...', side: 'right',
        showRight: true, slideRight: true },
      // [2]
      { speaker: 'ヤス', text: 'ミユちゃんのお父様ですね？...猫のミケちゃんも、無事で何よりでした...', side: 'left' },
      // [3]
      { speaker: 'ケンイチ', text: '本当に助かりました...', side: 'right' },
      // [4]
      { speaker: 'ケンイチ', text: 'あの子にとって、とても大切な...', side: 'right' },
      // [5] スマートフォンアイコンが中央にフェードイン → 振動
      { showCenter: 'img/Chapter2/Icon/image_merge_icon2_09.png', shakeCenter: true },
      // [6] ケンイチがスマートフォンに気づく（ト書き）
      { speaker: 'ケンイチ', text: '（スマートフォンを見る）', side: 'right' },
      // [7] 最終
      { speaker: 'ケンイチ', text: 'あれ？...おかしいな...荷物が...', side: 'right' },
    ],
  },
  // 第一章スライド02（プレイヤーLv1・2回目のコイン支払い時）
  scene03: {
    title:         '',
    leftImg:       'img/Chapter1/Chara/image_merge_order_chara_00.png',
    rightImg:      'img/Chapter1/Chara/image_merge_order_chara_01a.png',
    bg:            'img/bg/image_merge_bg_road_light02.png',
    leftEntrance:  'slide',  // ヤス（反転）が左からスライドイン
    flipLeft:      true,
    rightEntrance: 'none',   // ミユは後から登場
    autoClose:     false,
    script: [
      // [0] ヤス（反転）スライドイン後
      { speaker: 'ヤス', text: '…しっ！静かに...', side: 'left' },
      // [1]
      { speaker: 'ヤス', text: 'あの子ですね？', side: 'left' },
      // [2] ヤス暗転 + 猫が画面中央にフェードイン（タップで次へ）
      { showCenter: 'img/Chapter1/Icon/image_merge_icon1_02.png' },
      // [3] ミユが右からスライドイン
      { speaker: 'ミユ', text: 'ミケ！！', side: 'right', showRight: true, slideRight: true },
      // [4] ミユ画像を01bに切り替えてセリフ
      { speaker: 'ミユ', text: 'よかった…ありがとう…！', side: 'right',
        changeRightImg: 'img/Chapter1/Chara/image_merge_order_chara_01b.png' },
      // [5] 全消去・暗転（背景も黒に）
      { hideAll: true, autoAdvance: true, advanceDelay: 600 },
      // [6] hiruma背景に切り替え
      { setBg: 'img/bg/image_merge_bg_hiruma.png', autoAdvance: true, advanceDelay: 300 },
      // [7] ヤス（反転）再スライドイン
      { speaker: 'ヤス', text: '…おかしいですね。', side: 'left',
        showLeft: true, slideLeft: true, flipLeft: true },
      // [8]
      { speaker: 'ヤス', text: 'あの様な場所まで来れるとは思いませんね...', side: 'left' },
      // [9]
      { speaker: 'ヤス', text: 'どういうことでしょう。', side: 'left' },
      // [10] 最終
      { speaker: 'ヤス', text: 'まさか...', side: 'left' },
    ],
  },
};

let advMsgIdx       = 0;
let advCurrentScene = null;
let advCallback     = null;
let advTextPending  = false;

function openAdventureScene(sceneId, callback = null) {
  const scene = ADV_SCENES[sceneId];
  if (!scene) return;
  advCurrentScene = scene;
  advCallback     = callback;
  advMsgIdx       = 0;
  advTextPending  = false;

  const screen = document.getElementById('adventure-screen');
  screen.classList.remove('hidden', 'adv-fade-out');

  // タイトルバー
  const titleBar = document.getElementById('adv-title-bar');
  if (titleBar) {
    titleBar.textContent   = scene.title;
    titleBar.style.display = scene.title ? '' : 'none';
  }

  // キャラ画像セット
  document.querySelector('#adv-chara-left img').src  = scene.leftImg;
  document.querySelector('#adv-chara-right img').src = scene.rightImg;
  const right2El = document.getElementById('adv-chara-right2');
  if (right2El) {
    right2El.querySelector('img').src = scene.right2Img || '';
  }

  const charaLeft   = document.getElementById('adv-chara-left');
  const charaRight  = document.getElementById('adv-chara-right');
  const charaRight2 = document.getElementById('adv-chara-right2');

  // 状態リセット（インラインスタイルも含めてクリア）
  charaLeft.classList.remove('adv-char-shown', 'adv-chara-dim', 'adv-slide-ready', 'adv-slide-active');
  charaRight.classList.remove('adv-char-shown', 'adv-chara-dim', 'adv-slide-ready', 'adv-slide-active', 'adv-shifted');
  charaLeft.style.cssText  = '';
  charaRight.style.cssText = '';
  if (charaRight2) {
    charaRight2.classList.remove('adv-char-shown', 'adv-chara-dim', 'adv-slide-ready', 'adv-slide-active');
    charaRight2.style.cssText = '';
    charaRight2.querySelector('img').classList.remove('adv-img-flip');
  }
  // 反転フラグリセット
  charaLeft.querySelector('img').classList.remove('adv-img-flip');
  charaRight.querySelector('img').classList.remove('adv-img-flip');

  // センター画像リセット
  const centerWrap = document.getElementById('adv-center-wrap');
  if (centerWrap) {
    centerWrap.classList.remove('adv-center-shown', 'adv-center-shaking');
    centerWrap.classList.add('hidden');
    const ci = centerWrap.querySelector('img');
    if (ci) ci.src = '';
  }

  // 背景設定（全プロパティをインラインで設定してCSS競合を完全排除）
  const advScreen = document.getElementById('adventure-screen');
  const bgSrc = scene.bg || 'img/bg/image_merge_bg.png';
  advScreen.style.backgroundImage    = `url('${bgSrc}')`;
  advScreen.style.backgroundSize     = 'cover';
  advScreen.style.backgroundPosition = 'center center';
  advScreen.style.backgroundRepeat   = 'no-repeat';

  // スライドイン共通ヘルパー（インラインスタイル不使用・CSSクラスのみ）
  function _slideIn(el, onComplete) {
    el.classList.add('adv-slide-ready');   // 初期位置へ（opacity:0, off-screen）
    void el.offsetHeight;                  // リフロー強制
    el.classList.add('adv-slide-active');  // ターゲット位置へ（transition 発動）
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.classList.remove('adv-slide-ready', 'adv-slide-active');
      el.classList.add('adv-char-shown');  // opacity:1 を確保してから slide クラスを外す
      onComplete();
    };
    el.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 700);
  }

  // メッセージ開始を一度だけ呼ぶためのフラグ
  let _msgStarted = false;
  function _startMessages() {
    if (_msgStarted) return;
    _msgStarted = true;
    advTextPending = false;
    showAdvMessage(0);
  }

  // ケンイチ事前シフト（right2が既に居るシーン用）
  if (scene.rightShifted) charaRight.classList.add('adv-shifted');

  // right2キャラ: entrance に応じた処理
  if (charaRight2) {
    if (scene.right2Entrance === 'fade') {
      void charaRight2.offsetHeight;
      charaRight2.classList.add('adv-char-shown');
    }
    // 'none': 非表示のまま（showRight2 で後から登場）
  }

  // 右キャラ: entrance に応じた処理
  if (scene.rightEntrance === 'slide') {
    advTextPending = true;
    _slideIn(charaRight, () => {
      const cur = advCurrentScene?.script[advMsgIdx];
      if (cur) charaRight.classList.toggle('adv-chara-dim', cur.side !== 'right');
      // leftEntrance が 'none' なら右スライド完了後にメッセージ開始
      if (scene.leftEntrance === 'none') _startMessages();
    });
  } else if (scene.rightEntrance === 'fade') {
    void charaRight.offsetHeight;
    charaRight.classList.add('adv-char-shown');
  }
  // 'none': 非表示のまま（showRight/slideRight で後から登場）

  // 左キャラ: entrance に応じた処理
  if (scene.leftEntrance === 'slide') {
    advTextPending = true;
    if (scene.flipLeft) charaLeft.querySelector('img').classList.add('adv-img-flip');
    _slideIn(charaLeft, () => {
      _startMessages();
    });
  } else if (scene.leftEntrance === 'none') {
    // 非表示のまま。メッセージ開始は右キャラのスライド完了後に委譲
    // rightEntrance が 'slide' でない場合は即開始
    if (scene.rightEntrance !== 'slide') _startMessages();
  } else {
    // default/fade: 即表示（flipLeftも適用）
    if (scene.flipLeft) charaLeft.querySelector('img').classList.add('adv-img-flip');
    void charaLeft.offsetHeight;
    charaLeft.classList.add('adv-char-shown');
    _startMessages();
  }
}

function showAdvMessage(idx) {
  const scene  = advCurrentScene;
  const msg    = scene.script[idx];
  const isLast = idx >= scene.script.length - 1;

  const charaLeft   = document.getElementById('adv-chara-left');
  const charaRight  = document.getElementById('adv-chara-right');
  const charaRight2 = document.getElementById('adv-chara-right2');

  function _applyText() {
    document.getElementById('adv-speaker').textContent  = msg.speaker ?? '';
    document.getElementById('adv-text').textContent     = msg.text;
    document.getElementById('adv-tap-hint').textContent = '▼ タップで続ける';
    if (isLast && scene.autoClose) {
      setTimeout(closeAdventureScene, 1500);
    }
  }

  // ─── 新機能: 両キャラ消去 + 背景チェンジ（hideAll）───
  if (msg.hideAll) {
    advTextPending = true;
    document.getElementById('adv-speaker').textContent  = '';
    document.getElementById('adv-text').textContent     = '';
    document.getElementById('adv-tap-hint').textContent = '';
    // 全キャラを即座に非表示（CSS transitionを無効化してフラッシュ防止）
    [charaLeft, charaRight, charaRight2].forEach(el => {
      if (!el) return;
      el.style.transition = 'none';
      el.style.opacity    = '0';
      el.classList.remove('adv-char-shown', 'adv-chara-dim', 'adv-shifted');
      el.querySelector('img').classList.remove('adv-img-flip');
    });

    // 背景を即座に切り替え（全プロパティをインラインで上書き）
    const scr = document.getElementById('adventure-screen');
    if (msg.changeBg) {
      scr.style.backgroundImage    = `url('${msg.changeBg}')`;
      scr.style.backgroundSize     = 'cover';
      scr.style.backgroundPosition = 'center center';
      scr.style.backgroundRepeat   = 'no-repeat';
    } else {
      scr.style.backgroundImage = '';  // 背景を黒（background-color: #000）に戻す
    }

    // センター画像も消去
    const cw = document.getElementById('adv-center-wrap');
    if (cw) { cw.classList.remove('adv-center-shown', 'adv-center-shaking'); cw.classList.add('hidden'); }

    if (msg.autoAdvance) {
      setTimeout(() => {
        advTextPending = false; advMsgIdx++; showAdvMessage(advMsgIdx);
      }, msg.advanceDelay ?? 400);
    }
    return;
  }

  // ─── 背景のみ変更（setBg）───
  if (msg.setBg !== undefined) {
    const scr = document.getElementById('adventure-screen');
    if (msg.setBg) {
      scr.style.backgroundImage    = `url('${msg.setBg}')`;
      scr.style.backgroundSize     = 'cover';
      scr.style.backgroundPosition = 'center center';
      scr.style.backgroundRepeat   = 'no-repeat';
    } else {
      scr.style.backgroundImage = '';
    }
    if (msg.autoAdvance) {
      advTextPending = true;
      setTimeout(() => { advTextPending = false; advMsgIdx++; showAdvMessage(advMsgIdx); }, msg.advanceDelay ?? 300);
    }
    return;
  }

  // ─── サウンド・ナレーション（sound）───
  if (msg.sound !== undefined) {
    document.getElementById('adv-speaker').textContent  = '';
    document.getElementById('adv-text').textContent     = msg.sound;
    document.getElementById('adv-tap-hint').textContent = msg.autoAdvance ? '' : '▼ タップで続ける';
    if (msg.autoAdvance) {
      advTextPending = true;
      setTimeout(() => { advTextPending = false; advMsgIdx++; showAdvMessage(advMsgIdx); }, msg.advanceDelay ?? 800);
    }
    return;
  }

  // ─── ケンイチ（right）を左にずらす（shiftRight）───
  if (msg.shiftRight && charaRight) {
    charaRight.classList.add('adv-shifted');
  }

  // ─── 右キャラ画像の差し替え（setRightImg）───
  if (msg.setRightImg && charaRight) {
    charaRight.querySelector('img').src = msg.setRightImg;
  }

  // ─── 第3キャラ（right2）の登場（初回のみ）───
  if (msg.showRight2 && charaRight2 && !charaRight2.classList.contains('adv-char-shown')) {
    if (msg.slideRight2) {
      charaRight2.style.transition = '';
      charaRight2.style.opacity    = '';
      document.getElementById('adv-speaker').textContent  = '';
      document.getElementById('adv-text').textContent     = '';
      document.getElementById('adv-tap-hint').textContent = '';
      charaRight2.classList.add('adv-slide-ready');
      void charaRight2.offsetHeight;
      charaRight2.classList.add('adv-slide-active');
      advTextPending = true;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        charaRight2.classList.remove('adv-slide-ready', 'adv-slide-active');
        charaRight2.classList.add('adv-char-shown');
        // 話者（right2）以外を暗転
        if (charaLeft.classList.contains('adv-char-shown'))
          charaLeft.classList.toggle('adv-chara-dim', msg.side !== 'left');
        if (charaRight.classList.contains('adv-char-shown'))
          charaRight.classList.toggle('adv-chara-dim', msg.side !== 'right');
        charaRight2.classList.toggle('adv-chara-dim', msg.side !== 'right2');
        advTextPending = false;
        _applyText();
      };
      charaRight2.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 700);
      return;
    } else {
      void charaRight2.offsetWidth;
      charaRight2.classList.add('adv-char-shown');
    }
  }

  // ─── 右キャラの登場（初回のみ）───
  if (msg.showRight && !charaRight.classList.contains('adv-char-shown')) {
    if (msg.slideRight) {
      // インラインスタイルをクリア（hideAll で設定された opacity:'0'/transition:'none' を解除）
      charaRight.style.transition = '';
      charaRight.style.opacity    = '';
      // スライドインしてからテキスト表示（CSSクラスのみ・インラインスタイル不使用）
      if (charaLeft.classList.contains('adv-char-shown'))
        charaLeft.classList.toggle('adv-chara-dim', msg.side !== 'left');
      document.getElementById('adv-speaker').textContent  = '';
      document.getElementById('adv-text').textContent     = '';
      document.getElementById('adv-tap-hint').textContent = '';
      charaRight.classList.add('adv-slide-ready');
      void charaRight.offsetHeight;
      charaRight.classList.add('adv-slide-active');
      advTextPending = true;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        charaRight.classList.remove('adv-slide-ready', 'adv-slide-active');
        charaRight.classList.add('adv-char-shown');
        charaRight.classList.toggle('adv-chara-dim', msg.side !== 'right');
        advTextPending = false;
        _applyText();
      };
      charaRight.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 700);
      return;
    } else {
      void charaRight.offsetWidth;
      charaRight.classList.add('adv-char-shown');
    }
  }

  // ─── 左キャラの登場（初回のみ）← showLeft/slideLeft/flipLeft ───
  if (msg.showLeft && !charaLeft.classList.contains('adv-char-shown')) {
    // インラインスタイルをクリア（hideAll で設定された opacity:'0'/transition:'none' を解除）
    charaLeft.style.transition = '';
    charaLeft.style.opacity    = '';
    // flip フラグを img に適用（スライド前に設定して反転状態でスライドイン）
    const leftImg = charaLeft.querySelector('img');
    if (msg.flipLeft) leftImg.classList.add('adv-img-flip');
    else              leftImg.classList.remove('adv-img-flip');
    if (msg.slideLeft) {
      if (charaRight.classList.contains('adv-char-shown')) {
        charaRight.classList.toggle('adv-chara-dim', msg.side !== 'right');
      }
      document.getElementById('adv-speaker').textContent  = '';
      document.getElementById('adv-text').textContent     = '';
      document.getElementById('adv-tap-hint').textContent = '';
      charaLeft.classList.add('adv-slide-ready');
      void charaLeft.offsetHeight;
      charaLeft.classList.add('adv-slide-active');
      advTextPending = true;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        charaLeft.classList.remove('adv-slide-ready', 'adv-slide-active');
        charaLeft.classList.add('adv-char-shown');
        charaLeft.classList.toggle('adv-chara-dim', msg.side !== 'left');
        advTextPending = false;
        _applyText();
      };
      charaLeft.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 700);
      return;
    } else {
      void charaLeft.offsetWidth;
      charaLeft.classList.add('adv-char-shown');
    }
  }

  // ─── 右キャラ画像切り替え（changeRightImg）───
  if (msg.changeRightImg) {
    document.querySelector('#adv-chara-right img').src = msg.changeRightImg;
  }

  // ─── 中央画像フェードイン（showCenter）───
  if (msg.showCenter) {
    const wrap = document.getElementById('adv-center-wrap');
    if (wrap) {
      wrap.querySelector('img').src = msg.showCenter;
      wrap.classList.remove('hidden', 'adv-center-shaking');
      void wrap.offsetHeight;
      wrap.classList.add('adv-center-shown');
      if (msg.shakeCenter) {
        // フェードイン完了後（0.6s）に振動アニメーション開始
        setTimeout(() => wrap.classList.add('adv-center-shaking'), 600);
      }
    }
  }

  // 話者ハイライト / 非話者ディム（side未指定時は全員ディム）
  if (charaLeft.classList.contains('adv-char-shown'))
    charaLeft.classList.toggle('adv-chara-dim', msg.side !== 'left');
  if (charaRight.classList.contains('adv-char-shown'))
    charaRight.classList.toggle('adv-chara-dim', msg.side !== 'right');
  if (charaRight2 && charaRight2.classList.contains('adv-char-shown'))
    charaRight2.classList.toggle('adv-chara-dim', msg.side !== 'right2');

  _applyText();
}

function closeAdventureScene() {
  const screen = document.getElementById('adventure-screen');
  if (screen.classList.contains('hidden') || screen.classList.contains('adv-fade-out')) return;
  screen.classList.add('adv-fade-out');
  const cb = advCallback;
  setTimeout(() => {
    screen.classList.add('hidden');
    screen.classList.remove('adv-fade-out');
    advCurrentScene = null;
    advCallback     = null;
    advTextPending  = false;
    if (cb) cb();
  }, 800);
}

document.getElementById('adventure-screen').addEventListener('click', () => {
  if (!advCurrentScene || advTextPending) return;
  const isLast = advMsgIdx >= advCurrentScene.script.length - 1;
  if (isLast) {
    const msg = advCurrentScene.script[advMsgIdx];
    if (msg.tapCloseDelay != null) {
      setTimeout(closeAdventureScene, msg.tapCloseDelay);
    } else if (!advCurrentScene.autoClose) {
      closeAdventureScene();
    }
    return;
  }
  advMsgIdx++;
  showAdvMessage(advMsgIdx);
});

// ストーリー選択画面のボタン
document.getElementById('story-screen-close-btn').addEventListener('click', () => {
  closeStoryScreen();
});
document.getElementById('story-ch1-next-btn').addEventListener('click', () => {
  closeStoryScreen();
  progressStory(1);
});
document.getElementById('story-ch2-next-btn').addEventListener('click', () => {
  closeStoryScreen();
  progressStory(2);
});
document.getElementById('story-ch3-next-btn').addEventListener('click', () => {
  closeStoryScreen();
  progressStory(3);
});
document.getElementById('story-ch4-next-btn')?.addEventListener('click', () => {
  closeStoryScreen();
  progressStory(4);
});

// デバッグ：ジェネレーター出現
document.getElementById('debug-gen-spawn-btn').addEventListener('click', () => {
  const val = document.getElementById('debug-gen-spawn-select').value;
  if (!val) { showToast('ジェネレーターを選択してください'); return; }
  const emptyIdx = eventState.board.findIndex(c => c === null);
  if (emptyIdx === -1) { showToast('ボードが満杯です'); return; }
  const [type, lvStr] = val.split('-');
  const lv = parseInt(lvStr, 10);
  if (type === 'ev') {
    eventState.board[emptyIdx] = { isEventGen: true, genLevel: lv };
    showToast(`第一章ジェネレーター Lv${lv + 1} を出現`);
  } else if (type === 'fire') {
    eventState.board[emptyIdx] = { isEventGen: true, isFireGen: true, seizoLevel: lv };
    showToast(`第二章ジェネレーター Lv${lv + 1} を出現`);
  } else if (type === 'kante') {
    eventState.board[emptyIdx] = { isEventGen: true, isKanteGen: true, kanteLevel: lv };
    showToast(`第三章ジェネレーター Lv${lv + 1} を出現`);
  } else if (type === 'keikaku') {
    eventState.board[emptyIdx] = { isEventGen: true, isKeikakuGen: true, keikakuLevel: lv };
    showToast(`第四章ジェネレーター Lv${lv + 1} を出現`);
  }
  renderEventBoard();
});

// デバッグ：マージアイテム出現
document.getElementById('debug-item-spawn-btn').addEventListener('click', () => {
  const val = document.getElementById('debug-item-spawn-select').value;
  if (!val) { showToast('アイテムを選択してください'); return; }
  const emptyIdx = eventState.board.findIndex(c => c === null);
  if (emptyIdx === -1) { showToast('ボードが満杯です'); return; }
  const [chStr, stageStr] = val.split('-');
  const chainId = parseInt(chStr, 10);
  const stage   = parseInt(stageStr, 10);
  eventState.board[emptyIdx] = { chainId, stage };
  renderEventBoard();
  const chain = CHAINS[chainId];
  const name = chain?.stageNames?.[stage - 1] ?? `Lv${stage}`;
  showToast(`${chain?.name ?? ''}「${name}」を出現`);
});

// デバッグ：アドベンチャーシーン（第一章・テスト）
document.getElementById('debug-adv-ch1-play').addEventListener('click', () => {
  const val = document.getElementById('debug-adv-ch1-select').value;
  if (!val) { showToast('シーンを選択してください'); return; }
  document.getElementById('debug-screen').classList.add('hidden');
  // scene17（完結）の後に第一章完結バナーを表示
  const cb = val === 'scene17'
    ? () => setTimeout(() => showChapterCompleteBanner('img/UI/image_merge_ch1_complete.png'), 80)
    : null;
  openAdventureScene(val, cb);
});

// デバッグ：アドベンチャーシーン（第二章）
document.getElementById('debug-adv-ch2-play').addEventListener('click', () => {
  const val = document.getElementById('debug-adv-ch2-select').value;
  if (!val) { showToast('シーンを選択してください'); return; }
  document.getElementById('debug-screen').classList.add('hidden');
  openAdventureScene(val);
});

// デバッグ：アドベンチャーシーン（第三章）
document.getElementById('debug-adv-ch3-play').addEventListener('click', () => {
  const val = document.getElementById('debug-adv-ch3-select').value;
  if (!val) { showToast('シーンを選択してください'); return; }
  document.getElementById('debug-screen').classList.add('hidden');
  openAdventureScene(val);
});

// デバッグ：アドベンチャーシーン（第四章）
document.getElementById('debug-adv-ch4-play').addEventListener('click', () => {
  const val = document.getElementById('debug-adv-ch4-select').value;
  if (!val) { showToast('シーンを選択してください'); return; }
  document.getElementById('debug-screen').classList.add('hidden');
  openAdventureScene(val);
});

// デバッグ：相関図
document.getElementById('debug-kankei-open').addEventListener('click', () => {
  document.getElementById('debug-screen').classList.add('hidden');
  openKankeiScreen();
});
document.getElementById('debug-kankei-reset').addEventListener('click', () => {
  // seenScenes をクリア（相関図リセット確認用）
  state.seenScenes = [];
  showToast('相関図をリセットしました');
});
document.getElementById('debug-kankei-all').addEventListener('click', () => {
  // 第一章全シーンを既読にして全解放確認
  if (!state.seenScenes) state.seenScenes = [];
  CH1_KANKEI_NODES.forEach(n => { if (!state.seenScenes.includes(n.unlockScene)) state.seenScenes.push(n.unlockScene); });
  CH1_KANKEI_EDGES.forEach(e => { if (!state.seenScenes.includes(e.unlockScene)) state.seenScenes.push(e.unlockScene); });
  CH1_KANKEI_BADGES.forEach(b => { if (!state.seenScenes.includes(b.unlockScene)) state.seenScenes.push(b.unlockScene); });
  document.getElementById('debug-screen').classList.add('hidden');
  openKankeiScreen();
  showToast('相関図を全解放しました');
});

document.getElementById('story-btn').addEventListener('click', () => {
  if (isTutorialInProgress()) return;
  openStoryScreen();
});

document.getElementById('settings-close').addEventListener('click', () => {
  document.getElementById('settings-screen').classList.add('hidden');
});

document.getElementById('settings-catalog-btn').addEventListener('click', () => {
  hideNaviHint();
  document.getElementById('settings-screen').classList.add('hidden');
  openCatalog();
});

document.getElementById('settings-shop-btn').addEventListener('click', () => {
  hideNaviHint();
  document.getElementById('settings-screen').classList.add('hidden');
  renderShop();
  document.getElementById('shop-screen').classList.remove('hidden');
});

document.getElementById('settings-characters-btn').addEventListener('click', () => {
  hideNaviHint();
  document.getElementById('settings-screen').classList.add('hidden');
  renderCharacters();
  document.getElementById('characters-screen').classList.remove('hidden');
});

// ========================================
// アイテムリストボタン（複数箇所）
// ========================================
function openCatalog() {
  catalogCurrentChain = 'event';
  renderCatalog();
  document.getElementById('catalog-screen').classList.remove('hidden');
}
document.getElementById('catalog-btn').addEventListener('click', () => { if (isTutorialInProgress()) return; openCatalog(); });
document.getElementById('main-catalog-btn').addEventListener('click', () => { if (isTutorialInProgress()) return; openCatalog(); });
document.getElementById('ev-catalog-btn').addEventListener('click', () => {
  if (isTutorialInProgress()) return;
  if (!mainGameStarted) return; // プレゲーム・エピローグ中は無効
  openCatalog();
});

document.getElementById('catalog-close').addEventListener('click', () => {
  document.getElementById('catalog-screen').classList.add('hidden');
  if (pendingGenMergeTutStart) {
    pendingGenMergeTutStart = false;
    renderGenMergeTutPanel();
  }
});

// ========================================
// ショップ
// ========================================
function renderShop() {
  const list = document.getElementById('shop-list');
  list.innerHTML = '';

  const items = [
    {
      icon: HP_ICON,
      title: '無料 体力回復',
      detail: '体力 +25',
      badge: '無料',
      badgeClass: 'badge-free',
      remaining: () => shopRemaining(state.shop.lastFreeEnergy),
      canBuy: () => !shopRemaining(state.shop.lastFreeEnergy),
      btnLabel: '無料でもらう',
      action() {
        state.shop.lastFreeEnergy = Date.now();
        addEnergy(25, '無料体力ゲット！');
        renderShop();
      },
    },
    {
      icon: HP_ICON,
      title: '体力大回復',
      detail: '体力 +100',
      badge: `${COIN_ICON} 10,000`,
      badgeClass: 'badge-coin',
      remaining: () => shopRemaining(state.shop.lastCoinEnergy),
      canBuy: () => !shopRemaining(state.shop.lastCoinEnergy) && state.coin >= 10000,
      btnLabel: `${COIN_ICON} 10,000で購入`,
      action() {
        if (state.coin < 10000) { showToast('コインが足りません'); return; }
        state.shop.lastCoinEnergy = Date.now();
        state.coin -= 10000;
        addEnergy(100, 'コイン購入 体力+100！');
        renderShop();
        renderHeader();
      },
    },
    {
      icon: HP_ICON,
      title: '体力大回復',
      detail: '体力 +100',
      badge: '💎 10',
      badgeClass: 'badge-diamond',
      remaining: () => shopRemaining(state.shop.lastDiamondEnergy),
      canBuy: () => !shopRemaining(state.shop.lastDiamondEnergy) && state.diamond >= 10,
      btnLabel: '💎 10で購入',
      action() {
        if (state.diamond < 10) { showToast('ダイヤが足りません'); return; }
        state.shop.lastDiamondEnergy = Date.now();
        state.diamond -= 10;
        trackDailyDiamond(10);
        addEnergy(100, 'ダイヤ購入 体力+100！');
        renderShop();
        renderHeader();
      },
    },
  ];

  items.forEach(item => {
    const rem = item.remaining();
    const ok  = item.canBuy();
    const card = document.createElement('div');
    card.className = 'shop-item';
    card.innerHTML = `
      <div class="shop-item-left">
        <span class="shop-item-icon">${item.icon}</span>
        <div class="shop-item-info">
          <div class="shop-item-title">${item.title}</div>
          <div class="shop-item-detail">${item.detail}</div>
        </div>
      </div>
      <div class="shop-item-right">
        <span class="shop-badge ${item.badgeClass}">${item.badge}</span>
        ${rem ? `<div class="shop-timer">⏳ ${rem}</div>` : ''}
        <button class="shop-btn${ok ? '' : ' shop-btn-disabled'}">${ok ? item.btnLabel : (rem ? 'クールダウン中' : item.btnLabel)}</button>
      </div>
    `;
    if (ok) card.querySelector('.shop-btn').addEventListener('click', () => item.action());
    list.appendChild(card);
  });
}

// ショップ表示中タイマー（残り時間更新）
let shopTimerInterval = null;

document.getElementById('shop-btn').addEventListener('click', () => {
  if (isTutorialInProgress()) return;
  renderShop();
  document.getElementById('shop-screen').classList.remove('hidden');
  shopTimerInterval = setInterval(renderShop, 60000); // 1分ごと更新
});

document.getElementById('shop-close').addEventListener('click', () => {
  document.getElementById('shop-screen').classList.add('hidden');
  clearInterval(shopTimerInterval);
  shopTimerInterval = null;
});

// ========================================
// イベントマップ① - メモ帳チュートリアル
// ========================================

const EVENT_CHAIN = {
  name: '第一章',
  stages: ['📝','🐱','📔','📒','📕','📗','📘','📙','📚','🗂️','🗃️','🏆'],
  stageImages: [
    'img/Chapter1/Icon/image_merge_icon1_01.png', // Lv1
    'img/Chapter1/Icon/image_merge_icon1_02.png', // Lv2
    'img/Chapter1/Icon/image_merge_icon1_03.png', // Lv3
    'img/Chapter1/Icon/image_merge_icon1_04.png', // Lv4
    'img/Chapter1/Icon/image_merge_icon1_05.png', // Lv5
    'img/Chapter1/Icon/image_merge_icon1_06.png', // Lv6
    'img/Chapter1/Icon/image_merge_icon1_07.png', // Lv7
    'img/Chapter1/Icon/image_merge_icon1_08.png', // Lv8
    'img/Chapter1/Icon/image_merge_icon1_09.png', // Lv9
    'img/Chapter1/Icon/image_merge_icon1_10.png', // Lv10
    'img/Chapter1/Icon/image_merge_icon1_11.png', // Lv11
    'img/Chapter1/Icon/image_merge_icon1_12.png', // Lv12
  ],
  stageNames: [
    'メモ帳','猫','猫のおもちゃ','足跡',
    'スニーカー','ダンボール','謎の石','カメラ',
    '証拠写真','破られた写真','相関図のボード','何かを示すボード',
  ],
};

// イベントマップ ジェネレーター画像（Lv別）
const EVENT_GEN_IMAGES = [
  'img/Chapter1/Icon/image_merge_gene1_01.png', // Lv1
  'img/Chapter1/Icon/image_merge_gene1_02.png', // Lv2
  'img/Chapter1/Icon/image_merge_gene1_03.png', // Lv3
  'img/Chapter1/Icon/image_merge_gene1_04.png', // Lv4
];
// 第一章ジェネレーター名（Lv1〜4）
const EVENT_GEN_NAMES = ['メモ机', '観察キット', '調査バッグ', '調査バッグ+'];

// 第二章チェーンID（CHAINS配列のインデックス）
const SEIZO_CHAIN_ID = 11;

// 製造機ジェネレーター画像（Lv1〜7）
const SEIZO_GEN_IMAGES = [
  'img/Chapter2/Icon/image_merge_gene2_01.png', // Lv1
  'img/Chapter2/Icon/image_merge_gene2_02.png', // Lv2
  'img/Chapter2/Icon/image_merge_gene2_03.png', // Lv3
  'img/Chapter2/Icon/image_merge_gene2_04.png', // Lv4
  'img/Chapter2/Icon/image_merge_gene2_05.png', // Lv5
  'img/Chapter2/Icon/image_merge_gene2_06.png', // Lv6
  'img/Chapter2/Icon/image_merge_gene2_07.png', // Lv7
];
// 第二章ジェネレーター名（Lv1〜7）
const SEIZO_GEN_NAMES = ['鍵製造機', 'ICカード製造機', '鍛冶製造機', '監視室', 'レーダー探知機', 'マンション模型', '3Dプリンター'];

// 第三章チェーンID
const KANTEITA_CHAIN_ID = 12;

// 第三章ジェネレーター画像（Lv1〜7）- 鑑定台
const KANTEITA_GEN_IMAGES = [
  'img/Chapter3/icon/image_merge_gene3_01.png', // Lv1
  'img/Chapter3/icon/image_merge_gene3_02.png', // Lv2
  'img/Chapter3/icon/image_merge_gene3_03.png', // Lv3
  'img/Chapter3/icon/image_merge_gene3_04.png', // Lv4
  'img/Chapter3/icon/image_merge_gene3_05.png', // Lv5
  'img/Chapter3/icon/image_merge_gene3_06.png', // Lv6
  'img/Chapter3/icon/image_merge_gene3_07.png', // Lv7
];
const KANTEITA_GEN_NAMES = ['鑑定台', '鑑定台+', '精密鑑定機', '解析装置', '真相分析機', '証拠鑑定室', '完全解析台'];

// 第四章チェーンID
const KEIKAKU_CHAIN_ID = 13;

// 第四章ジェネレーター画像（Lv1〜7）- 設計台
const KEIKAKU_GEN_IMAGES = [
  'img/Chapter4/icon/image_merge_gene4_01.png', // Lv1
  'img/Chapter4/icon/image_merge_gene4_02.png', // Lv2
  'img/Chapter4/icon/image_merge_gene4_03.png', // Lv3
  'img/Chapter4/icon/image_merge_gene4_04.png', // Lv4
  'img/Chapter4/icon/image_merge_gene4_05.png', // Lv5
  'img/Chapter4/icon/image_merge_gene4_06.png', // Lv6
  'img/Chapter4/icon/image_merge_gene4_07.png', // Lv7
];
const KEIKAKU_GEN_NAMES = ['設計台', '設計台+', '精密設計機', '計画分析台', '都市解析機', '証拠設計室', '完全解析台'];

// 第二章ジェネレーター Lvボタン別出力設定（Lucky/PowerはLUCKY_CONFIG/GEN_POWER_BONUSを使用）
const FIRE_POWER_CONFIG = [
  { outStage: 1 }, // Lv1ボタン ⚡1
  { outStage: 2 }, // Lv2ボタン ⚡2
  { outStage: 4 }, // Lv4ボタン ⚡4
  { outStage: 5 }, // Lv8ボタン ⚡8
  { outStage: 6 }, // Lv16ボタン ⚡16
];

// 製造機ジェネレーター出力設定（旧・互換のため残存）
const SEIZO_GEN_CONFIG = [
  { outStage: 1, luckyProb: 0.01, luckyMult: 2.0 },
  { outStage: 2, luckyProb: 0.03, luckyMult: 1.5 },
  { outStage: 3, luckyProb: 0.05, luckyMult: 2.0 },
  { outStage: 4, luckyProb: 0.07, luckyMult: 2.0 },
  { outStage: 5, luckyProb: 0.09, luckyMult: 1.2 },
  { outStage: 6, luckyProb: 0.07, luckyMult: 1.5 },
  { outStage: 7, luckyProb: 0.05, luckyMult: 1.2 },
];

// 製造機ジェネレーターLvアップ条件（製造機アイテムが特定Lvに達したときLvアップ）
const SEIZO_GEN_LEVELUP_TRIGGERS = [
  { triggerStage: 3,  toLevel: 2 },
  { triggerStage: 5,  toLevel: 3 },
  { triggerStage: 7,  toLevel: 4 },
  { triggerStage: 8,  toLevel: 5 },
  { triggerStage: 9,  toLevel: 6 },
  { triggerStage: 10, toLevel: 7 },
];

const EVENT_COLS = 7;
const EVENT_ROWS = 9;
const EVENT_TOTAL = EVENT_COLS * EVENT_ROWS;

// 霧セル → 埋め込みステージ (1/2/3) のマップ
// 行列は1-indexed で指定:
//   Lv1: 5行目3-5列, 6-8行目2・6列, 9行目3-5列
//   Lv2: 5行目1-2・6-7列, 6-8行目1・7列, 9行目1-2・6-7列
//   Lv3: それ以外の霧セル（行0-3、全列）
function buildFogItemMap() {
  const map = new Map(); // index → stage
  const lv1Set = new Set([30,31,32, 36,40, 43,47, 50,54, 58,59,60]);
  const lv2Set = new Set([28,29,33,34, 35,41, 42,48, 49,55, 56,57,61,62]);

  // 行0-3 全列 (indices 0-27) → Lv3
  for (let i = 0; i < 28; i++) map.set(i, 3);
  // 行4 (indices 28-34)
  for (let i = 28; i <= 34; i++) {
    if (lv1Set.has(i))      map.set(i, 1);
    else if (lv2Set.has(i)) map.set(i, 2);
  }
  // 行5-7 の霧列 (col 0,1,5,6)
  for (let row = 5; row <= 7; row++) {
    [0, 1, 5, 6].forEach(col => {
      const idx = row * 7 + col;
      if (lv1Set.has(idx))      map.set(idx, 1);
      else if (lv2Set.has(idx)) map.set(idx, 2);
    });
  }
  // 行8 全列 (indices 56-62)
  for (let i = 56; i < 63; i++) {
    if (lv1Set.has(i))      map.set(i, 1);
    else if (lv2Set.has(i)) map.set(i, 2);
  }
  return map;
}
const EVENT_FOG_ITEM_MAP = buildFogItemMap();

// 初期状態でマージ可能な霧セル（ボード外周の霧：5行3-5列 / 6-8行2・6-7列 / 9行3-5列）
const INITIAL_UNLOCKED_FOG = new Set([30,31,32, 36,40, 43,47, 50,54, 58,59,60]);

// ジェネレーターマージ誘導チュートリアルのステップ定義
const GEN_MERGE_TUT_STEPS = [
  { type: 'focus', text: 'もうひとつの"メモ机"が出ました。\n"メモ机"と"メモ机"を組み合わせてください。' },
  { type: 'msg',   text: '"メモ机"がレベルアップしました。\n出せるアイテムのLvが上がります。' },
  { type: 'msg',   text: '出すアイテムレベルを上下したい時は、"メモ机"を選択するとメッセージの横にレベルボタンが出るので、タップしてレベルを変更してください。' },
];

// アイテムヒントテキスト（アイテム名は後で差し替え）
const ITEM_HINT_TEXT = '？？？？をマージさせて次のレベルにアップしましょう。';

// ========================================
// チュートリアルステップ定義
// type: 'blocking_msg' → オーバーレイ表示・タップで次へ
//       'gen_focus'    → ジェネレーターのみ操作可（2回タップで自動進行）
//       'merge_focus'  → 2個のLv1アイテムのみ操作可（マージで自動進行）
// ========================================
const TUTORIAL_STEPS = [
  { type: 'blocking_msg', text: '私は、アナタの助手のヤスヒコと申します。\nヤスと呼んでください。' },
  { type: 'blocking_msg', text: 'アナタは、新米探偵です。' },
  { type: 'blocking_msg', text: 'これから、様々なご依頼を解決して頂きます。' },
  // ↑ #2 完了後にアドベンチャーシーン01が自動挿入される
  { type: 'gen_focus',    text: 'まずは、"メモ帳"を\n２回タップしてみてください。' },
  { type: 'merge_focus',  text: '新しい"アイテム"が出ましたね？\nその同じ"アイテム"を重ねてみてください。' },
  { type: 'blocking_msg', text: '重ねると新しい"アイテム"に\nなりましたね？' },
  { type: 'blocking_msg', text: '重ねた"アイテム"で\n"依頼"を解決することができます。' },
  // 依頼解決チュートリアル
  { type: 'blocking_msg', text: '先ほどの依頼人が依頼をしてきています。', showRequest: true, noOverlay: true },
  { type: 'request_focus', text: '"依頼解決"ボタンをタップして、\n依頼を解決してください。' },
  // 依頼解決後
  { type: 'blocking_msg', text: '依頼を解決すると、報酬を頂けます。' },
  { type: 'blocking_msg', text: '引き続き、たくさんの依頼を解決して頂きます。' },
  { type: 'blocking_msg', text: 'それでは、探偵業のはじまりです。' },
];

let eventState = {
  board: Array(EVENT_TOTAL).fill(null),
  selectedCell: null,
  tutorialStep: 0,       // TUTORIAL_STEPS.length に達したら完了
  tutorialGenTaps: 0,    // gen_focusフェーズのタップカウント
  discovered: {},        // 発見済みイベントアイテム { stage: true }
  requests: [],          // イベントマップ用依頼リスト
  genLevelUpReady: false, // （旧フラグ、互換のため残存）
  fireGenUnlocked: false,  // 製造機ジェネレーター解放済み
  seizoGenLevel: 0,        // 製造機ジェネレーターの現在Lv（0=Lv1, 6=Lv7）
  seizoDiscovered: {},      // 発見済み製造機アイテム { stage: true }
  seizoFirstItemShown: false, // 第二章マージアイテム初出現メッセージ表示済み
  kanteGenUnlocked: false, // 鑑定台ジェネレーター解放済み（第三章）
  kanteGenLevel: 0,        // 鑑定台ジェネレーターの現在Lv（0=Lv1, 6=Lv7）
  kanteDiscovered: {},     // 発見済み鑑定台アイテム { stage: true }
  kanteRevealed: {},       // 第三章アイテム: stage→true（ダイヤ取得済み）
  keikakuGenUnlocked: false, // 設計台ジェネレーター解放済み（第四章）
  keikakuGenLevel: 0,        // 設計台ジェネレーターの現在Lv（0=Lv1, 6=Lv7）
  keikakuDiscovered: {},     // 発見済み設計台アイテム { stage: true }
  keikakuRevealed: {},       // 第四章アイテム: stage→true（ダイヤ取得済み）
  seizoLvTriggered: new Set(), // 製造機LvアップのトリガーになったステージSet
  kanteLvTriggered: new Set(), // 鑑定台LvアップのトリガーになったプレイヤーLvSet
  keikakuLvTriggered: new Set(), // 設計台LvアップのトリガーになったプレイヤーLvSet
  kankeiViewedScenes: [],      // 相関図を最後に開いた時点のseenScenes（アテンション判定用）
  ch1BannerShown: false,       // 第一章完了バナーを表示済みか
  pendingGenLvUpNotice: [],   // ストーリー中に追加されたジェネレータータイルの通知待ちリスト
  genUpTriggered: new Set(), // Lvアップ用タイル出現済みステージ {4, 8, 12}
  completedLowStages: new Set(), // 一度解決したLv1-5のステージキー（永久に再出現しない）
  recentlySolvedKeys: new Set(), // 直前に解決した依頼のキー Set（次の依頼解決時に置き換え→自動解除）
  unlockedFogCells: new Set(),  // マージ可能な霧セルのインデックス
  genMergeTutStep: null,        // ジェネレーターマージ誘導チュート: null=非アクティブ, 0/1/2=ステップ
  genMergeTutDone: false,       // 一度完了したら二度と出さない
  bubbleTutShown: false,        // しゃぼん玉説明ガイド表示済み
  energyTutShown: false,        // スタミナ不足説明ガイド表示済み
  genPowerLevel: 0,             // 第一章ジェネレーター 現在選択中の出力パワーレベル
  firePowerLevel: 0,            // 第二章ジェネレーター 現在選択中の出力パワーレベル
  revealed: {},            // 第一章アイテム: stage→true（ダイヤ取得済み）
  seizoRevealed: {},       // 第二章アイテム: stage→true
  genDiscovered: {},       // ジェネレーター: 'ch1_N'/'ch2_N'→true（出現済み）
  genRevealed: {},         // ジェネレーター: 同キー→true（ダイヤ取得済み）
};

// タッチデバイス判定
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

let evDrag = {
  active: false,
  fromIdx: null,
  ghost: null,
  tapHandled: false,
  startX: 0,
  startY: 0,
  hasMoved: false, // 指/マウスが閾値以上動いたか（ドラッグ vs タップ判定）
};

let mainGameStarted = false;        // チュートリアル → メインゲーム移行済みフラグ
let pendingGenMergeTutStart = false; // カタログ閉じたらジェネレーター誘導を開始するフラグ

function initEventMap() {
  eventState.board = Array(EVENT_TOTAL).fill(null);
  eventState.selectedCell = null;
  eventState.tutorialStep = 0;
  eventState.tutorialGenTaps = 0;
  eventState.requests = [];
  eventState.genLevelUpReady   = false;
  eventState.fireGenUnlocked   = false;
  eventState.seizoGenLevel     = 0;
  eventState.seizoDiscovered      = {};
  eventState.seizoFirstItemShown  = false;
  eventState.kanteGenUnlocked     = false;
  eventState.kanteGenLevel     = 0;
  eventState.kanteDiscovered   = {};
  eventState.kanteRevealed     = {};
  eventState.keikakuGenUnlocked    = false;
  eventState.keikakuGenLevel       = 0;
  eventState.keikakuDiscovered     = {};
  eventState.keikakuRevealed       = {};
  eventState.seizoLvTriggered  = new Set();
  eventState.kanteLvTriggered      = new Set();
  eventState.keikakuLvTriggered    = new Set();
  eventState.kankeiViewedScenes    = [];
  eventState.ch1BannerShown        = false;
  eventState.pendingGenLvUpNotice  = [];
  eventState.genUpTriggered        = new Set();
  eventState.completedLowStages = new Set();
  eventState.recentlySolvedKeys = new Set();
  eventState.unlockedFogCells   = new Set(INITIAL_UNLOCKED_FOG);
  eventState.genMergeTutStep    = null;
  eventState.genMergeTutDone    = false;
  eventState.bubbleTutShown     = false;
  eventState.energyTutShown     = false;
  eventState.genPowerLevel      = 0;
  eventState.firePowerLevel     = 0;
  eventState.revealed           = {};
  eventState.seizoRevealed      = {};
  eventState.genDiscovered      = {};
  eventState.genRevealed        = {};
  eventState.catalogTutShown    = false;

  // 霧アイテム配置（Lv1/2/3）
  EVENT_FOG_ITEM_MAP.forEach((stage, i) => {
    eventState.board[i] = { isFog: true, stage };
  });

  // メモ帳ジェネレーターを配置（霧でないセルの最初の空きに）
  const genIdx = eventState.board.findIndex(c => c === null);
  if (genIdx !== -1) {
    eventState.board[genIdx] = { isEventGen: true, genLevel: 0 };
    discoverGen('ch1', 0); // Lv1 を発見
  }
}

// ========================================
// チュートリアル制御
// ========================================
function isTutorialComplete() {
  return eventState.tutorialStep >= TUTORIAL_STEPS.length;
}

// メインチュートリアル・ジェネレーターマージ誘導・ガイドが進行中か
function isTutorialInProgress() {
  return !isTutorialComplete() || isGenMergeTutActive() || isGuideInProgress();
}

function currentTutStep() {
  return isTutorialComplete() ? null : TUTORIAL_STEPS[eventState.tutorialStep];
}

function advanceTutorial() {
  eventState.tutorialStep++;

  // ステップ#2→#3 の間にアドベンチャーシーン01を挿入
  if (eventState.tutorialStep === 3) {
    document.getElementById('tutorial-panel')?.classList.add('hidden');
    document.getElementById('tutorial-overlay')?.classList.add('hidden');
    if (!state.seenScenes) state.seenScenes = [];
    if (!state.seenScenes.includes('scene01')) state.seenScenes.push('scene01');
    openAdventureScene('scene01', () => {
      // ミユ「ありがとうございます！」後にヘッダー・依頼行・盤面を表示
      document.getElementById('event-screen').classList.remove('pre-game');
      renderTutorialPanel();
      renderEventBoard();
      renderEventRequest();
      renderEventHeader();
    });
    return;
  }

  renderTutorialPanel();
  renderEventBoard();
  renderEventRequest();
  renderEventHeader();
}

function playPVThenStart(onDone) {
  const overlay = document.getElementById('pv-overlay');
  const video   = document.getElementById('pv-video');
  const skipBtn = document.getElementById('pv-skip-btn');
  if (!overlay || !video) { onDone(); return; }

  function finish() {
    video.pause();
    overlay.classList.add('hidden');
    onDone();
  }

  video.src = 'movie/PV_merge_op.mov';
  overlay.classList.remove('hidden');
  video.play().catch(() => finish()); // 自動再生がブロックされた場合はそのままスキップ

  video.addEventListener('ended', finish, { once: true });
  skipBtn.addEventListener('click', finish, { once: true });
}

function transitionToMainGame() {
  if (mainGameStarted) return;
  mainGameStarted = true;

  // HP を 100 に回復
  state.energy = 100;
  renderEventHeader();

  // チュートリアル完了後にイベントマップ本編へ移行
  const genItem = eventState.board.find(c => c && c.isEventGen);
  eventState.board = Array(EVENT_TOTAL).fill(null);
  // 霧アイテムを再配置（Lv1/2/3）
  EVENT_FOG_ITEM_MAP.forEach((stage, i) => { eventState.board[i] = { isFog: true, stage }; });
  // 初期解放霧セルをリセット
  eventState.unlockedFogCells = new Set(INITIAL_UNLOCKED_FOG);
  // メモ帳ジェネレーターを再配置（Lvは引き継ぐ）
  const genIdx = eventState.board.findIndex(c => c === null);
  if (genIdx !== -1) {
    eventState.board[genIdx] = { isEventGen: true, genLevel: genItem?.genLevel ?? 0 };
  }
  // Lv3+ で依頼を補充（Lv2固定依頼・chara_01.png は廃止）
  eventState.requests = [];
  fillEventRequests();
  renderEventBoard();
  renderEventGenerators();
  renderEventRequest();
  renderEventHeader();

  // ゲームスタートと同時にアイテムリストガイドを表示
  eventState.catalogTutShown = true;
  const DAIYA = '<img src="img/UI/image_merge_navi_daiya.png" class="icon-inline" alt="ダイヤ">';
  startGuide(
    [
      `新しいアイテムを発見すると、${DAIYA}を獲得できます。`,
      '発見したアイテムは"？"マークになっているので、タップして、アイテムリストに追加してください。',
      'アイテムの種類とレベルを把握しておくと、ゲーム進行に役立ちます。',
    ],
    '#ev-catalog-btn',
    () => {
      // メッセージ確認後にカタログを開き、閉じたらジェネレーター誘導チュートを開始
      pendingGenMergeTutStart = true;
      openCatalog();
    }
  );
}

function renderTutorialPanel() {
  const overlay = document.getElementById('tutorial-overlay');
  const panel   = document.getElementById('tutorial-panel');
  const msgEl   = document.getElementById('tutorial-msg-text');
  const hintEl  = document.getElementById('tutorial-tap-hint');
  if (!overlay || !panel) return;

  if (isTutorialComplete()) {
    // チュートリアル完了後：PV再生 → 霧アイテムを指し示すガイド → ゲームスタート
    playPVThenStart(() => {
      startGuide(
        [
          '蜘蛛の巣に覆われている\u201cメモ\u201dアイテムです。',
          '最初に出現する\u201cメモ\u201dアイテムとマージすることができます。',
          'そのほかにも蜘蛛の巣に覆われているアイテムはマージすることができますので、試してみてください。',
        ],
        '#event-board .cell[data-index="31"]',
        () => {
          transitionToMainGame();
        }
      );
    });
    return;
  }

  const step = currentTutStep();
  panel.classList.remove('hidden');
  hideNaviHint(); // チュートリアルパネル表示中はナビヒントを隠す
  msgEl.textContent = step.text;

  if (step.type === 'blocking_msg') {
    // noOverlay フラグがある場合はオーバーレイを出さない（依頼パネルを見せたい場合など）
    if (step.noOverlay) overlay.classList.add('hidden');
    else                overlay.classList.remove('hidden');
    hintEl.style.display = '';
  } else {
    // gen_focus / merge_focus / request_focus: ヒントバーのみ表示
    overlay.classList.add('hidden');
    hintEl.style.display = 'none';
  }
}

function onTutorialTap() {
  // ガイドシステムが進行中はガイドを進める
  if (isGuideInProgress()) { advanceGuide(); return; }
  // ジェネレーターマージ誘導チュートリアルのメッセージステップはタップで進める
  if (isGenMergeTutActive()) {
    const gmStep = currentGenMergeTutStep();
    if (gmStep && gmStep.type === 'msg') { advanceGenMergeTut(); return; }
    return; // focus ステップ中はタップ進行しない
  }
  const step = currentTutStep();
  if (!step || step.type !== 'blocking_msg') return;
  advanceTutorial();
}

// ========================================
// ガイドシステム（チュートリアル後の誘導メッセージ）
// ========================================
let guideState = null; // null=非アクティブ

function isGuideInProgress() { return guideState !== null; }

// いずれかのデバッグフラグが有効なら true
function isDebugModeActive() {
  return debugState.infiniteEnergy || debugState.infiniteCoin || debugState.infiniteDiamond;
}

function startGuide(messages, attentionSelector, onDone) {
  guideState = { messages, idx: 0, attentionSelector, onDone };
  hideNaviHint(); // ガイド開始時はナビヒントを非表示
  _applyGuideAttention(true);
  _renderGuidePanel();
}

function _applyGuideAttention(on) {
  if (!guideState?.attentionSelector) return;
  const el = document.querySelector(guideState.attentionSelector);
  if (el) el.classList.toggle('guide-attention', on);
}

function _renderGuidePanel() {
  if (!guideState) return;
  const overlay = document.getElementById('tutorial-overlay');
  const panel   = document.getElementById('tutorial-panel');
  const msgEl   = document.getElementById('tutorial-msg-text');
  const hintEl  = document.getElementById('tutorial-tap-hint');
  overlay.classList.remove('hidden');
  panel.classList.remove('hidden');
  msgEl.innerHTML = guideState.messages[guideState.idx];
  hintEl.style.display = '';
}

function advanceGuide() {
  if (!guideState) return;
  guideState.idx++;
  if (guideState.idx >= guideState.messages.length) {
    _applyGuideAttention(false);
    document.getElementById('tutorial-overlay').classList.add('hidden');
    document.getElementById('tutorial-panel').classList.add('hidden');
    const cb = guideState.onDone;
    guideState = null;
    if (cb) cb();
    return;
  }
  _renderGuidePanel();
}

// ストーリーボタンが初めてアクティブになったら一度だけストーリー誘導ガイドを表示
function checkStoryGuide() {
  if (state.storyGuideShown) return;
  const cost = getStoryCost(state.playerLevel);
  if (state.coin < cost) return;          // まだコインが足りない
  if (isTutorialInProgress()) return;     // チュートリアル・ガイド中は後回し
  state.storyGuideShown = true;
  startGuide([
    '依頼解決で得た報酬で、ストーリーを読むことができます。',
    'ストーリーを一定回数読んでいくとプレイヤーLvがあがります。',
    'プレイヤーLvが上がる際に報酬をもらうことができます。',
  ], '#story-btn', null);
}

// ========================================
// ストーリー選択画面
// ========================================
// 第一章シーン一覧（Ep.01〜16）
const CH1_SCENE_LIST = [
  { id: 'scene02', label: 'Ep.01' },
  { id: 'scene03', label: 'Ep.02' },
  { id: 'scene04', label: 'Ep.03' },
  { id: 'scene05', label: 'Ep.04' },
  { id: 'scene06', label: 'Ep.05' },
  { id: 'scene07', label: 'Ep.06' },
  { id: 'scene08', label: 'Ep.07' },
  { id: 'scene09', label: 'Ep.08' },
  { id: 'scene10', label: 'Ep.09' },
  { id: 'scene11', label: 'Ep.10' },
  { id: 'scene12', label: 'Ep.11' },
  { id: 'scene13', label: 'Ep.12' },
  { id: 'scene14', label: 'Ep.13' },
  { id: 'scene15', label: 'Ep.14' },
  { id: 'scene16', label: 'Ep.15' },
  { id: 'scene17', label: 'Ep.16（完結）' },
];

// 第二章シーン一覧（c2s01〜c2s20）
const CH2_SCENE_LIST = [
  { id: 'c2s01',  label: 'Ep.01' },
  { id: 'c2s02',  label: 'Ep.02' },
  { id: 'c2s03',  label: 'Ep.03' },
  { id: 'c2s04',  label: 'Ep.04' },
  { id: 'c2s05',  label: 'Ep.05' },
  { id: 'c2s06',  label: 'Ep.06' },
  { id: 'c2s07',  label: 'Ep.07' },
  { id: 'c2s08',  label: 'Ep.08' },
  { id: 'c2s09',  label: 'Ep.09' },
  { id: 'c2s10',  label: 'Ep.10' },
  { id: 'c2s11',  label: 'Ep.11' },
  { id: 'c2s12',  label: 'Ep.12' },
  { id: 'c2s13',  label: 'Ep.13' },
  { id: 'c2s14',  label: 'Ep.14' },
  { id: 'c2s15',  label: 'Ep.15' },
  { id: 'c2s15b', label: 'Ep.15（後半）' },
  { id: 'c2s16',  label: 'Ep.16' },
  { id: 'c2s17',  label: 'Ep.17' },
  { id: 'c2s18',  label: 'Ep.18' },
  { id: 'c2s19',  label: 'Ep.19' },
  { id: 'c2s20',  label: 'Ep.20（完結）' },
];

// 第三章シーン一覧（c3s01〜c3s26）
const CH3_SCENE_LIST = [
  { id: 'c3s01', label: 'Ep.01' },
  { id: 'c3s02', label: 'Ep.02' },
  { id: 'c3s03', label: 'Ep.03' },
  { id: 'c3s04', label: 'Ep.04' },
  { id: 'c3s05', label: 'Ep.05' },
  { id: 'c3s06', label: 'Ep.06' },
  { id: 'c3s07', label: 'Ep.07' },
  { id: 'c3s08', label: 'Ep.08' },
  { id: 'c3s09', label: 'Ep.09' },
  { id: 'c3s10', label: 'Ep.10' },
  { id: 'c3s11', label: 'Ep.11' },
  { id: 'c3s12', label: 'Ep.12' },
  { id: 'c3s13', label: 'Ep.13' },
  { id: 'c3s14', label: 'Ep.14' },
  { id: 'c3s15', label: 'Ep.15' },
  { id: 'c3s16', label: 'Ep.16' },
  { id: 'c3s17', label: 'Ep.17' },
  { id: 'c3s18', label: 'Ep.18' },
  { id: 'c3s19', label: 'Ep.19' },
  { id: 'c3s20', label: 'Ep.20' },
  { id: 'c3s21', label: 'Ep.21' },
  { id: 'c3s22', label: 'Ep.22' },
  { id: 'c3s23', label: 'Ep.23' },
  { id: 'c3s24', label: 'Ep.24' },
  { id: 'c3s25', label: 'Ep.25（完結）' },
  { id: 'c3s26', label: 'Ep.26（後日談）' },
];

// 第四章シーン一覧（c4s01〜c4s30）
const CH4_SCENE_LIST = [
  { id: 'c4s01', label: 'Ep.01' },
  { id: 'c4s02', label: 'Ep.02' },
  { id: 'c4s03', label: 'Ep.03' },
  { id: 'c4s04', label: 'Ep.04' },
  { id: 'c4s05', label: 'Ep.05' },
  { id: 'c4s06', label: 'Ep.06' },
  { id: 'c4s07', label: 'Ep.07' },
  { id: 'c4s08', label: 'Ep.08' },
  { id: 'c4s09', label: 'Ep.09' },
  { id: 'c4s10', label: 'Ep.10' },
  { id: 'c4s11', label: 'Ep.11' },
  { id: 'c4s12', label: 'Ep.12' },
  { id: 'c4s13', label: 'Ep.13' },
  { id: 'c4s14', label: 'Ep.14' },
  { id: 'c4s15', label: 'Ep.15' },
  { id: 'c4s16', label: 'Ep.16' },
  { id: 'c4s17', label: 'Ep.17' },
  { id: 'c4s18', label: 'Ep.18' },
  { id: 'c4s19', label: 'Ep.19' },
  { id: 'c4s20', label: 'Ep.20' },
  { id: 'c4s21', label: 'Ep.21' },
  { id: 'c4s22', label: 'Ep.22' },
  { id: 'c4s23', label: 'Ep.23' },
  { id: 'c4s24', label: 'Ep.24' },
  { id: 'c4s25', label: 'Ep.25' },
  { id: 'c4s26', label: 'Ep.26' },
  { id: 'c4s27', label: 'Ep.27' },
  { id: 'c4s28', label: 'Ep.28' },
  { id: 'c4s29', label: 'Ep.29（完結）' },
  { id: 'c4s30', label: 'Ep.30（後日談）' },
];

function openStoryScreen() {
  hideNaviHint();
  renderStoryScreen();
  document.getElementById('story-screen').classList.remove('hidden');
}

function closeStoryScreen() {
  document.getElementById('story-screen').classList.add('hidden');
  // ストーリー中に追加されたジェネレータータイルを赤字ポップアップで通知
  _showPendingGenLvUpNotices();
}

// ========================================
// 相関図システム
// ========================================
let currentKankeiChapter = 1; // 現在表示中の章

// ── 第二章データ ──
const CH2_KANKEI_NODES = [
  { id: 'rina',   name: 'リナ',   sub: '37歳', img: 'img/Chapter2/Chara/image_merge_order_chara_07.png',  unlockScene: 'c2s01', x: 22, y: 20 },
  { id: 'tatsuo', name: 'タツオ', sub: '44歳', img: 'img/Chapter2/Chara/image_merge_order_chara_10.png',  unlockScene: 'c2s03', x: 78, y: 75 },
  { id: 'yuu',    name: 'ユウ',   sub: '10歳', img: 'img/Chapter2/Chara/image_merge_order_chara_08.png',  unlockScene: 'c2s05', x: 22, y: 68 },
  { id: 'haruto', name: 'ハルト', sub: '20歳', img: 'img/Chapter2/Chara/image_merge_order_chara_09a.png', unlockScene: 'c2s07', x: 78, y: 20 },
  { id: 'jin',    name: 'ジン',   sub: '39歳', img: 'img/Chapter2/Chara/image_merge_order_chara_06a.png', unlockScene: 'c2s09', x: 50, y: 46 },
];

const CH2_KANKEI_BADGES = [
  { nodeId: 'rina',   label: '依頼人',       unlockScene: 'c2s01', type: 'normal'   },
  { nodeId: 'tatsuo', label: '警備員',       unlockScene: 'c2s03', type: 'normal'   },
  { nodeId: 'rina',   label: '母',           unlockScene: 'c2s05', type: 'normal'   },
  { nodeId: 'haruto', label: '学生',         unlockScene: 'c2s07', type: 'normal'   },
  { nodeId: 'jin',    label: '不動産管理人', unlockScene: 'c2s09', type: 'normal'   },
  { nodeId: 'jin',    label: '犯人・逃亡',   unlockScene: 'c2s19', type: 'criminal' },
];

const CH2_KANKEI_EDGES = [
  { from: 'yuu',    to: 'rina',   label: '母と息子', unlockScene: 'c2s05', type: 'family'   },
  { from: 'tatsuo', to: 'jin',    label: '脅迫',     unlockScene: 'c2s12', type: 'danger'   },
  { from: 'haruto', to: 'jin',    label: '強制命令', unlockScene: 'c2s13', type: 'danger'   },
  { from: 'jin',    to: 'rina',   label: '嫌がらせ', unlockScene: 'c2s14', type: 'danger'   },
  { from: 'jin',    to: 'yuu',    label: '嫌がらせ', unlockScene: 'c2s14', type: 'danger'   },
];

// ── 第三章データ ──
const CH3_KANKEI_NODES = [
  { id: 'keisuke', name: 'ケイスケ', sub: '故人',  noImg: true, unlockScene: 'c3s01', x: 50, y: 10 },
  { id: 'fumiko',  name: 'フミコ',   sub: '71歳',  img: 'img/Chapter3/chara/image_merge_order_chara_15.png', unlockScene: 'c3s01', x: 18, y: 35 },
  { id: 'kouji',   name: 'コウジ',   sub: '47歳',  img: 'img/Chapter3/chara/image_merge_order_chara_16.png', unlockScene: 'c3s03', x: 35, y: 60 },
  { id: 'sachiko', name: 'サチコ',   sub: '44歳',  img: 'img/Chapter3/chara/image_merge_order_chara_17.png', unlockScene: 'c3s04', x: 80, y: 60 },
  { id: 'midori',  name: 'ミドリ',   sub: '52歳',  img: 'img/Chapter3/chara/image_merge_order_chara_19.png', unlockScene: 'c3s05', x: 68, y: 82 },
  { id: 'ryota',   name: 'リョウタ', sub: '24歳',  img: 'img/Chapter3/chara/image_merge_order_chara_20.png', unlockScene: 'c3s06', x: 12, y: 82 },
  { id: 'nobuo',   name: 'ノブオ',   sub: '67歳',  img: 'img/Chapter3/chara/image_merge_order_chara_18.png', unlockScene: 'c3s08', x: 46, y: 82 },
  { id: 'akira',   name: 'アキラ',   sub: '40歳',  img: 'img/Chapter3/chara/image_merge_order_chara_21.png', unlockScene: 'c3s09', x: 82, y: 35 },
];

const CH3_KANKEI_BADGES = [
  { nodeId: 'fumiko',  label: '依頼人',      unlockScene: 'c3s01', type: 'normal'   },
  { nodeId: 'fumiko',  label: '故人の妻',    unlockScene: 'c3s01', type: 'normal'   },
  { nodeId: 'keisuke', label: '故人',        unlockScene: 'c3s01', type: 'normal'   },
  { nodeId: 'kouji',   label: '長男',        unlockScene: 'c3s03', type: 'normal'   },
  { nodeId: 'kouji',   label: '故人の長男',  unlockScene: 'c3s03', type: 'normal'   },
  { nodeId: 'sachiko', label: '長女',        unlockScene: 'c3s04', type: 'normal'   },
  { nodeId: 'sachiko', label: '故人の長女',  unlockScene: 'c3s04', type: 'normal'   },
  { nodeId: 'midori',  label: '番頭',        unlockScene: 'c3s05', type: 'normal'   },
  { nodeId: 'ryota',   label: '息子',        unlockScene: 'c3s06', type: 'normal'   },
  { nodeId: 'ryota',   label: '故人の孫',    unlockScene: 'c3s06', type: 'normal'   },
  { nodeId: 'nobuo',   label: '弁護士',      unlockScene: 'c3s08', type: 'normal'   },
  { nodeId: 'akira',   label: '次男？',      unlockScene: 'c3s09', type: 'warning',  hideIfScene: 'c3s20' },
  { nodeId: 'akira',   label: '故人の次男？',unlockScene: 'c3s09', type: 'warning',  hideIfScene: 'c3s20' },
  { nodeId: 'akira',   label: '次男',        unlockScene: 'c3s20', type: 'normal'   },
  { nodeId: 'akira',   label: '故人の次男',  unlockScene: 'c3s20', type: 'normal'   },
  { nodeId: 'akira',   label: '隠し子',      unlockScene: 'c3s20', type: 'warning'  },
  { nodeId: 'nobuo',   label: '犯人',        unlockScene: 'c3s22', type: 'criminal' },
];

const CH3_KANKEI_EDGES = [
  { from: 'fumiko',  to: 'keisuke', label: '夫婦',         unlockScene: 'c3s01', type: 'family'   },
  { from: 'fumiko',  to: 'kouji',   label: '母と息子',     unlockScene: 'c3s03', type: 'family'   },
  { from: 'keisuke', to: 'kouji',   label: '父と息子',     unlockScene: 'c3s03', type: 'family'   },
  { from: 'fumiko',  to: 'sachiko', label: '母と娘',       unlockScene: 'c3s04', type: 'family',  labelPos: 0.78 },
  { from: 'kouji',   to: 'sachiko', label: '兄妹',         unlockScene: 'c3s04', type: 'family'   },
  { from: 'keisuke', to: 'sachiko', label: '父と娘',       unlockScene: 'c3s04', type: 'family'   },
  { from: 'kouji',   to: 'ryota',   label: '父と息子',     unlockScene: 'c3s06', type: 'family'   },
  { from: 'fumiko',  to: 'ryota',   label: '祖母と孫',     unlockScene: 'c3s06', type: 'family'   },
  { from: 'nobuo',   to: 'keisuke', label: '依頼',         unlockScene: 'c3s08', type: 'normal',   hideIfScene: 'c3s21' },
  { from: 'keisuke', to: 'akira',  label: '父と息子？',   unlockScene: 'c3s09', type: 'warning',  hideIfScene: 'c3s20' },
  { from: 'nobuo',   to: 'midori',  label: '脅迫',         unlockScene: 'c3s17', type: 'danger'   },
  { from: 'keisuke', to: 'akira',  label: '父と息子',     unlockScene: 'c3s20', type: 'family'   },
  { from: 'kouji',   to: 'akira',  label: '異母兄弟',     unlockScene: 'c3s20', type: 'family',  labelPos: 0.55 },
  { from: 'sachiko', to: 'akira',  label: '異母姉弟',     unlockScene: 'c3s20', type: 'family'   },
  { from: 'nobuo',   to: 'keisuke', label: '脅迫',         unlockScene: 'c3s21', type: 'criminal', labelPos: 0.2 },
  { from: 'nobuo',   to: 'kouji',   label: '共犯',         unlockScene: 'c3s23', type: 'danger'   },
  { from: 'keisuke', to: 'midori',  label: '遺言を預かる', unlockScene: 'c3s24', type: 'normal',  labelPos: 0.85 },
];

// ヤスは相関図に不要のため除外
const CH1_KANKEI_NODES = [
  { id: 'miyu',    name: 'ミユ',    sub: '9歳',   img: 'img/Chapter1/Chara/image_merge_order_chara_01a.png', unlockScene: 'scene02', x: 50, y: 14 },
  { id: 'kenichi', name: 'ケンイチ', sub: '34歳', img: 'img/Chapter1/Chara/image_merge_order_chara_03.png',  unlockScene: 'scene04', x: 14, y: 45 },
  { id: 'nanako',  name: 'ナナコ',  sub: '28歳',  img: 'img/Chapter1/Chara/image_merge_order_chara_02.png',  unlockScene: 'scene05', x: 86, y: 45 },  // Scene4終了で解放
  { id: 'misaki',  name: 'ミサキ',  sub: '27歳',  img: 'img/Chapter1/Chara/image_merge_order_chara_04.png',  unlockScene: 'scene09', x: 18, y: 80 },  // Scene8終了で解放
  { id: 'shinji',  name: 'シンジ',  sub: '27歳',  img: 'img/Chapter1/Chara/image_merge_order_chara_05.png',  unlockScene: 'scene08', x: 82, y: 80 },  // Scene7終了・配達員画像(05.png)
];

// ノードに紐づくラベルバッジ（複数付与可）
const CH1_KANKEI_BADGES = [
  { nodeId: 'miyu',    label: '依頼人',         unlockScene: 'scene02', type: 'normal'   },
  { nodeId: 'kenichi', label: '父',             unlockScene: 'scene04', type: 'normal'   },
  { nodeId: 'kenichi', label: '夫',             unlockScene: 'scene05', type: 'normal'   },  // Scene4終了
  { nodeId: 'nanako',  label: '母',             unlockScene: 'scene05', type: 'normal'   },  // Scene4終了
  { nodeId: 'nanako',  label: '妻',             unlockScene: 'scene05', type: 'normal'   },  // Scene4終了
  { nodeId: 'nanako',  label: '不審な荷物',     unlockScene: 'scene08', type: 'warning'  },
  { nodeId: 'misaki',  label: 'ストーカー被害', unlockScene: 'scene09', type: 'warning'  },  // Scene8終了
  { nodeId: 'shinji',  label: '配達員',         unlockScene: 'scene08', type: 'normal'   },  // Scene7終了
  { nodeId: 'shinji',  label: 'ストーカー',     unlockScene: 'scene13', type: 'danger'   },  // Scene12終了後に判明
  { nodeId: 'shinji',  label: '犯人・逃亡',     unlockScene: 'scene17', type: 'criminal' },
];

// ノード間の接続線
const CH1_KANKEI_EDGES = [
  { from: 'miyu',    to: 'kenichi', label: '父と娘',   unlockScene: 'scene04', type: 'family' },
  { from: 'miyu',    to: 'nanako',  label: '母と娘',   unlockScene: 'scene05', type: 'family' },  // Scene4終了
  { from: 'kenichi', to: 'nanako',  label: '夫と妻',   unlockScene: 'scene05', type: 'family' },  // Scene4終了
  { from: 'shinji',  to: 'misaki',  label: 'ストーカー', unlockScene: 'scene09', type: 'danger' }, // Scene8終了
  { from: 'misaki',  to: 'kenichi', label: '不倫関係', unlockScene: 'scene13', type: 'danger' },  // Scene12終了
  { from: 'shinji',  to: 'nanako',  label: '嫌がらせ', unlockScene: 'scene15', type: 'danger' },  // Scene14終了
  { from: 'shinji',  to: 'kenichi', label: '嫌がらせ', unlockScene: 'scene15', type: 'danger' },  // Scene14終了
  { from: 'shinji',  to: 'miyu',    label: '嫌がらせ', unlockScene: 'scene15', type: 'danger' },  // Scene14終了
];

function openKankeiScreen() {
  document.getElementById('kankei-screen').classList.remove('hidden');
  updateKankeiChapterSelect();
  renderKankeiBoard();
  // 閲覧済みとしてマーク → アテンションバッジを消す
  eventState.kankeiViewedScenes = [...(state.seenScenes ?? [])];
  updateKankeiAttention();
}

// 章セレクトの選択肢を更新（第二章解放後に追加）
function updateKankeiChapterSelect() {
  const sel = document.getElementById('kankei-chapter-select');
  if (!sel) return;
  const has2 = eventState.fireGenUnlocked;
  const has3 = eventState.kanteGenUnlocked;
  // 第二章オプションの有無を同期
  if (has2 && !sel.querySelector('[value="2"]')) {
    const opt = document.createElement('option');
    opt.value = '2';
    opt.textContent = '第二章　相関図';
    sel.appendChild(opt);
  }
  // 第三章オプションの有無を同期
  if (has3 && !sel.querySelector('[value="3"]')) {
    const opt = document.createElement('option');
    opt.value = '3';
    opt.textContent = '第三章　相関図';
    sel.appendChild(opt);
  }
  sel.value = String(currentKankeiChapter);
}

// 相関図の更新アテンション: 新アイテム解放時に kankei-open-btn に赤バッジを表示
function updateKankeiAttention() {
  const seen   = state.seenScenes ?? [];
  const viewed = eventState.kankeiViewedScenes ?? [];
  const allKankeiScenes = [
    ...CH1_KANKEI_NODES.map(n => n.unlockScene),
    ...CH1_KANKEI_EDGES.map(e => e.unlockScene),
    ...CH1_KANKEI_BADGES.map(b => b.unlockScene),
    ...CH2_KANKEI_NODES.map(n => n.unlockScene),
    ...CH2_KANKEI_EDGES.map(e => e.unlockScene),
    ...CH2_KANKEI_BADGES.map(b => b.unlockScene),
    ...CH3_KANKEI_NODES.map(n => n.unlockScene),
    ...CH3_KANKEI_EDGES.map(e => e.unlockScene),
    ...CH3_KANKEI_BADGES.map(b => b.unlockScene),
  ];
  const hasNew = allKankeiScenes.some(s => seen.includes(s) && !viewed.includes(s));
  const btn = document.getElementById('kankei-open-btn');
  if (btn) btn.classList.toggle('kankei-has-new', hasNew);
}

function closeKankeiScreen() {
  document.getElementById('kankei-screen').classList.add('hidden');
}

// エッジラベルを改行分割（長いラベルを2行に）
function splitEdgeLabel(label) {
  if (label.length <= 6) return [label];
  const dotIdx = label.indexOf('・');
  if (dotIdx > 0 && dotIdx < label.length - 1) {
    return [label.slice(0, dotIdx + 1), label.slice(dotIdx + 1)];
  }
  const mid = Math.ceil(label.length / 2);
  return [label.slice(0, mid), label.slice(mid)];
}

function renderKankeiBoard() {
  const seen = state.seenScenes ?? [];
  const svg       = document.getElementById('kankei-svg');
  const nodesWrap = document.getElementById('kankei-nodes');
  const progressEl = document.getElementById('kankei-progress');
  svg.innerHTML       = '';
  nodesWrap.innerHTML = '';

  // 章に応じてデータを切り替え
  const NODES  = currentKankeiChapter === 3 ? CH3_KANKEI_NODES  : currentKankeiChapter === 2 ? CH2_KANKEI_NODES  : CH1_KANKEI_NODES;
  const EDGES  = currentKankeiChapter === 3 ? CH3_KANKEI_EDGES  : currentKankeiChapter === 2 ? CH2_KANKEI_EDGES  : CH1_KANKEI_EDGES;
  const BADGES = currentKankeiChapter === 3 ? CH3_KANKEI_BADGES : currentKankeiChapter === 2 ? CH2_KANKEI_BADGES : CH1_KANKEI_BADGES;

  // 解放済みノードセット
  const unlockedNodeIds = new Set(
    NODES.filter(n => seen.includes(n.unlockScene)).map(n => n.id)
  );

  // 進捗
  const totalItems    = NODES.length + EDGES.length + BADGES.length;
  const unlockedItems =
    NODES.filter(n => seen.includes(n.unlockScene)).length +
    EDGES.filter(e => seen.includes(e.unlockScene)).length +
    BADGES.filter(b => seen.includes(b.unlockScene)).length;
  if (progressEl) progressEl.textContent = `${unlockedItems} / ${totalItems} 解明`;

  // SVG defs: 不要（filterは水平線でbounding box高さ0になりレンダリング失敗するため廃止）

  // ── Phase 1: 全ライン ─────────────────────────
  const NOTE_SRCS = {
    family:  'img/UI/image_merge_kankei_note_02.png',
    danger:  'img/UI/image_merge_kankei_note_04.png',
    normal:  'img/UI/image_merge_kankei_note_01.png',
    warning: 'img/UI/image_merge_kankei_note_03.png',
  };
  const TEXT_COLORS = {
    normal:   '#f5e8c0',
    family:   '#f5e8c0',
    warning:  '#ffe066',
    danger:   '#ff9966',
    criminal: '#ff6666',
  };

  let lineDelay = 0;
  const labelQueue = [];

  EDGES.forEach(edge => {
    const fromNode = NODES.find(n => n.id === edge.from);
    const toNode   = NODES.find(n => n.id === edge.to);
    if (!fromNode || !toNode) return;

    const unlocked = seen.includes(edge.unlockScene)
      && !(edge.hideIfScene && seen.includes(edge.hideIfScene))
      && unlockedNodeIds.has(edge.from) && unlockedNodeIds.has(edge.to);

    const lineClass = `kankei-line${unlocked ? ` kankei-line-${edge.type}` : ' kankei-line-locked'}`;
    const dx = toNode.x - fromNode.x, dy = toNode.y - fromNode.y;
    const len = Math.sqrt(dx*dx + dy*dy);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromNode.x); line.setAttribute('y1', fromNode.y);
    line.setAttribute('x2', toNode.x);   line.setAttribute('y2', toNode.y);
    line.setAttribute('class', lineClass);
    if (unlocked) {
      // filter は使わない: 水平線（y1=y2）はbounding box高さ0でfilterがレンダリングを破壊する
      line.style.animation = `kankei-fade-in 0.8s ease-out ${lineDelay}ms both`;
    }
    svg.appendChild(line);

    if (!unlocked) return;

    // ── Phase 1.5: ピン（ライン端点に standalone image）
    const pinSrc  = edge.type === 'danger'
      ? 'img/UI/image_merge_kankei_pin_red.png'
      : 'img/UI/image_merge_kankei_pin_white.png';
    const pinSize = 8; // SVG units ≈ 28px
    [{ x: fromNode.x, y: fromNode.y }, { x: toNode.x, y: toNode.y }].forEach(pt => {
      const pin = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      pin.setAttribute('href', pinSrc);
      pin.setAttribute('x', pt.x - pinSize / 2);
      pin.setAttribute('y', pt.y - pinSize / 2);
      pin.setAttribute('width',  pinSize);
      pin.setAttribute('height', pinSize);
      pin.style.animation = `kankei-fade-in 0.3s ease-out ${lineDelay + 60}ms both`;
      svg.appendChild(pin);
    });

    labelQueue.push({ edge, fromNode, toNode, delay: lineDelay });
    lineDelay += 130;
  });

  // ── Phase 2: エッジラベル（全ラインの後に追加 → 上に描画される）
  labelQueue.forEach(({ edge, fromNode, toNode, delay }) => {
    const t  = edge.labelPos ?? 0.5;
    const mx = fromNode.x + (toNode.x - fromNode.x) * t;
    const my = fromNode.y + (toNode.y - fromNode.y) * t;
    const lines      = splitEdgeLabel(edge.label);
    const multiLine  = lines.length > 1;
    const textColor  = TEXT_COLORS[edge.type] || TEXT_COLORS.normal;
    const labelDelay = delay + 500;

    // ラベル画像は現在非表示（復元する場合は noteImg ブロックを追加）
    // NOTE_SRCS / noteW / noteH はSVG units版に変更する際に再活用

    // テキスト（線上）
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('text-anchor', 'middle');
    textEl.setAttribute('font-family', "'Zen Kurenaido', sans-serif");
    textEl.setAttribute('fill',        textColor);
    textEl.setAttribute('stroke',        'none');      // 透明な縁取りを防ぐ
    textEl.setAttribute('pointer-events', 'none');
    // 関係線上フォント: 3 SVG units（画面サイズに追従）
    // CSS固定pxに戻す場合: textEl.style.fontSize = '14px'; に変更
    textEl.setAttribute('font-size', '3');
    textEl.style.animation = `kankei-fade-in 0.4s ease-out ${labelDelay + 60}ms both`;

    if (multiLine) {
      textEl.setAttribute('x', mx);
      textEl.setAttribute('y', my - 0.4);
      const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      t1.setAttribute('x', mx); t1.setAttribute('dy', '0');
      t1.textContent = lines[0];
      const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      t2.setAttribute('x', mx); t2.setAttribute('dy', '2.2');
      t2.textContent = lines[1];
      textEl.appendChild(t1);
      textEl.appendChild(t2);
    } else {
      textEl.setAttribute('x', mx);
      textEl.setAttribute('y', my + 0.6);
      textEl.textContent = lines[0];
    }
    svg.appendChild(textEl);
  });

  // ── Phase 3: キャラノード（HTML overlay）─────────────────────────
  let nodeDelay = 80;
  NODES.forEach(node => {
    const unlocked   = unlockedNodeIds.has(node.id);
    const nodeBadges = BADGES.filter(b =>
      b.nodeId === node.id &&
      seen.includes(b.unlockScene) &&
      !(b.hideIfScene && seen.includes(b.hideIfScene))
    );

    const div = document.createElement('div');
    div.className = `kankei-node${unlocked ? ' kankei-node-unlocked' : ' kankei-node-locked'}`;
    div.style.left    = `${node.x}%`;
    div.style.top     = `${node.y}%`;
    // inline opacity は設定しない → animation 'both' で制御
    div.style.animation = `kankei-node-appear 0.45s cubic-bezier(0.22,1.4,0.5,1) ${nodeDelay}ms both`;
    nodeDelay += 100;

    // シンジは scene16終了後に05b.pngに切り替え（Scene15終了 = 豹変確定）
    const nodeImg = (node.id === 'shinji' && unlocked)
      ? (seen.includes('scene16')
          ? 'img/Chapter1/Chara/image_merge_order_chara_05b.png'
          : 'img/Chapter1/Chara/image_merge_order_chara_05.png')
      : node.img;

    // portrait内コンテンツ（noImg=true は顔写真なし・故人プレースホルダー）
    const portraitInner = unlocked
      ? (node.noImg ? `<div class="kankei-no-photo">故人</div>` : `<img src="${nodeImg}" alt="${node.name}">`)
      : `<div class="kankei-locked-icon">?</div>`;

    // portrait-wrap構造: frameはportraitの兄弟 → overflow:hiddenに切られない
    div.innerHTML = `
      <div class="kankei-portrait-wrap">
        <div class="kankei-portrait">
          ${portraitInner}
        </div>
        <div class="kankei-frame${unlocked ? '' : ' kankei-frame-locked'}"></div>
      </div>
      <div class="kankei-name">${unlocked ? node.name : '???'}</div>
      <div class="kankei-badges">
        ${nodeBadges.map((b, bi) =>
          `<div class="kankei-badge kankei-badge-${b.type}" style="animation-delay:${nodeDelay + bi*60}ms">${b.label}</div>`
        ).join('')}
      </div>
    `;
    nodesWrap.appendChild(div);
  });
}

// イベント登録
document.getElementById('kankei-open-btn').addEventListener('click', () => {
  openKankeiScreen();
});
document.getElementById('kankei-close-btn').addEventListener('click', () => {
  closeKankeiScreen();
});
document.getElementById('kankei-chapter-select').addEventListener('change', (e) => {
  currentKankeiChapter = Number(e.target.value);
  renderKankeiBoard();
});

// ストーリー閲覧中に追加されたジェネレータータイルの通知を赤字ポップアップで表示
function _showPendingGenLvUpNotices() {
  const notices = eventState.pendingGenLvUpNotice ?? [];
  if (notices.length === 0) return;
  eventState.pendingGenLvUpNotice = [];
  notices.forEach(({ idx, msg }, i) => {
    setTimeout(() => {
      const cells = document.querySelectorAll('#event-board .cell');
      const cell = cells[idx];
      if (!cell) return;
      const rect = cell.getBoundingClientRect();
      const el = document.createElement('div');
      el.textContent = msg;
      el.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top - 8}px;
        transform: translate(-50%, -100%);
        background: rgba(180,0,0,0.92);
        color: #fff;
        padding: 7px 14px;
        border-radius: 14px;
        font-size: 12px;
        font-weight: bold;
        z-index: 2000;
        pointer-events: none;
        max-width: 80vw;
        text-align: center;
        white-space: pre-line;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        animation: toast-pop 3s ease-out forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3200);
    }, 400 + i * 600);
  });
}

function renderStoryScreen() {
  const ch1Complete = state.ch1Count >= CH1_SCENE_IDS.length;
  const ch2Unlocked = eventState.fireGenUnlocked;
  const ch2Complete = state.ch2Count >= CH2_SCENE_IDS.length;
  const ch3Unlocked = eventState.kanteGenUnlocked;
  const ch3Complete = state.ch3Count >= CH3_SCENE_IDS.length;
  const cost        = getStoryCost(state.playerLevel);
  const canAfford   = state.coin >= cost;
  const costLabel   = `${COIN_ICON} ${cost.toLocaleString()}消費`;

  // ── 第一章 ──
  const ch1NextWrap   = document.getElementById('story-ch1-next-wrap');
  const ch1NextBtn    = document.getElementById('story-ch1-next-btn');
  const ch1CostLabel  = document.getElementById('story-ch1-cost-label');
  const ch1Complete_  = document.getElementById('story-ch1-complete');
  const ch1ReplayWrap = document.getElementById('story-ch1-replay-wrap');

  if (ch1Complete) {
    ch1NextWrap.classList.add('hidden');
    ch1Complete_.classList.remove('hidden');
  } else {
    ch1NextWrap.classList.remove('hidden');
    ch1Complete_.classList.add('hidden');
    ch1NextBtn.disabled = !canAfford;
    ch1CostLabel.innerHTML = costLabel;
  }
  // 既読シーンがあれば章完了前でも見返し可能
  {
    const seenCh1 = (state.seenScenes ?? []).some(id => CH1_SCENE_LIST.some(s => s.id === id));
    if (seenCh1) {
      ch1ReplayWrap.classList.remove('hidden');
      renderCh1ReplayList();
    } else {
      ch1ReplayWrap.classList.add('hidden');
    }
  }

  // ── 第二章 ──
  const ch2Block     = document.getElementById('story-ch2-block');
  const ch2NextWrap  = document.getElementById('story-ch2-next-wrap');
  const ch2NextBtn   = document.getElementById('story-ch2-next-btn');
  const ch2CostLbl   = document.getElementById('story-ch2-cost-label');
  const ch2Complete_ = document.getElementById('story-ch2-complete');
  const ch2LockedLbl = document.getElementById('story-ch2-locked');

  if (ch2Unlocked) {
    ch2Block.classList.remove('hidden');
    ch2LockedLbl?.classList.add('hidden');
    if (ch2Complete) {
      ch2NextWrap.classList.add('hidden');
      ch2Complete_.classList.remove('hidden');
    } else {
      ch2NextWrap.classList.remove('hidden');
      ch2Complete_.classList.add('hidden');
      ch2NextBtn.disabled = !canAfford;
      ch2CostLbl.innerHTML = costLabel;
    }
    // 既読シーンがあれば章完了前でも見返し可能
    {
      const seenCh2 = (state.seenScenes ?? []).some(id => CH2_SCENE_LIST.some(s => s.id === id));
      const ch2ReplayWrap = document.getElementById('story-ch2-replay-wrap');
      if (seenCh2) {
        ch2ReplayWrap?.classList.remove('hidden');
        renderCh2ReplayList();
      } else {
        ch2ReplayWrap?.classList.add('hidden');
      }
    }
  } else {
    ch2Block.classList.add('hidden');
  }

  // ── 第三章 ──
  const ch3Block     = document.getElementById('story-ch3-block');
  const ch3NextWrap  = document.getElementById('story-ch3-next-wrap');
  const ch3NextBtn   = document.getElementById('story-ch3-next-btn');
  const ch3CostLbl   = document.getElementById('story-ch3-cost-label');
  const ch3Complete_ = document.getElementById('story-ch3-complete');
  const ch3LockedLbl = document.getElementById('story-ch3-locked');

  if (ch3Unlocked) {
    ch3Block.classList.remove('hidden');
    ch3LockedLbl?.classList.add('hidden');
    if (ch3Complete) {
      ch3NextWrap.classList.add('hidden');
      ch3Complete_.classList.remove('hidden');
    } else {
      ch3NextWrap.classList.remove('hidden');
      ch3Complete_.classList.add('hidden');
      ch3NextBtn.disabled = !canAfford;
      ch3CostLbl.innerHTML = costLabel;
    }
    // 既読シーンがあれば章完了前でも見返し可能
    {
      const seenCh3 = (state.seenScenes ?? []).some(id => CH3_SCENE_LIST.some(s => s.id === id));
      const ch3ReplayWrap = document.getElementById('story-ch3-replay-wrap');
      if (seenCh3) {
        ch3ReplayWrap?.classList.remove('hidden');
        renderCh3ReplayList();
      } else {
        ch3ReplayWrap?.classList.add('hidden');
      }
    }
  } else {
    ch3Block?.classList.add('hidden');
  }

  // ── 第四章 ──
  const ch4Unlocked = eventState.keikakuGenUnlocked;
  const ch4Complete = state.ch4Count >= CH4_SCENE_IDS.length;
  const ch4Block     = document.getElementById('story-ch4-block');
  const ch4NextWrap  = document.getElementById('story-ch4-next-wrap');
  const ch4NextBtn   = document.getElementById('story-ch4-next-btn');
  const ch4CostLbl   = document.getElementById('story-ch4-cost-label');
  const ch4Complete_ = document.getElementById('story-ch4-complete');
  const ch4LockedLbl = document.getElementById('story-ch4-locked');

  if (ch4Unlocked) {
    ch4Block?.classList.remove('hidden');
    ch4LockedLbl?.classList.add('hidden');
    if (ch4Complete) {
      ch4NextWrap?.classList.add('hidden');
      ch4Complete_?.classList.remove('hidden');
    } else {
      ch4NextWrap?.classList.remove('hidden');
      ch4Complete_?.classList.add('hidden');
      if (ch4NextBtn) ch4NextBtn.disabled = !canAfford;
      if (ch4CostLbl) ch4CostLbl.innerHTML = costLabel;
    }
    // 既読シーンがあれば章完了前でも見返し可能
    {
      const seenCh4 = (state.seenScenes ?? []).some(id => CH4_SCENE_LIST.some(s => s.id === id));
      const ch4ReplayWrap = document.getElementById('story-ch4-replay-wrap');
      if (seenCh4) {
        ch4ReplayWrap?.classList.remove('hidden');
        renderCh4ReplayList();
      } else {
        ch4ReplayWrap?.classList.add('hidden');
      }
    }
  } else {
    ch4Block?.classList.add('hidden');
  }
}

function renderCh3ReplayList() {
  const list = document.getElementById('story-ch3-replay-list');
  if (!list) return;
  list.innerHTML = '';
  const seen = state.seenScenes ?? [];
  CH3_SCENE_LIST.forEach(s => {
    if (!seen.includes(s.id)) return;
    const li = document.createElement('li');
    li.className = 'story-replay-item';
    li.textContent = `第三章 ${s.label}`;
    li.addEventListener('click', () => {
      closeStoryScreen();
      openAdventureScene(s.id);
    });
    list.appendChild(li);
  });
  if (list.children.length === 0) {
    const li = document.createElement('li');
    li.className = 'story-replay-item';
    li.style.color = '#888';
    li.textContent = '（まだ読んだストーリーがありません）';
    list.appendChild(li);
  }
}

function renderCh4ReplayList() {
  const list = document.getElementById('story-ch4-replay-list');
  if (!list) return;
  list.innerHTML = '';
  const seen = state.seenScenes ?? [];
  CH4_SCENE_LIST.forEach(s => {
    if (!seen.includes(s.id)) return;
    const li = document.createElement('li');
    li.className = 'story-replay-item';
    li.textContent = `第四章 ${s.label}`;
    li.addEventListener('click', () => {
      closeStoryScreen();
      openAdventureScene(s.id);
    });
    list.appendChild(li);
  });
  if (list.children.length === 0) {
    const li = document.createElement('li');
    li.className = 'story-replay-item';
    li.style.color = '#888';
    li.textContent = '（まだ読んだストーリーがありません）';
    list.appendChild(li);
  }
}

function renderCh1ReplayList() {
  const list = document.getElementById('story-ch1-replay-list');
  list.innerHTML = '';
  const seen = state.seenScenes ?? [];
  CH1_SCENE_LIST.forEach(s => {
    if (!seen.includes(s.id)) return;
    const li = document.createElement('li');
    li.className = 'story-replay-item';
    li.textContent = `第一章 ${s.label}`;
    li.addEventListener('click', () => {
      closeStoryScreen();
      openAdventureScene(s.id);
    });
    list.appendChild(li);
  });
  if (list.children.length === 0) {
    const li = document.createElement('li');
    li.className = 'story-replay-item';
    li.style.color = '#888';
    li.textContent = '（まだ読んだストーリーがありません）';
    list.appendChild(li);
  }
}

function renderCh2ReplayList() {
  const list = document.getElementById('story-ch2-replay-list');
  if (!list) return;
  list.innerHTML = '';
  const seen = state.seenScenes ?? [];
  CH2_SCENE_LIST.forEach(s => {
    if (!seen.includes(s.id)) return;
    const li = document.createElement('li');
    li.className = 'story-replay-item';
    li.textContent = `第二章 ${s.label}`;
    li.addEventListener('click', () => {
      closeStoryScreen();
      openAdventureScene(s.id);
    });
    list.appendChild(li);
  });
  if (list.children.length === 0) {
    const li = document.createElement('li');
    li.className = 'story-replay-item';
    li.style.color = '#888';
    li.textContent = '（まだ読んだストーリーがありません）';
    list.appendChild(li);
  }
}

// ========================================
// ジェネレーターマージ誘導チュートリアル制御
// ========================================
function isGenMergeTutActive() {
  return eventState.genMergeTutStep !== null;
}
function currentGenMergeTutStep() {
  if (eventState.genMergeTutStep === null) return null;
  return GEN_MERGE_TUT_STEPS[eventState.genMergeTutStep] ?? null;
}
function startGenMergeTut() {
  if (eventState.genMergeTutDone) return;
  eventState.genMergeTutStep = 0;
  hideNaviHint(); // チュートリアル開始時はナビヒントを非表示
  eventState.selectedCell = null;
  renderGenMergeTutPanel();
  renderEventBoard();
}
function advanceGenMergeTut() {
  if (eventState.genMergeTutStep === null) return;
  eventState.genMergeTutStep++;
  if (eventState.genMergeTutStep >= GEN_MERGE_TUT_STEPS.length) {
    eventState.genMergeTutStep = null;
    eventState.genMergeTutDone = true;
  }
  renderGenMergeTutPanel();
  renderEventBoard();
}
function renderGenMergeTutPanel() {
  const overlay = document.getElementById('tutorial-overlay');
  const panel   = document.getElementById('tutorial-panel');
  const msgEl   = document.getElementById('tutorial-msg-text');
  const hintEl  = document.getElementById('tutorial-tap-hint');
  if (!overlay || !panel) return;

  const gmStep = currentGenMergeTutStep();
  if (!gmStep) {
    overlay.classList.add('hidden');
    panel.classList.add('hidden');
    return;
  }
  panel.classList.remove('hidden');
  msgEl.textContent = gmStep.text;
  if (gmStep.type === 'focus') {
    // フォーカス: オーバーレイ非表示、ジェネレーターだけ操作可
    overlay.classList.add('hidden');
    hintEl.style.display = 'none';
  } else {
    // メッセージ: オーバーレイで他の操作をブロック
    overlay.classList.remove('hidden');
    hintEl.style.display = '';
  }
}

// ========================================
// パワーレベル管理
// ========================================
const POWER_COSTS = [1, 2, 4, 8, 16]; // インデックス → 消費体力

function isGenPowerLvAvailable(powerIdx, genLevel) {
  if (powerIdx === 0) return true;
  if (powerIdx === 1) return genLevel >= 1;
  if (powerIdx === 2) return genLevel >= 2;
  if (powerIdx === 3) return genLevel >= 3 && state.energy >= 200;
  if (powerIdx === 4) return genLevel >= 3 && state.energy >= 400;
  return false;
}

function getGenMaxAvailablePowerLv(genLevel) {
  for (let i = 4; i >= 0; i--) {
    if (isGenPowerLvAvailable(i, genLevel)) return i;
  }
  return 0;
}

function cycleGenPowerLevel(genLevel) {
  let next = (eventState.genPowerLevel + 1) % 5;
  for (let tries = 0; tries < 5; tries++) {
    if (isGenPowerLvAvailable(next, genLevel)) {
      eventState.genPowerLevel = next;
      return next;
    }
    next = (next + 1) % 5;
  }
  eventState.genPowerLevel = 0;
  return 0;
}

// --- 第二章ジェネレーター Lvボタン関連 ---
function isFireGenPowerLvAvailable(powerIdx, seizoLevel) {
  if (powerIdx === 0) return true;
  if (powerIdx === 1) return seizoLevel >= 1;                                  // Lv2+
  if (powerIdx === 2) return seizoLevel >= 3;                                  // Lv4+
  if (powerIdx === 3) return seizoLevel >= 3 && state.energy >= 200;           // Lv4+ + 200⚡
  if (powerIdx === 4) return seizoLevel >= 3 && state.energy >= 400;           // Lv4+ + 400⚡
  return false;
}

function getFireGenMaxAvailablePowerLv(seizoLevel) {
  for (let i = 4; i >= 0; i--) {
    if (isFireGenPowerLvAvailable(i, seizoLevel)) return i;
  }
  return 0;
}

function cycleFireGenPowerLevel(seizoLevel) {
  let next = (eventState.firePowerLevel + 1) % 5;
  for (let tries = 0; tries < 5; tries++) {
    if (isFireGenPowerLvAvailable(next, seizoLevel)) {
      eventState.firePowerLevel = next;
      return next;
    }
    next = (next + 1) % 5;
  }
  eventState.firePowerLevel = 0;
  return 0;
}

function updateFireNaviLvBtn(seizoLevel) {
  const lvLabel = document.getElementById('navi-lv-label');
  const lvCrown = document.getElementById('navi-lv-crown');
  if (!lvLabel || !lvCrown) return;
  const curPL = eventState.firePowerLevel;
  const maxPL = getFireGenMaxAvailablePowerLv(seizoLevel);
  lvLabel.innerHTML = `${POWER_COSTS[curPL]}${HP_ICON}`;
  lvCrown.textContent = curPL === maxPL ? '👑' : '';
}

// ========================================
// ナビゲーターヒント表示（非ブロッキング）
// ========================================
let naviHintTimer = null;
let naviHintPersistent = false; // 持続表示中フラグ
let naviInfoContext = null;     // iボタン用コンテキスト { type, level/stage }
let lastCoinTapTime = 0;
let lastCoinTapIdx  = -1;

function openNaviInfoPopup() {
  const ctx = naviInfoContext;
  if (!ctx) return;
  const popup = document.getElementById('navi-info-popup');
  const list  = document.getElementById('navi-info-popup-list');
  const title = document.getElementById('navi-info-popup-title');
  if (!popup || !list) return;
  list.innerHTML = '';

  let items = [];
  let titleText = '';

  if (ctx.type === 'ch1gen') {
    titleText = '第一章ジェネレーター';
    items = EVENT_GEN_IMAGES.map((imgSrc, idx) => ({
      imgSrc, label: `Lv${idx + 1}`,
      disc: !!eventState.genDiscovered[`ch1_${idx}`],
      current: idx === ctx.level,
    }));
  } else if (ctx.type === 'ch2gen') {
    titleText = '第二章ジェネレーター';
    items = SEIZO_GEN_IMAGES.map((imgSrc, idx) => ({
      imgSrc, label: `Lv${idx + 1}`,
      disc: !!eventState.genDiscovered[`ch2_${idx}`],
      current: idx === ctx.level,
    }));
  } else if (ctx.type === 'ch3gen') {
    titleText = '第三章ジェネレーター';
    items = KANTEITA_GEN_IMAGES.map((imgSrc, idx) => ({
      imgSrc, label: `Lv${idx + 1}`,
      disc: !!eventState.genDiscovered[`ch3_${idx}`],
      current: idx === ctx.level,
    }));
  } else if (ctx.type === 'ch4gen') {
    titleText = '第四章ジェネレーター';
    items = KEIKAKU_GEN_IMAGES.map((imgSrc, idx) => ({
      imgSrc, label: `Lv${idx + 1}`,
      disc: !!eventState.genDiscovered[`ch4_${idx}`],
      current: idx === ctx.level,
    }));
  } else if (ctx.type === 'ch1item') {
    titleText = '第一章アイテム';
    items = EVENT_CHAIN.stages.map((emoji, idx) => ({
      imgSrc: EVENT_CHAIN.stageImages[idx],
      label: `Lv${idx + 1}`,
      disc: !!eventState.discovered[idx + 1],
      current: idx + 1 === ctx.stage,
    }));
  } else if (ctx.type === 'ch2item') {
    titleText = '第二章アイテム';
    const ch2 = CHAINS[SEIZO_CHAIN_ID];
    items = ch2.stages.map((emoji, idx) => ({
      imgSrc: ch2.stageImages[idx],
      label: `Lv${idx + 1}`,
      disc: !!eventState.seizoDiscovered[idx + 1],
      current: idx + 1 === ctx.stage,
    }));
  } else if (ctx.type === 'ch3item') {
    titleText = '第三章アイテム';
    const ch3 = CHAINS[KANTEITA_CHAIN_ID];
    items = ch3.stages.map((emoji, idx) => ({
      imgSrc: ch3.stageImages[idx],
      label: `Lv${idx + 1}`,
      disc: !!eventState.kanteDiscovered[idx + 1],
      current: idx + 1 === ctx.stage,
    }));
  } else if (ctx.type === 'ch4item') {
    titleText = '第四章アイテム';
    const ch4 = CHAINS[KEIKAKU_CHAIN_ID];
    items = ch4.stages.map((emoji, idx) => ({
      imgSrc: ch4.stageImages[idx],
      label: `Lv${idx + 1}`,
      disc: !!eventState.keikakuDiscovered[idx + 1],
      current: idx + 1 === ctx.stage,
    }));
  }

  title.textContent = titleText;
  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'navi-info-card' + (it.current ? ' navi-info-current' : '');
    if (it.disc && it.imgSrc) {
      card.innerHTML = `<img src="${it.imgSrc}" alt="${it.label}">`;
    } else {
      card.innerHTML = `<span class="navi-info-q">？</span>`;
    }
    card.innerHTML += `<span class="navi-info-lv">${it.label}</span>`;
    list.appendChild(card);
  });

  popup.classList.remove('hidden');
}

document.getElementById('navi-info-btn').addEventListener('click', e => {
  e.stopPropagation();
  openNaviInfoPopup();
});
document.getElementById('navi-info-popup-close').addEventListener('click', () => {
  document.getElementById('navi-info-popup').classList.add('hidden');
});
document.getElementById('navi-info-popup').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
});

function hideNaviHint() {
  if (naviHintTimer) { clearTimeout(naviHintTimer); naviHintTimer = null; }
  naviHintPersistent = false;
  document.getElementById('navi-hint-panel')?.classList.add('hidden');
  document.getElementById('navi-diamond-btn')?.classList.add('hidden');
  document.getElementById('navi-trash-btn')?.classList.add('hidden');
  document.getElementById('navi-coin-btn')?.classList.add('hidden');
}

function _showNaviHintPanel(text, showLvBtn, persistent = false, infoContext = null) {
  const panel  = document.getElementById('navi-hint-panel');
  const textEl = document.getElementById('navi-hint-text');
  const lvBtn  = document.getElementById('navi-lv-btn');
  if (!panel || !textEl) return;
  // チュートリアル中は表示しない
  if (!isTutorialComplete() || isGenMergeTutActive()) return;
  const tutPanel = document.getElementById('tutorial-panel');
  if (tutPanel && !tutPanel.classList.contains('hidden')) return;
  // 持続表示中（ジェネレーター選択など）は非持続の呼び出しを無視
  if (naviHintPersistent && !persistent) return;
  naviInfoContext = infoContext;
  const infoBtn = document.getElementById('navi-info-btn');
  if (infoBtn) infoBtn.classList.toggle('hidden', !infoContext);
  textEl.innerHTML = text;
  if (lvBtn) lvBtn.classList.toggle('hidden', !showLvBtn);
  document.getElementById('navi-diamond-btn')?.classList.add('hidden');
  document.getElementById('navi-trash-btn')?.classList.add('hidden');
  document.getElementById('navi-coin-btn')?.classList.add('hidden');
  panel.classList.remove('hidden');
  naviHintPersistent = persistent;
  if (naviHintTimer) clearTimeout(naviHintTimer);
  if (persistent) {
    naviHintTimer = null; // hideNaviHint() が呼ばれるまで表示し続ける
  } else {
    naviHintTimer = setTimeout(() => {
      panel.classList.add('hidden');
      naviHintPersistent = false;
      naviHintTimer = null;
    }, 3000);
  }
}

function updateNaviLvBtn(genLevel) {
  const lvLabel = document.getElementById('navi-lv-label');
  const lvCrown = document.getElementById('navi-lv-crown');
  if (!lvLabel || !lvCrown) return;
  const curPL = eventState.genPowerLevel;
  const maxPL = getGenMaxAvailablePowerLv(genLevel);
  lvLabel.innerHTML = `${POWER_COSTS[curPL]}${HP_ICON}`;
  lvCrown.textContent = curPL === maxPL ? '👑' : '';
}

function showNaviHintForGen(genLevel, persistent = false) {
  const maxGenLevel = EVENT_GEN_IMAGES.length - 1;
  const isMaxGen = genLevel >= maxGenLevel;
  const text = isMaxGen
    ? '第一章ジェネレーターは最大Lvです。もう一度タップでアイテムを生成！'
    : '第一章ジェネレーターをマージしてLvアップ！もう一度タップでアイテム生成。';
  if (!isMaxGen) updateNaviLvBtn(genLevel);
  _showNaviHintPanel(text, !isMaxGen, persistent, { type: 'ch1gen', level: genLevel });
}

function showNaviHintForFireGen(item, persistent = false) {
  const sLv = item.seizoLevel ?? 0;
  const maxSLv = SEIZO_GEN_IMAGES.length - 1;
  const isMax = sLv >= maxSLv;
  const text = isMax
    ? '第二章ジェネレーターは最大Lvです。もう一度タップでアイテムを生成！'
    : '第二章ジェネレーターをマージしてLvアップ！もう一度タップでアイテム生成。';
  if (!isMax) updateFireNaviLvBtn(sLv);
  _showNaviHintPanel(text, !isMax, persistent, { type: 'ch2gen', level: sLv });
}

function showNaviHintForKanteGen(item, persistent = false) {
  const kLv = item.kanteLevel ?? 0;
  const maxKLv = KANTEITA_GEN_IMAGES.length - 1;
  const isMax = kLv >= maxKLv;
  const text = isMax
    ? '第三章ジェネレーターは最大Lvです。もう一度タップでアイテムを生成！'
    : '第三章ジェネレーターをマージしてLvアップ！もう一度タップでアイテム生成。';
  const _kLv2 = item.kanteLevel ?? 0;
  _showNaviHintPanel(text, false, persistent, { type: 'ch3gen', level: _kLv2 });
}

function showNaviHintForKeikakuGen(item, persistent = false) {
  const kkLv = item.keikakuLevel ?? 0;
  const maxKkLv = KEIKAKU_GEN_IMAGES.length - 1;
  const isMax = kkLv >= maxKkLv;
  const text = isMax
    ? '第四章ジェネレーターは最大Lvです。もう一度タップでアイテムを生成！'
    : '第四章ジェネレーターをマージしてLvアップ！もう一度タップでアイテム生成。';
  _showNaviHintPanel(text, false, persistent, { type: 'ch4gen', level: kkLv });
}

function showNaviHintForItem(item, persistent = false) {
  const chainInfo = item.chainId !== undefined ? CHAINS[item.chainId] : EVENT_CHAIN;
  const idx  = item.stage - 1;
  const name = chainInfo.stageNames?.[idx] ?? chainInfo.stages?.[idx] ?? 'アイテム';
  const isMax = item.stage >= chainInfo.stages.length;
  const text = isMax
    ? `${name}は、最大Lvに達しています`
    : `${name}をマージさせて次のレベルにアップしましょう。`;
  const cid = item.chainId;
  const itemCtx = cid === undefined        ? { type: 'ch1item', stage: item.stage }
                : cid === SEIZO_CHAIN_ID    ? { type: 'ch2item', stage: item.stage }
                : cid === KANTEITA_CHAIN_ID ? { type: 'ch3item', stage: item.stage }
                : cid === KEIKAKU_CHAIN_ID  ? { type: 'ch4item', stage: item.stage }
                : null;
  _showNaviHintPanel(text, false, persistent, itemCtx);
  // Lv1: ゴミ箱ボタン、Lv2以降: コイン獲得ボタン
  const trashBtn = document.getElementById('navi-trash-btn');
  const coinBtn  = document.getElementById('navi-coin-btn');
  const coinLbl  = document.getElementById('navi-coin-label');
  if (item.stage === 1) {
    trashBtn?.classList.remove('hidden');
    coinBtn?.classList.add('hidden');
  } else {
    trashBtn?.classList.add('hidden');
    const reward = item.stage * 10;
    if (coinLbl) coinLbl.innerHTML = `${COIN_ICON} ${reward}`;
    coinBtn?.classList.remove('hidden');
  }
}

function showNaviHintForCoin(item) {
  const lv     = item.coinLv ?? 1;
  const reward = COIN_REWARD[lv] ?? 0;
  const isMax  = lv >= COIN_MAX_LV;
  const text   = isMax
    ? `コインLv${lv}（最大）: ダブルタップで${COIN_ICON}+${reward}`
    : `コインLv${lv}: ダブルタップで${COIN_ICON}+${reward}。同じLvと重ねてLvアップ！`;
  _showNaviHintPanel(text, false, true);
}

// しゃぼん玉アイテム用ナビヒント（ダイヤボタンを表示）
function showNaviHintForBubble(item) {
  const stage = item.stage ?? 1;
  const cost  = BUBBLE_DIAMOND_COST[stage] ?? 0;
  const panel  = document.getElementById('navi-hint-panel');
  const textEl = document.getElementById('navi-hint-text');
  const lvBtn  = document.getElementById('navi-lv-btn');
  const diaBtn = document.getElementById('navi-diamond-btn');
  const diaLbl = document.getElementById('navi-diamond-label');
  if (!panel || !textEl) return;
  textEl.textContent = `しゃぼん玉に包まれています。💎${cost} で割ることができます。`;
  if (lvBtn)  lvBtn.classList.add('hidden');
  if (diaBtn) diaBtn.classList.remove('hidden');
  if (diaLbl) diaLbl.textContent = `💎 ${cost}`;
  document.getElementById('navi-trash-btn')?.classList.add('hidden');
  document.getElementById('navi-coin-btn')?.classList.add('hidden');
  panel.classList.remove('hidden');
  naviHintPersistent = true;
  if (naviHintTimer) clearTimeout(naviHintTimer);
  naviHintTimer = null;
}

// しゃぼん玉を割るアニメーション + ダイヤ消費
function popBubble(cellIdx) {
  const cells = document.querySelectorAll('#event-board .cell');
  const cell  = cells[cellIdx];
  const overlay = cell?.querySelector('.bubble-overlay');
  const finish = () => {
    if (eventState.board[cellIdx]) {
      delete eventState.board[cellIdx].isBubble;
    }
    hideNaviHint();
    eventState.selectedCell = null;
    renderEventBoard();
    renderEventHeader();
  };
  if (overlay) {
    overlay.style.animation = 'bubble-pop 0.35s ease-out forwards';
    setTimeout(finish, 350);
  } else {
    finish();
  }
}

// 後方互換（既存の showNaviHint 呼び出し箇所があれば利用）
function showNaviHint(text) { _showNaviHintPanel(text, false); }

// ========================================
// イベントボード描画
// ========================================

// ボードアイテムの表示情報を取得（chainId あり → メインチェーン、なし → EVENT_CHAIN）
function getEvItemDisplay(item) {
  if (item.isCoin) {
    const lv = item.coinLv ?? 1;
    return { emoji: COIN_EMOJI[lv] ?? '🪙', imgSrc: COIN_IMAGES[lv] ?? null };
  }
  if (item.chainId !== undefined) {
    const chain = CHAINS[item.chainId];
    return {
      emoji:  chain.stages[item.stage - 1] || '❓',
      imgSrc: chain.stageImages?.[item.stage - 1] ?? null,
    };
  }
  return {
    emoji:  EVENT_CHAIN.stages[item.stage - 1] || '❓',
    imgSrc: EVENT_CHAIN.stageImages?.[item.stage - 1] ?? null,
  };
}

// 2つのボードアイテムがマージ可能か（同チェーン・同ステージ）
function evItemCanMerge(a, b) {
  if (!a || !b) return false;
  if (a.isEventGen || b.isEventGen) return false;
  if (a.isBubble || b.isBubble) return false; // しゃぼん玉はマージ不可
  // コイン同士のマージ（同Lv かつ Lv5未満）
  if (a.isCoin && b.isCoin) return a.coinLv === b.coinLv && a.coinLv < COIN_MAX_LV;
  if (a.isCoin || b.isCoin) return false;
  return a.stage === b.stage && (a.chainId ?? 'ev') === (b.chainId ?? 'ev');
}

function renderEventBoard() {
  const board = document.getElementById('event-board');
  if (!board) return;
  board.innerHTML = '';

  const step = currentTutStep();
  const { boardHighlights } = mainGameStarted ? calcMatchHighlights() : { boardHighlights: new Map() };

  // 同Lvペアの検出（霧アイテムも対象）
  const evPairMap = {};   // key="chainKey-stage" → count
  const evPairSet = new Set();
  eventState.board.forEach(item => {
    if (!item || item.isEventGen) return;
    const key = item.isCoin
      ? `coin-${item.coinLv}`
      : `${item.chainId ?? 'ev'}-${item.stage}`;
    evPairMap[key] = (evPairMap[key] || 0) + 1;
    if (evPairMap[key] >= 2) evPairSet.add(key);
  });

  // 選択中アイテム
  const selItem = eventState.selectedCell !== null ? eventState.board[eventState.selectedCell] : null;

  for (let i = 0; i < EVENT_TOTAL; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;

    const item = eventState.board[i];

    if (item) {
      if (item.isFog) {
        // ──────────────────────────────
        // 霧アイテム（Lv1/2/3）
        // ──────────────────────────────
        cell.classList.add('has-item', 'fog-item');
        const fogUnlocked = eventState.unlockedFogCells.has(i);
        if (!fogUnlocked) cell.classList.add('fog-locked');
        // stage1〜3はカスタム画像（蜘蛛の巣）を使用 → CSS霧演出を無効化
        const FOG_CUSTOM_IMGS = {
          1: 'img/Chapter1/Icon/image_merge_icon1_01a.png',
          2: 'img/Chapter1/Icon/image_merge_icon1_02a.png',
          3: 'img/Chapter1/Icon/image_merge_icon1_03a.png',
        };
        const useFogImg = item.stage in FOG_CUSTOM_IMGS;
        if (useFogImg) cell.classList.add('fog-custom-img');
        const { emoji, imgSrc: _imgSrc } = getEvItemDisplay(item);
        const imgSrc = useFogImg ? FOG_CUSTOM_IMGS[item.stage] : _imgSrc;
        const iconHtml = imgSrc
          ? `<img class="item-img item-img-lg" src="${imgSrc}" alt="${emoji}">`
          : `<span class="item-emoji">${emoji}</span>`;
        cell.innerHTML = iconHtml;

        // マージターゲット判定（解放済み霧のみ）
        if (fogUnlocked && selItem && i !== eventState.selectedCell && evItemCanMerge(selItem, item)) {
          cell.classList.add('merge-target');
        }
        // 霧アイテムはシェイクしない（ヒント不要）

        if (step || isGenMergeTutActive()) cell.classList.add('tutorial-dim');

        // 霧アイテムはドラッグ不可（merge-target としてドロップ受け）
        cell.addEventListener('mousedown', (e) => startEvDrag(e, i));
        cell.addEventListener('touchstart', (e) => startEvDragTouch(e, i), { passive: false });

      } else if (item.isEventGen) {
        // ──────────────────────────────
        // ジェネレーター（メモ帳 or 炎）
        // ──────────────────────────────
        cell.classList.add('has-item', 'has-generator');
        const starsHtml = Array.from({length: 5}, (_, si) => {
          const sw  = 14;
          const x   = 15 + si * sw + Math.floor(Math.random() * sw);
          const d   = (si * 0.3).toFixed(1);
          const dur = (1.1 + Math.random() * 0.8).toFixed(2);
          const ris = 160 + Math.floor(Math.random() * 100);
          return `<span class="gen-star" style="--x:${x}%;--delay:${d}s;--duration:${dur}s;--rise:${ris}%"></span>`;
        }).join('');

        if (item.isFireGen) {
          // 製造機ジェネレーター（per-tile seizoLevel）
          cell.id = 'fire-gen-tile'; // ガイドアテンション用の安定ID
          const sLv  = item.seizoLevel ?? eventState.seizoGenLevel ?? 0;
          const sImg = SEIZO_GEN_IMAGES[Math.min(sLv, SEIZO_GEN_IMAGES.length - 1)];
          cell.innerHTML = `
            <img class="item-img item-img-lg" src="${sImg}" alt="製造機">
            <div class="gen-stars">${starsHtml}</div>
            <span class="gen-energy-badge">${HP_ICON}</span>
          `;
          // 選択・マージターゲット表示
          if (!step) {
            if (i === eventState.selectedCell) cell.classList.add('selected');
            if (selItem && selItem.isFireGen && i !== eventState.selectedCell &&
                (selItem.seizoLevel ?? 0) === sLv) {
              cell.classList.add('merge-target');
            }
          }
          if (step) cell.classList.add('tutorial-dim');
          else if (isGenMergeTutActive()) cell.classList.add('tutorial-dim');
          cell.addEventListener('touchstart', (e) => startEvDragTouch(e, i), { passive: false });
          cell.addEventListener('mousedown', (e) => startEvDrag(e, i));
        } else if (item.isKanteGen) {
          // 鑑定台ジェネレーター（第三章）
          const kLv  = item.kanteLevel ?? 0;
          const kImg = KANTEITA_GEN_IMAGES[Math.min(kLv, KANTEITA_GEN_IMAGES.length - 1)];
          cell.innerHTML = `
            <img class="item-img item-img-lg" src="${kImg}" alt="鑑定台">
            <div class="gen-stars">${starsHtml}</div>
            <span class="gen-energy-badge">${HP_ICON}</span>
          `;
          if (!step) {
            if (i === eventState.selectedCell) cell.classList.add('selected');
            if (selItem && selItem.isKanteGen && i !== eventState.selectedCell &&
                (selItem.kanteLevel ?? 0) === kLv) {
              cell.classList.add('merge-target');
            }
          }
          if (step || isGenMergeTutActive()) cell.classList.add('tutorial-dim');
          cell.addEventListener('touchstart', (e) => startEvDragTouch(e, i), { passive: false });
          cell.addEventListener('mousedown', (e) => startEvDrag(e, i));
        } else if (item.isKeikakuGen) {
          // 設計台ジェネレーター（第四章）
          cell.id = 'keikaku-gen-tile';
          const kkLv  = item.keikakuLevel ?? 0;
          const kkImg = KEIKAKU_GEN_IMAGES[Math.min(kkLv, KEIKAKU_GEN_IMAGES.length - 1)];
          cell.innerHTML = `
            <img class="item-img item-img-lg" src="${kkImg}" alt="設計台">
            <div class="gen-stars">${starsHtml}</div>
            <span class="gen-energy-badge">${HP_ICON}</span>
          `;
          if (!step) {
            if (i === eventState.selectedCell) cell.classList.add('selected');
            if (selItem && selItem.isKeikakuGen && i !== eventState.selectedCell &&
                (selItem.keikakuLevel ?? 0) === kkLv) {
              cell.classList.add('merge-target');
            }
          }
          if (step || isGenMergeTutActive()) cell.classList.add('tutorial-dim');
          cell.addEventListener('touchstart', (e) => startEvDragTouch(e, i), { passive: false });
          cell.addEventListener('mousedown', (e) => startEvDrag(e, i));
        } else {
          // メモ帳ジェネレーター
          cell.innerHTML = `
            <img class="item-img item-img-lg" src="${EVENT_GEN_IMAGES[Math.min(item.genLevel ?? 0, EVENT_GEN_IMAGES.length - 1)]}" alt="ジェネレーター">
            <div class="gen-stars">${starsHtml}</div>
            <span class="gen-energy-badge">${HP_ICON}</span>
          `;

          // チュートリアル完了後: 選択・マージターゲット表示
          if (!step) {
            if (i === eventState.selectedCell) cell.classList.add('selected');
            // 同Lvの別ジェネレータータイルが選ばれていればマージターゲット
            if (selItem && selItem.isEventGen && !selItem.isFireGen &&
                i !== eventState.selectedCell &&
                (selItem.genLevel ?? 0) === (item.genLevel ?? 0)) {
              cell.classList.add('merge-target');
            }
          }

          if (step) {
            if (step.type === 'gen_focus') cell.classList.add('tutorial-spotlight');
            else                          cell.classList.add('tutorial-dim');
          } else if (isGenMergeTutActive()) {
            const gmStep = currentGenMergeTutStep();
            if (gmStep?.type === 'focus' && !item.isFireGen) {
              cell.classList.add('tutorial-spotlight');
            } else if (gmStep?.type === 'msg' && !item.isFireGen && (item.genLevel ?? 0) >= 1) {
              // Lv2ジェネレーター（genLevel=1）をメッセージ中にスポットライト表示
              cell.classList.add('tutorial-spotlight');
            } else {
              cell.classList.add('tutorial-dim');
            }
          }
          cell.addEventListener('touchstart', (e) => startEvDragTouch(e, i), { passive: false });
          cell.addEventListener('mousedown', (e) => startEvDrag(e, i));
          if (!isTouchDevice) {
            cell.addEventListener('mouseenter', () => {
              if (step || isGenMergeTutActive()) return;
              showNaviHintForGen(item.genLevel ?? 0, false);
            });
          }
        }

      } else {
        // ──────────────────────────────
        // 通常マージアイテム（メモ帳 or 炎）
        // ──────────────────────────────
        cell.classList.add('has-item');
        const { emoji, imgSrc } = getEvItemDisplay(item);
        const iconHtml = imgSrc
          ? `<img class="item-img${item.stage === 1 ? ' item-img-lg' : ''}" src="${imgSrc}" alt="${emoji}">`
          : `<span class="item-emoji">${emoji}</span>`;
        cell.innerHTML = iconHtml;

        // しゃぼん玉オーバーレイ
        if (item.isBubble) {
          cell.classList.add('has-bubble');
          if (item.isNewBubble) cell.classList.add('bubble-appear'); // 出現アニメ
          const overlay = document.createElement('div');
          overlay.className = 'bubble-overlay';
          cell.appendChild(overlay);
        }
        // コインLv5: 水蒸気アニメーションオーバーレイ
        if (item.isCoin && item.coinLv >= COIN_MAX_LV) {
          cell.classList.add('has-coin-smoke');
          const smoke = document.createElement('div');
          smoke.className = 'coin-smoke-overlay';
          for (let s = 0; s < 3; s++) {
            const p = document.createElement('span');
            p.className = 'steam-particle';
            smoke.appendChild(p);
          }
          cell.appendChild(smoke);
        }

        if (i === eventState.selectedCell) cell.classList.add('selected');
        // マージターゲット
        if (selItem && i !== eventState.selectedCell && evItemCanMerge(selItem, item)) {
          cell.classList.add('merge-target');
        }
        // 依頼マッチハイライト
        const matchLv = boardHighlights.get(i);
        if (matchLv === 'full')    cell.classList.add('cell-match-full');
        else if (matchLv === 'partial') cell.classList.add('cell-match-partial');
        // ヒントシェイク（最大Lv・しゃぼん玉はシェイクしない）
        const normalKey = item.isCoin
          ? `coin-${item.coinLv}`
          : `${item.chainId ?? 'ev'}-${item.stage}`;
        let canMergeItem = false;
        if (item.isCoin) {
          canMergeItem = item.coinLv < COIN_MAX_LV;
        } else if (!item.isBubble) {
          const chainForMax = item.chainId !== undefined ? CHAINS[item.chainId] : EVENT_CHAIN;
          canMergeItem = item.stage < (chainForMax.stages?.length ?? 99);
        }
        if (evPairSet.has(normalKey) && canMergeItem) cell.classList.add('merge-hint');

        // チュートリアルの見た目
        if (step) {
          const spotlightCat = eventState.tutorialStep >= 5 && eventState.tutorialStep <= 8;
          if (step.type === 'merge_focus') {
            cell.classList.add('tutorial-spotlight');
          } else if (spotlightCat && item.stage === 2) {
            cell.classList.add('tutorial-spotlight');
          } else {
            cell.classList.add('tutorial-dim');
          }
        } else if (isGenMergeTutActive()) {
          // ジェネレーターマージ誘導中: 通常アイテムはすべてディム
          cell.classList.add('tutorial-dim');
        }
        cell.addEventListener('mousedown', (e) => { startEvDrag(e, i); });
        cell.addEventListener('touchstart', (e) => { startEvDragTouch(e, i); }, { passive: false });
      }
    }

    cell.addEventListener('click', () => onEventCellClick(i));
    board.appendChild(cell);
  }
  // ガイド進行中はアテンション再適用（DOM再生成後も維持）
  if (isGuideInProgress()) _applyGuideAttention(true);

  // しゃぼん玉出現アニメ用フラグを500ms後にクリア（以降のre-renderで再アニメしない）
  if (eventState.board.some(it => it?.isNewBubble)) {
    setTimeout(() => {
      eventState.board.forEach(it => { if (it?.isNewBubble) delete it.isNewBubble; });
    }, 500);
  }
}

// ========================================
// イベントヘッダー・依頼描画
// ========================================
function renderEventHeader() {
  const el = document.getElementById('ev-energy-num');
  if (el) el.textContent = Math.floor(state.energy);
  const ecn = document.getElementById('ev-coin-num');
  if (ecn) ecn.textContent = state.coin;
  const edn = document.getElementById('ev-diamond-num');
  if (edn) edn.textContent = state.diamond;
  renderPlayerLevel();
}

// プレイヤーレベルアイコン・ストーリーボタンの表示更新
function renderPlayerLevel() {
  const numEl    = document.getElementById('player-level-num');
  const ringEl   = document.getElementById('player-level-ring');
  const storyBtn = document.getElementById('story-btn');
  if (!numEl || !ringEl) return;

  numEl.textContent = state.playerLevel;

  const xp     = state.playerXP;
  const needed = getLevelUpXP(state.playerLevel);
  const pct    = Math.min(100, (xp / needed) * 100);
  ringEl.style.background =
    `conic-gradient(#f9c846 ${pct}%, #2a3a6a ${pct}%)`;

  if (storyBtn) {
    const cost       = getStoryCost(state.playerLevel);
    const canProgress = state.coin >= cost;
    // ストーリー画面はいつでも開ける（コイン不足でも章選択・見返しは可能）
    storyBtn.disabled = false;
    storyBtn.classList.toggle('story-btn-active', canProgress);
    // ストーリーボタンが初めてアクティブになった瞬間にガイドを表示
    if (canProgress) checkStoryGuide();
  }
}

// 章別シーンID配列
const CH1_SCENE_IDS = ['scene02','scene03','scene04','scene05','scene06','scene07','scene08','scene09','scene10','scene11','scene12','scene13','scene14','scene15','scene16','scene17'];
const CH2_SCENE_IDS = ['c2s01','c2s02','c2s03','c2s04','c2s05','c2s06','c2s07','c2s08','c2s09','c2s10','c2s11','c2s12','c2s13','c2s14','c2s15','c2s15b','c2s16','c2s17','c2s18','c2s19','c2s20'];
const CH3_SCENE_IDS = ['c3s01','c3s02','c3s03','c3s04','c3s05','c3s06','c3s07','c3s08','c3s09','c3s10','c3s11','c3s12','c3s13','c3s14','c3s15','c3s16','c3s17','c3s18','c3s19','c3s20','c3s21','c3s22','c3s23','c3s24','c3s25','c3s26'];
const CH4_SCENE_IDS = ['c4s01','c4s02','c4s03','c4s04','c4s05','c4s06','c4s07','c4s08','c4s09','c4s10','c4s11','c4s12','c4s13','c4s14','c4s15','c4s16','c4s17','c4s18','c4s19','c4s20','c4s21','c4s22','c4s23','c4s24','c4s25','c4s26','c4s27','c4s28','c4s29','c4s30'];

// ストーリー進行処理（chapter: 1/2/3）
function progressStory(chapter = 1) {
  const cost = getStoryCost(state.playerLevel);
  if (state.coin < cost) { showToast('コインが足りません'); return; }
  state.coin    -= cost;
  state.playerXP += cost;
  state.storyCount++;  // 総読了数（XP計算用）

  // 章別カウントアップ＆シーンID取得
  let sceneId;
  if (chapter === 1) {
    sceneId = CH1_SCENE_IDS[state.ch1Count] ?? CH1_SCENE_IDS[CH1_SCENE_IDS.length - 1];
    state.ch1Count = Math.min(state.ch1Count + 1, CH1_SCENE_IDS.length);
  } else if (chapter === 2) {
    sceneId = CH2_SCENE_IDS[state.ch2Count] ?? CH2_SCENE_IDS[CH2_SCENE_IDS.length - 1];
    state.ch2Count = Math.min(state.ch2Count + 1, CH2_SCENE_IDS.length);
  } else if (chapter === 3) {
    sceneId = CH3_SCENE_IDS[state.ch3Count] ?? CH3_SCENE_IDS[CH3_SCENE_IDS.length - 1];
    state.ch3Count = Math.min(state.ch3Count + 1, CH3_SCENE_IDS.length);
  } else {
    sceneId = CH4_SCENE_IDS[state.ch4Count] ?? CH4_SCENE_IDS[CH4_SCENE_IDS.length - 1];
    state.ch4Count = Math.min(state.ch4Count + 1, CH4_SCENE_IDS.length);
  }

  // レベルアップ判定（複数回上がる場合も対応）
  let leveledUp = false;
  while (state.playerXP >= getLevelUpXP(state.playerLevel)) {
    state.playerXP -= getLevelUpXP(state.playerLevel);
    state.playerLevel++;
    leveledUp = true;
  }
  if (leveledUp) {
    const ringEl = document.getElementById('player-level-ring');
    showFloatNearEl(`プレイヤーLv${state.playerLevel}！`, '#f9c846', ringEl);
    if (ringEl) {
      ringEl.classList.add('player-level-up-flash');
      setTimeout(() => ringEl.classList.remove('player-level-up-flash'), 800);
    }
  }

  renderEventHeader();

  // 閲覧済みシーン記録
  if (!state.seenScenes) state.seenScenes = [];
  if (!state.seenScenes.includes(sceneId)) state.seenScenes.push(sceneId);
  // 相関図アテンション更新（新アイテム解放時にバッジ表示）
  updateKankeiAttention();

  // ── シーン終了後コールバックを構築 ──────────────────────────────
  // 複数の条件が同時に成立する場合は chain で順次実行
  let postSceneCallback = null;
  function _chain(cb) {
    const prev = postSceneCallback;
    postSceneCallback = prev ? () => { prev(); cb(); } : cb;
  }

  // ── 第一章完了バナー：第一章最終話終了時に一度だけ表示
  if (chapter === 1 && state.ch1Count >= CH1_SCENE_IDS.length && !eventState.ch1BannerShown) {
    eventState.ch1BannerShown = true;
    _chain(() => {
      setTimeout(() => showChapterCompleteBanner('img/UI/image_merge_ch1_complete.png'), 80);
    });
  }

  // ── 第一章ジェネレーター Lv3：第一章 Scene8 終了時（カメラLv8到達より先の場合）
  if (chapter === 1 && state.ch1Count === 8 && !eventState.genUpTriggered.has('ch1lv3')) {
    _chain(() => {
      if (eventState.genUpTriggered.has('ch1lv3')) return; // アイテムLv8で先に発火済みなら skip
      const ch1Gen = eventState.board.find(
        c => c && c.isEventGen && !c.isFireGen && !c.isKanteGen && !c.isKeikakuGen
      );
      if (!ch1Gen) return;
      const genTileCount = eventState.board.filter(c => c && c.isEventGen && !c.isFireGen).length;
      if (genTileCount >= 2) return;
      eventState.genUpTriggered.add('ch1lv3');
      const eIdx = eventState.board.findIndex(
        c => c && c.isEventGen && !c.isFireGen && !c.isKanteGen && !c.isKeikakuGen
      );
      const slot = findNearestEmptyEventCell(eIdx);
      if (slot !== -1) {
        eventState.board[slot] = { isEventGen: true, genLevel: ch1Gen.genLevel ?? 0 };
        renderEventBoard();
        showToast('ジェネレーターが2枚出現！重ねてLvアップ！');
      }
    });
  }

  // ── 第二章ジェネレーター解放：第一章 Scene8 終了時
  if (chapter === 1 && state.ch1Count === 8 && !eventState.fireGenUnlocked) {
    _chain(() => {
      unlockFireGenerator();
      requestAnimationFrame(() => {
        startGuide([
          '新たな章が出現しました。',
          '別の章のストーリーも見ることができます。',
        ], '#fire-gen-tile', null);
      });
    });
  }

  // ── 第一章ジェネレーター Lv4：第一章 Scene12 終了時（Lv3以上が存在する場合のみ）
  if (chapter === 1 && state.ch1Count === 12 && !eventState.genUpTriggered.has('ch1lv4')) {
    _chain(() => {
      const ch1Gen = eventState.board.find(
        c => c && c.isEventGen && !c.isFireGen && !c.isKanteGen && !c.isKeikakuGen
      );
      if (ch1Gen && (ch1Gen.genLevel ?? 0) >= 2) {
        eventState.genUpTriggered.add('ch1lv4');
        const eIdx = eventState.board.findIndex(
          c => c && c.isEventGen && !c.isFireGen && !c.isKanteGen && !c.isKeikakuGen
        );
        const slot = findNearestEmptyEventCell(eIdx);
        if (slot !== -1) {
          eventState.board[slot] = { isEventGen: true, genLevel: ch1Gen.genLevel };
          showToast('ジェネレーターが2枚出現！重ねてLvアップ！');
          renderEventBoard();
        }
      }
    });
  }

  // ── 第二章ジェネレーター LvUp タイル：Scene5/7/9/11/13 終了時
  if (chapter === 2 && eventState.fireGenUnlocked) {
    const CH2_LVUP_SCENES = [5, 7, 9, 11, 13];
    if (CH2_LVUP_SCENES.includes(state.ch2Count) && !eventState.seizoLvTriggered.has(state.ch2Count)) {
      const t = state.ch2Count;
      _chain(() => _spawnChGenLvUpTile(2, t, eventState.seizoLvTriggered));
    }
  }

  // ── 第三章ジェネレーター解放：第二章 Scene8 終了時
  if (chapter === 2 && state.ch2Count === 8 && !eventState.kanteGenUnlocked) {
    _chain(() => {
      unlockKanteGenerator();
      requestAnimationFrame(() => {
        startGuide([
          '第三章が解放されました。',
          '新たな事件の幕が上がります。',
        ], '#kante-gen-tile', null);
      });
    });
  }

  // ── 第三章ジェネレーター LvUp タイル：Scene5/7/9/11/13 終了時
  if (chapter === 3 && eventState.kanteGenUnlocked) {
    const CH3_LVUP_SCENES = [5, 7, 9, 11, 13];
    if (CH3_LVUP_SCENES.includes(state.ch3Count) && !eventState.kanteLvTriggered.has(state.ch3Count)) {
      const t = state.ch3Count;
      _chain(() => _spawnChGenLvUpTile(3, t, eventState.kanteLvTriggered));
    }
  }

  // ── 第四章ジェネレーター解放：第三章 Scene8 終了時 かつ 第一章全話完了済み
  //    ※ どちらが先に満たされても対応（両条件を都度チェック）
  const ch4Unlockable = state.ch3Count >= 8 &&
                        state.ch1Count >= CH1_SCENE_IDS.length &&
                        !eventState.keikakuGenUnlocked;
  if (ch4Unlockable && (chapter === 3 || chapter === 1)) {
    _chain(() => {
      unlockKeikakuGenerator();
      requestAnimationFrame(() => {
        startGuide([
          '第四章が解放されました。',
          '新たな事件の調査が始まります。',
        ], '#keikaku-gen-tile', null);
      });
    });
  }

  // ── 第四章ジェネレーター LvUp タイル：Scene5/7/9/11/13 終了時
  if (chapter === 4 && eventState.keikakuGenUnlocked) {
    const CH4_LVUP_SCENES = [5, 7, 9, 11, 13];
    if (CH4_LVUP_SCENES.includes(state.ch4Count) && !eventState.keikakuLvTriggered.has(state.ch4Count)) {
      const t = state.ch4Count;
      _chain(() => _spawnChGenLvUpTile(4, t, eventState.keikakuLvTriggered));
    }
  }

  openAdventureScene(sceneId, postSceneCallback || undefined);
}

// ========================================
// イベントマップ専用 依頼システム
// ========================================

// イベントアイテムのチェーン一致判定（chainId なし = EVENT_CHAIN）
function eventItemMatchesReq(boardItem, reqItem) {
  if (reqItem.chainId !== undefined) {
    // 炎など特定チェーン指定
    return boardItem.chainId === reqItem.chainId && boardItem.stage === reqItem.stage;
  } else {
    // EVENT_CHAIN（メモ帳）指定
    return boardItem.chainId === undefined && boardItem.stage === reqItem.stage;
  }
}

// 依頼×盤面の照合ハイライト計算
// 戻り値: { boardHighlights: Map<boardIdx, 'full'|'partial'>,
//           reqHighlights: Map<reqIdx, Array<'full'|'partial'|'none'>> }
function calcMatchHighlights() {
  const boardHighlights = new Map();  // boardIdx → 'full'|'partial'
  const reqHighlights   = new Map();  // reqIdx  → per-item array

  eventState.requests.forEach((req, ri) => {
    // Step1: 消費方式でどの依頼アイテムが揃っているか確認
    const tempBoard   = [...eventState.board];
    const matchedIdxs = req.items.map(reqItem => {
      const idx = tempBoard.findIndex(b =>
        b && !b.isFog && !b.isEventGen && !b.isBubble && eventItemMatchesReq(b, reqItem)
      );
      if (idx !== -1) tempBoard[idx] = null;
      return idx;
    });

    const allMatched = matchedIdxs.every(idx => idx !== -1);
    const level = allMatched ? 'full' : 'partial';

    // Step2: 依頼アイテムバッジのハイライト（消費照合結果をそのまま使用）
    reqHighlights.set(ri, matchedIdxs.map(idx => idx !== -1 ? level : 'none'));

    // Step3: 盤面セルは「揃っている依頼アイテムに合致する全セル」を光らせる
    req.items.forEach((reqItem, ii) => {
      if (matchedIdxs[ii] === -1) return; // この依頼アイテムは未達成 → スキップ
      eventState.board.forEach((b, idx) => {
        if (!b || b.isFog || b.isEventGen || b.isBubble) return;
        if (!eventItemMatchesReq(b, reqItem)) return;
        // full が partial を上書き
        if (!boardHighlights.has(idx) || boardHighlights.get(idx) === 'partial') {
          boardHighlights.set(idx, level);
        }
      });
    });
  });

  return { boardHighlights, reqHighlights };
}

// イベントボード上のアイテムで依頼が達成可能か確認
function eventRequestCompletable(req) {
  const boardCopy = [...eventState.board];
  for (const reqItem of req.items) {
    const idx = boardCopy.findIndex(b =>
      b && !b.isFog && !b.isEventGen && !b.isBubble && eventItemMatchesReq(b, reqItem)
    );
    if (idx === -1) return false;
    boardCopy[idx] = null;
  }
  return true;
}

// イベントボードのアイテムを消費して依頼を完了
function showRewardNearBtn(text, btnEl) {
  const rect = btnEl.getBoundingClientRect();
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = `
    position:fixed;
    left:${rect.left + rect.width / 2}px;
    top:${rect.top - 8}px;
    transform:translate(-50%,-100%);
    background:rgba(10,30,70,0.92);
    color:#fff;
    padding:6px 18px;
    border-radius:20px;
    font-size:14px;
    font-weight:bold;
    pointer-events:none;
    z-index:9999;
    white-space:nowrap;
    animation:toast-pop 2s ease-out forwards;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2100);
}

function completeEventRequest(index) {
  if (isTutorialInProgress()) return;
  const req = eventState.requests[index];
  if (!req) return;
  if (!eventRequestCompletable(req)) { showToast('該当アイテムがありません'); return; }

  const boardCopy = [...eventState.board];
  for (const reqItem of req.items) {
    const idx = boardCopy.findIndex(b =>
      b && !b.isFog && !b.isEventGen && !b.isBubble && eventItemMatchesReq(b, reqItem)
    );
    if (idx !== -1) {
      eventState.board[idx] = null;
      boardCopy[idx] = null;
    }
  }

  state.coin += req.coin;
  state.totalCoinEarned += req.coin;
  state.requestCompletedTotal++;
  trackDailyRequest();
  checkStoryGuide();
  showRewardInPanel('依頼完了！', document.getElementById('event-req-panel'), '#ff8c00');
  if (state.requestCompletedTotal % 10 === 0) {
    addEnergy(25, `依頼${state.requestCompletedTotal}回達成ボーナス！`);
  }

  // 完了履歴を記録（Set 置き換え方式）
  // 今回解決した依頼のキーで Set を丸ごと置き換え → 前回のブロックは自動解除
  const newKeys = new Set();
  for (const it of req.items) {
    const key = it.chainId !== undefined ? `${it.chainId}-${it.stage}` : `ev-${it.stage}`;
    if (!it.chainId && it.stage <= 5) {
      // Ch1 Lv1-5のみ永久封印（第一章序盤アイテムは一度解決したら不要）
      eventState.completedLowStages.add(key);
    } else {
      // Ch2/Ch3全Lv・Ch1 Lv6+: 1件おやすみ後に復活
      newKeys.add(key);
    }
  }
  eventState.recentlySolvedKeys = newKeys; // 置き換え（前回分は自動クリア）

  eventState.requests.splice(index, 1);
  fillEventRequests();
  renderEventBoard();
  renderEventRequest();
  renderEventHeader();
}

// イベントマップ専用の依頼を補充
// ・最低 MIN_SLOTS 枠、最大 MAX_SLOTS 枠
// ・各章のジェネレーター解放状況に応じてアイテム種別を均等抽選
// ・Lv1-5は一度解決したら永久に再出現しない（Ch1のみLv1-2は初回から除外）
// ・Lv6以降は1個か2個かランダム（同Lv2個は不可、直前完了キーは1回スキップ）
function fillEventRequests() {
  const MIN_SLOTS = 3;
  const MAX_SLOTS = 5;

  // メモ帳ジェネレーターの現在Lv（最も高いものを使う）
  const genItem = eventState.board.find(c => c && c.isEventGen && !c.isFireGen);
  const genLv   = genItem ? (genItem.genLevel ?? 0) : 0;

  // Ch1ステージ範囲（序盤は最低8まで開放して多様性を確保）
  const ch1StageMin = 3;
  const ch1StageMax = Math.min(EVENT_CHAIN.stages.length, Math.max(8, genLv * 2 + 5));

  // 章解放・完了フラグ
  const ch1StoryDone = state.ch1Count >= CH1_SCENE_IDS.length;
  const ch2StoryDone = state.ch2Count >= CH2_SCENE_IDS.length;
  const ch3StoryDone = state.ch3Count >= CH3_SCENE_IDS.length;
  const ch4StoryDone = state.ch4Count >= CH4_SCENE_IDS.length;
  const seizoAvailable   = eventState.fireGenUnlocked    && !ch2StoryDone;
  const kanteAvailable   = eventState.kanteGenUnlocked   && !ch3StoryDone;
  const keikakuAvailable = eventState.keikakuGenUnlocked && !ch4StoryDone;

  // Ch2・Ch3・Ch4のステージ上限（ジェネレーターLvに応じて拡大）
  const ch2StageMax = Math.min(CHAINS[SEIZO_CHAIN_ID].stages.length,
    Math.max(3, (eventState.seizoGenLevel + 1) * 2 + 2));
  const ch3StageMax = Math.min(CHAINS[KANTEITA_CHAIN_ID].stages.length,
    Math.max(3, (eventState.kanteGenLevel + 1) * 2 + 2));
  const ch4StageMax = Math.min(CHAINS[KEIKAKU_CHAIN_ID].stages.length,
    Math.max(3, (eventState.keikakuGenLevel + 1) * 2 + 2));

  // 既存依頼で使用済みのステージキー（重複防止）
  const usedStageKeys = new Set(
    eventState.requests.flatMap(r =>
      r.items.map(it => `${it.chainId ?? 'ev'}-${it.stage}`)
    )
  );
  const usedCharIds = new Set(eventState.requests.map(r => r.characterId));

  const tutDone = eventState.tutorialStep >= TUTORIAL_STEPS.length;

  // アイテムの章番号を返す（1=Ch1, 2=Ch2, 3=Ch3, 4=Ch4）
  function getItemChapter(item) {
    if (item.chainId === SEIZO_CHAIN_ID)    return 2;
    if (item.chainId === KANTEITA_CHAIN_ID) return 3;
    if (item.chainId === KEIKAKU_CHAIN_ID)  return 4;
    return 1;
  }

  // アイテムリストに合った依頼人候補を返す
  // ・単一章アイテム → その章のキャラ優先
  // ・混在 / 同章キャラ枯渇 → 未完了章の全キャラ
  function getCharsForItems(items) {
    const chapters = [...new Set(items.map(getItemChapter))];

    if (chapters.length === 1) {
      const ch = chapters[0];
      const [minId, maxId] = ch === 1 ? [0, 5] : ch === 2 ? [6, 10] : ch === 3 ? [11, 17] : [18, 22];
      const singleCh = REQUESTERS.filter(r =>
        r.id >= minId && r.id <= maxId &&
        !usedCharIds.has(r.id) &&
        !(tutDone && r.id === 1)
      );
      if (singleCh.length > 0) return singleCh;
    }

    // 混在 or 同章キャラ枯渇 → 解放済み章・未完了章の全キャラ
    return REQUESTERS.filter(r => {
      if (r.id <= 5)  return true; // Ch1
      if (r.id <= 10) return !!eventState.fireGenUnlocked;
      if (r.id <= 17) return !!eventState.kanteGenUnlocked;
      return !!eventState.keikakuGenUnlocked;
    }).filter(r =>
      !usedCharIds.has(r.id) &&
      !(tutDone && r.id === 1)
    );
  }

  // ランダムなステージキーを1つ選ぶ内部ヘルパー
  // superRelaxed=true のみ recentlySolvedKeys を無視（選択肢が本当にゼロの超緊急時）
  // completedLowStages は常に尊重（永久封印）
  function pickRandomItem(excludeKeys, superRelaxed = false) {
    for (let t = 0; t < 50; t++) {
      let item;

      // 解放済みプールを均等抽選
      const pools = [];
      if (!ch1StoryDone) pools.push('ch1');
      if (seizoAvailable)   pools.push('ch2');
      if (kanteAvailable)   pools.push('ch3');
      if (keikakuAvailable) pools.push('ch4');
      if (pools.length === 0) return null;
      const pool = pools[Math.floor(Math.random() * pools.length)];

      if (pool === 'ch2') {
        const stage = Math.floor(Math.random() * ch2StageMax) + 1;
        item = { chainId: SEIZO_CHAIN_ID, stage };
      } else if (pool === 'ch3') {
        const stage = Math.floor(Math.random() * ch3StageMax) + 1;
        item = { chainId: KANTEITA_CHAIN_ID, stage };
      } else if (pool === 'ch4') {
        const stage = Math.floor(Math.random() * ch4StageMax) + 1;
        item = { chainId: KEIKAKU_CHAIN_ID, stage };
      } else {
        // Ch1
        if (ch1StageMin > ch1StageMax) continue;
        const stage = Math.floor(Math.random() * (ch1StageMax - ch1StageMin + 1)) + ch1StageMin;
        item = { stage };
      }

      const key = item.chainId !== undefined ? `${item.chainId}-${item.stage}` : `ev-${item.stage}`;
      if (excludeKeys.has(key)) continue;
      // Ch1のみLv1-2をチュートリアル後は除外（Ch2・Ch3は序盤Lvも許可）
      if (!item.chainId && item.stage <= 2 && tutDone) continue;
      if (eventState.completedLowStages.has(key)) continue; // 常に尊重（永久封印）
      if (!superRelaxed && eventState.recentlySolvedKeys.has(key)) continue; // クールダウン中はスキップ
      return { item, key };
    }
    return null;
  }

  let retry = 0;
  while (eventState.requests.length < MAX_SLOTS && retry < 40) {
    const result1 = pickRandomItem(usedStageKeys);
    if (!result1) { retry++; continue; }
    const { item: reqItem1, key: key1 } = result1;

    const items = [reqItem1];
    let totalCoin = calcCoinReward(reqItem1.stage);

    // Lv4以上かつ50%で2個依頼
    if (reqItem1.stage >= 4 && Math.random() < 0.5) {
      const exclude2 = new Set([...usedStageKeys, key1]);
      const result2 = pickRandomItem(exclude2);
      if (result2 && result2.item.stage !== reqItem1.stage) {
        items.push(result2.item);
        totalCoin += calcCoinReward(result2.item.stage);
        usedStageKeys.add(result2.key);
        // 2個依頼は合計×2/3（端数切捨て・10の位丸め）
        totalCoin = Math.floor(totalCoin * 2 / 3 / 10) * 10;
      }
    }

    // アイテムの章に合った依頼人を選択
    const chars = getCharsForItems(items);
    if (chars.length === 0) { retry++; continue; }
    const char = chars[Math.floor(Math.random() * chars.length)];
    eventState.requests.push({ characterId: char.id, items, coin: totalCoin });
    usedStageKeys.add(key1);
    usedCharIds.add(char.id);
    retry = 0;
  }

  // 最低 MIN_SLOTS 枠を保証（2段階フォールバック）
  // フェーズ1: クールダウンを尊重したまま補充
  if (eventState.requests.length < MIN_SLOTS) {
    let fallbackRetry = 0;
    while (eventState.requests.length < MIN_SLOTS && fallbackRetry < 30) {
      const result1 = pickRandomItem(usedStageKeys); // クールダウン尊重
      if (!result1) { fallbackRetry++; continue; }
      const { item: reqItem1, key: key1 } = result1;
      const chars = getCharsForItems([reqItem1]);
      if (chars.length === 0) { fallbackRetry++; continue; }
      const char = chars[Math.floor(Math.random() * chars.length)];
      eventState.requests.push({
        characterId: char.id,
        items: [reqItem1],
        coin: calcCoinReward(reqItem1.stage),
      });
      usedStageKeys.add(key1);
      usedCharIds.add(char.id);
      fallbackRetry = 0;
    }
  }
  // フェーズ2（廃止）: superRelaxed でクールダウン無視すると同じアイテムが即再登場するため削除。
  // クールダウン中で選択肢が少ない場合は MIN_SLOTS を下回ってよい。
  // 別の依頼が1件解決されるとクールダウンが解除され自然に補充される。
}

function renderEventRequest() {
  const panel = document.getElementById('event-req-panel');
  if (!panel) return;
  panel.innerHTML = '';

  const step = currentTutStep();

  // チュートリアル依頼（showRequest フラグ or request_focus フェーズ）
  if (step && (step.showRequest || step.type === 'request_focus')) {
    const hasLv2      = eventState.board.some(c => c && !c.isFog && !c.isEventGen && c.stage === 2);
    const completable = hasLv2 && step.type === 'request_focus';
    const emoji       = EVENT_CHAIN.stages[1];
    const badgeImgSrc = EVENT_CHAIN.stageImages?.[1];
    const badgeIcon   = badgeImgSrc
      ? `<img class="req-item-img" src="${badgeImgSrc}" alt="${emoji}">`
      : emoji;

    const div = document.createElement('div');
    div.className = 'request-slot' + (completable ? ' completable' : '');
    div.innerHTML = `
      <div class="req-char-wrap">
        <img class="req-char-img" src="img/Chapter1/Chara/image_merge_order_chara_01.png" alt="依頼人">
      </div>
      <div class="req-slot-frame">
        <div class="req-items">
          <span class="req-item-badge">${badgeIcon}</span>
        </div>
        <div class="req-coin-row">
          <span class="req-coin">${COIN_ICON}100</span>
          ${completable ? `<button class="req-complete-btn">依頼解決</button>` : ''}
        </div>
      </div>
    `;
    if (completable) {
      div.querySelector('.req-complete-btn').addEventListener('click', e => {
        e.stopPropagation();
        completeTutorialRequest();
      });
    }
    panel.appendChild(div);
    return;
  }

  // チュートリアル中（依頼不要なステップ）は空表示
  if (!isTutorialComplete()) return;

  // チュートリアル完了後：eventState.requests を表示
  const { reqHighlights } = calcMatchHighlights();
  eventState.requests.forEach((req, i) => {
    const character   = REQUESTERS[req.characterId];
    const completable = eventRequestCompletable(req);
    const perItem     = reqHighlights.get(i) || req.items.map(() => 'none');

    const itemsHtml = req.items.map((reqItem, ii) => {
      // chainId あり → メインチェーン画像、なし → EVENT_CHAIN 画像
      let emoji, imgSrc;
      if (reqItem.chainId !== undefined) {
        const chain = CHAINS[reqItem.chainId];
        emoji  = chain.stages[reqItem.stage - 1] || '❓';
        imgSrc = chain.stageImages?.[reqItem.stage - 1];
      } else {
        emoji  = EVENT_CHAIN.stages[reqItem.stage - 1] || '❓';
        imgSrc = EVENT_CHAIN.stageImages?.[reqItem.stage - 1];
      }
      const icon = imgSrc
        ? `<img class="req-item-img" src="${imgSrc}" alt="${emoji}">`
        : emoji;
      const hl = perItem[ii];
      const hlClass = hl === 'full' ? ' req-match-full' : hl === 'partial' ? ' req-match-partial' : '';
      return `<span class="req-item-badge${hlClass}">${icon}</span>`;
    }).join('');

    // charImg が直接指定されている場合（最初の依頼など）を優先
    const charHtml = req.charImg
      ? `<img class="req-char-img" src="${req.charImg}" alt="依頼人">`
      : (character?.img
        ? `<img class="req-char-img" src="${character.img}" alt="${character.name}">`
        : `<div class="req-char-figure">${character?.emoji || '👤'}</div>`);

    const div = document.createElement('div');
    div.className = 'request-slot' + (completable ? ' completable' : '');
    div.innerHTML = `
      <div class="req-char-wrap">${charHtml}</div>
      <div class="req-slot-frame">
        <div class="req-items">${itemsHtml}</div>
        <div class="req-coin-row">
          <span class="req-coin">${COIN_ICON}${req.coin.toLocaleString()}</span>
          ${completable ? `<button class="req-complete-btn">依頼解決</button>` : ''}
        </div>
      </div>
    `;
    if (completable) {
      div.querySelector('.req-complete-btn').addEventListener('click', e => {
        e.stopPropagation();
        completeEventRequest(i);
      });
    }
    panel.appendChild(div);
  });
}

// ========================================
// ========================================
// モバイル用ジェネレーター2タップシステム
// ========================================
// 統一ジェネレータータップハンドラー
// 1回目タップ → 選択、2回目タップ（選択中）→ アイテム生成
// チュートリアル中・マージ操作は別処理
// ========================================
function handleAnyGenTap(i) {
  const item = eventState.board[i];
  if (!item || !item.isEventGen) return;
  const isFireGen = item.isFireGen;

  // メインチュートリアル中（gen_focus）→ 選択なしで直接生成
  const step = currentTutStep();
  if (step) {
    if (!isFireGen) onEventGenTap(i);
    return;
  }

  // ジェネレーターマージチュートリアル中（メモ帳のみ）
  if (!isFireGen && isGenMergeTutActive()) {
    if (eventState.selectedCell !== null && eventState.selectedCell !== i) {
      const selItem = eventState.board[eventState.selectedCell];
      if (selItem && selItem.isEventGen && !selItem.isFireGen &&
          (selItem.genLevel ?? 0) === (item.genLevel ?? 0)) {
        mergeEventGenerators(eventState.selectedCell, i);
        eventState.selectedCell = null;
        return;
      }
    }
    eventState.selectedCell = (eventState.selectedCell === i) ? null : i;
    renderEventBoard();
    return;
  }

  // 他のジェネレーターが選択中 → マージ判定
  if (eventState.selectedCell !== null && eventState.selectedCell !== i) {
    const selItem = eventState.board[eventState.selectedCell];
    if (selItem && selItem.isEventGen) {
      if (!isFireGen && !selItem.isFireGen &&
          (selItem.genLevel ?? 0) === (item.genLevel ?? 0)) {
        mergeEventGenerators(eventState.selectedCell, i);
        eventState.selectedCell = null;
        return;
      }
      if (isFireGen && selItem.isFireGen &&
          (selItem.seizoLevel ?? 0) === (item.seizoLevel ?? 0)) {
        mergeFireGenerators(eventState.selectedCell, i);
        eventState.selectedCell = null;
        return;
      }
      if (item.isKanteGen && selItem.isKanteGen &&
          (selItem.kanteLevel ?? 0) === (item.kanteLevel ?? 0)) {
        mergeKanteGenerators(eventState.selectedCell, i);
        eventState.selectedCell = null;
        return;
      }
      if (item.isKeikakuGen && selItem.isKeikakuGen &&
          (selItem.keikakuLevel ?? 0) === (item.keikakuLevel ?? 0)) {
        mergeKeikakuGenerators(eventState.selectedCell, i);
        eventState.selectedCell = null;
        return;
      }
    }
    // 種類違い or レベル違いなら選択切替
    eventState.selectedCell = i;
    if (isFireGen)              showNaviHintForFireGen(item, true);
    else if (item.isKanteGen)   showNaviHintForKanteGen(item, true);
    else if (item.isKeikakuGen) showNaviHintForKeikakuGen(item, true);
    else                        showNaviHintForGen(item.genLevel ?? 0, true);
    renderEventBoard();
    return;
  }

  // 2タップ：選択中→生成（選択・ナビヒント維持） / 未選択→選択
  if (eventState.selectedCell === i) {
    // 選択はそのまま・ナビヒントも維持して生成
    if (isFireGen)              onEventFireGenTap(i);
    else if (item.isKanteGen)   onEventKanteGenTap(i);
    else if (item.isKeikakuGen) onEventKeikakuGenTap(i);
    else                        onEventGenTap(i);
  } else {
    eventState.selectedCell = i;
    if (isFireGen)              showNaviHintForFireGen(item, true);
    else if (item.isKanteGen)   showNaviHintForKanteGen(item, true);
    else if (item.isKeikakuGen) showNaviHintForKeikakuGen(item, true);
    else                        showNaviHintForGen(item.genLevel ?? 0, true);
    renderEventBoard();
  }
}

// 後方互換ラッパー
function handleGenTapMobile(i)     { handleAnyGenTap(i); }
function handleFireGenTapMobile(i) { handleAnyGenTap(i); }

// ジェネレータータップ
// ジェネレーターセルから最も近い空きセルを返す（Manhattanデイスタンス）
function findNearestEmptyEventCell(fromIdx) {
  const COLS = 7;
  const fromRow = Math.floor(fromIdx / COLS);
  const fromCol = fromIdx % COLS;
  let bestIdx = -1;
  let bestDist = Infinity;
  eventState.board.forEach((cell, i) => {
    if (cell !== null) return;
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const dist = Math.abs(row - fromRow) + Math.abs(col - fromCol);
    if (dist < bestDist) { bestDist = dist; bestIdx = i; }
  });
  return bestIdx;
}

// ========================================
// tappedCellIdx: タップされたジェネレーターセルのインデックス（アニメーション始点）
function onEventGenTap(tappedCellIdx = null) {
  const step = currentTutStep();

  // チュートリアル中: gen_focusフェーズのみ許可
  if (step && step.type !== 'gen_focus') return;
  if (step && eventState.tutorialGenTaps >= 2) return;

  // チュートリアル中は powerLevel 0 固定、通常時はプレイヤー選択の genPowerLevel を使用
  const powerLv    = step ? 0 : eventState.genPowerLevel;
  const cfg        = POWER_CONFIG[powerLv] ?? POWER_CONFIG[0];
  const outStage   = cfg.startStage;
  const energyCost = POWER_COSTS[powerLv] ?? 1;

  // チュートリアル中は Lv1 固定・体力消費 1
  const baseCost = step ? 1 : energyCost;
  if (!debugState.infiniteEnergy && state.energy < baseCost) {
    if (!eventState.energyTutShown && !isDebugModeActive()) {
      eventState.energyTutShown = true;
      startGuide([
        'スタミナが不足すると、マージアイテムは出ません。時間が経過するとスタミナは少しずつ回復します。早く回復したい場合は、ショップで購入するか、ある条件を満たすと回復することもできます。'
      ], '#ev-energy', null);
    } else {
      const errIdx = tappedCellIdx ?? eventState.board.findIndex(c => c && c.isEventGen && !c.isFireGen && !c.isKanteGen);
      showSpecialOnCell(errIdx, 'event-board', `${HP_ICON}が不足しています（必要：${HP_ICON}${baseCost}）`, '#e74c3c');
    }
    return;
  }

  // アニメーション始点: タップされたセル（不明なら最初のジェネレーターセル）
  const animFrom = tappedCellIdx !== null
    ? tappedCellIdx
    : eventState.board.findIndex(c => c && c.isEventGen && !c.isFireGen);

  const emptyIdx = animFrom !== -1 ? findNearestEmptyEventCell(animFrom) : eventState.board.findIndex(c => c === null);
  if (emptyIdx === -1) { showBoardFullToast(animFrom !== -1 ? animFrom : null, true); return; }

  // Power → Lucky の順で判定（チュートリアル中はスキップ）
  let finalStage = step ? 1 : outStage;
  let isLucky = false, isPower = false;
  if (!step) {
    const evMaxStage = EVENT_CHAIN.stages.length;
    const powerStage = rollPower(powerLv, evMaxStage);
    if (powerStage !== null) {
      finalStage = powerStage;
      isPower = true;
    } else if (outStage >= 2) { // Lv1出力時はLucky不可
      const luckyMult = rollLucky(powerLv);
      if (luckyMult !== null) {
        const ls = Math.min(Math.floor(outStage * luckyMult), evMaxStage);
        if (ls > outStage) { finalStage = ls; isLucky = true; }
      }
    }
  }

  if (!debugState.infiniteEnergy) state.energy -= baseCost;
  eventState.board[emptyIdx] = { stage: finalStage };
  discoverEventItem(finalStage);

  // アイテム飛び出しアニメーション
  const stageContent = EVENT_CHAIN.stageImages?.[finalStage - 1] || EVENT_CHAIN.stages[finalStage - 1];
  const genShowIdx = animFrom !== -1 ? animFrom : emptyIdx;
  flyEventItemAnimation(genShowIdx, emptyIdx, stageContent);
  if (isPower) showPowerOnCell(genShowIdx, 'event-board');
  else if (isLucky) showLuckyOnCell(genShowIdx, 'event-board');

  if (step && step.type === 'gen_focus') {
    eventState.tutorialGenTaps++;
    if (eventState.tutorialGenTaps >= 2) {
      setTimeout(() => advanceTutorial(), 450);
    }
  }

  renderEventHeader();
  renderEventBoard();
  renderEventRequest();
}

// イベントボード専用：アイテム飛び出しアニメーション
function flyEventItemAnimation(fromIdx, toIdx, emoji) {
  const cells    = document.querySelectorAll('#event-board .cell');
  const fromCell = cells[fromIdx];
  const toCell   = cells[toIdx];
  if (!fromCell || !toCell) return;

  const fromRect = fromCell.getBoundingClientRect();
  const toRect   = toCell.getBoundingClientRect();

  const startX = fromRect.left + fromRect.width  / 2;
  const startY = fromRect.top  + fromRect.height / 2;
  const endX   = toRect.left   + toRect.width    / 2;
  const endY   = toRect.top    + toRect.height   / 2;

  const dist      = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
  const arcHeight = Math.max(40, dist * 0.45);
  const cpX = (startX + endX) / 2;
  const cpY = (startY + endY) / 2 - arcHeight;

  const el = document.createElement('div');
  const isImg = typeof emoji === 'string' && emoji.startsWith('img/');
  if (isImg) {
    const img = document.createElement('img');
    img.src = emoji;
    img.style.cssText = 'width:52px;height:52px;object-fit:contain;display:block;';
    el.appendChild(img);
  } else {
    el.textContent = emoji;
  }
  el.style.cssText = `
    position: fixed;
    left: 0; top: 0;
    font-size: ${isImg ? '0' : '28px'};
    line-height: 1;
    pointer-events: none;
    z-index: 200;
    opacity: 0;
    will-change: transform, opacity;
  `;
  document.body.appendChild(el);

  const DURATION = 350;
  const startTime = performance.now();

  function animate(now) {
    const raw = Math.min((now - startTime) / DURATION, 1);

    const x = (1 - raw) * (1 - raw) * startX + 2 * (1 - raw) * raw * cpX + raw * raw * endX;
    const y = (1 - raw) * (1 - raw) * startY + 2 * (1 - raw) * raw * cpY + raw * raw * endY;

    const scale = raw < 0.4
      ? 0.5 + raw * 2.5
      : 1.5 - (raw - 0.4) * 1.2;

    const opacity = raw < 0.15
      ? raw / 0.15
      : raw > 0.75
        ? (1 - raw) / 0.25
        : 1;

    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
    el.style.opacity   = opacity;

    if (raw < 1) requestAnimationFrame(animate);
    else         el.remove();
  }

  requestAnimationFrame(animate);
}

// ========================================
// セルクリック
// ========================================
function onEventCellClick(index) {
  // ドラッグ直後のクリックイベント（タッチ→クリック二重発火）をブロック
  if (evDrag.tapHandled) { evDrag.tapHandled = false; return; }

  const item = eventState.board[index];

  // ジェネレーターマージ誘導チュートリアル中の制御
  if (isGenMergeTutActive()) {
    const gmStep = currentGenMergeTutStep();
    if (!gmStep) { /* 完了直後 */ }
    else if (gmStep.type === 'msg') {
      // メッセージ中はタップで次へ進める（オーバーレイタップも同様）
      advanceGenMergeTut();
      return;
    } else if (gmStep.type === 'focus') {
      // focus: 空白セルタップは無視
      if (!item) return;
      // ジェネレータータイル以外は操作不可
      if (!item.isEventGen || item.isFireGen) return;
      // ジェネレータータイルの選択・マージは通常ロジックに流す
    }
  }

  if (!item) {
    hideNaviHint();
    eventState.selectedCell = null;
    renderEventBoard();
    return;
  }

  if (item.isEventGen) {
    if (evDrag.tapHandled) { evDrag.tapHandled = false; return; }
    handleAnyGenTap(index);
    return;
  }

  // チュートリアル中: 霧アイテムは操作不可、merge_focus のみ通常アイテム操作許可
  const step = currentTutStep();
  if (step) {
    if (item.isFog) return; // 霧はチュートリアル中は触れない
    if (step.type !== 'merge_focus') return;
  }

  // 霧アイテムはタップ操作一切不可
  if (item.isFog) return;

  // しゃぼん玉アイテムのタップ → ダイヤボタン表示
  if (item.isBubble) {
    eventState.selectedCell = index;
    showNaviHintForBubble(item);
    renderEventBoard();
    return;
  }

  // コインアイテムのタップ / ダブルタップ
  if (item.isCoin) {
    const now = Date.now();
    if (now - lastCoinTapTime < 400 && lastCoinTapIdx === index) {
      // ダブルタップ: コイン獲得してアイテム消去
      const reward = COIN_REWARD[item.coinLv ?? 1] ?? 0;
      state.coin += reward;
      eventState.board[index] = null;
      eventState.selectedCell = null;
      hideNaviHint();
      showToast(`${COIN_ICON} +${reward}`);
      renderEventBoard();
      renderEventHeader();
      lastCoinTapTime = 0; lastCoinTapIdx = -1;
      return;
    }
    lastCoinTapTime = now; lastCoinTapIdx = index;
    // シングルタップ: 選択 + ナビヒント
    if (eventState.selectedCell !== null && eventState.selectedCell !== index) {
      const sel = eventState.board[eventState.selectedCell];
      if (sel && evItemCanMerge(sel, item)) {
        doEventMerge(eventState.selectedCell, index);
        return;
      }
    }
    eventState.selectedCell = index;
    showNaviHintForCoin(item);
    renderEventBoard();
    return;
  }

  if (eventState.selectedCell !== null && eventState.selectedCell !== index) {
    const sel = eventState.board[eventState.selectedCell];
    if (sel && evItemCanMerge(sel, item)) {
      doEventMerge(eventState.selectedCell, index);
      return;
    }
    // 別アイテムへ選択切替 + ナビヒント更新
    eventState.selectedCell = index;
    if (!item.isFog) showNaviHintForItem(item, true);
    renderEventBoard();
    return;
  }

  if (eventState.selectedCell === index) {
    // 同じアイテムをタップ → 選択・ナビヒント維持（ジェネレーターと同仕様）
    return;
  }

  // 新しいアイテムを選択 + ナビヒント表示
  eventState.selectedCell = index;
  if (!item.isFog) showNaviHintForItem(item, true);
  renderEventBoard();
}

// チュートリアル依頼解決
function completeTutorialRequest() {
  const idx = eventState.board.findIndex(c => c && !c.isFog && !c.isEventGen && c.stage === 2);
  if (idx === -1) { showToast('アイテムがありません'); return; }
  eventState.board[idx] = null;
  state.coin += 100;
  showToastNearPanel(`依頼完了！ ${COIN_ICON}+100`, document.getElementById('event-req-panel'));
  renderEventHeader();
  renderEventBoard();
  advanceTutorial();
}

// 霧セルがマージされた後、隣接する霧セルをアンロック
function unlockAdjacentFogCells(idx) {
  const col = idx % EVENT_COLS;
  const candidates = [];
  if (idx >= EVENT_COLS)              candidates.push(idx - EVENT_COLS); // 上
  if (idx < EVENT_TOTAL - EVENT_COLS) candidates.push(idx + EVENT_COLS); // 下
  if (col > 0)                        candidates.push(idx - 1);           // 左
  if (col < EVENT_COLS - 1)           candidates.push(idx + 1);           // 右
  for (const n of candidates) {
    if (eventState.board[n] && eventState.board[n].isFog) {
      eventState.unlockedFogCells.add(n);
    }
  }
}

// マージ処理（共通）
function doEventMerge(fromIdx, toIdx) {
  const fromItem = eventState.board[fromIdx];
  const toItem   = eventState.board[toIdx];

  // ── コインマージの特別処理 ──
  if (fromItem.isCoin && toItem?.isCoin) {
    const newLv = Math.min((fromItem.coinLv ?? 1) + 1, COIN_MAX_LV);
    eventState.board[toIdx]   = { isCoin: true, coinLv: newLv };
    eventState.board[fromIdx] = null;
    eventState.selectedCell   = null;
    hideNaviHint();
    renderEventBoard();
    triggerMergeAnim('#event-board', toIdx);
    return;
  }

  // chainId 継承（片方が霧アイテムでも chainId は引き継ぐ）
  // 霧アイテムは chainId なし（EVENT_CHAIN）、炎アイテムは chainId:0
  const chainId = fromItem.chainId ?? toItem?.chainId;

  const nextStage = fromItem.stage + 1;
  const maxStage  = chainId !== undefined ? CHAINS[chainId].stages.length : EVENT_CHAIN.stages.length;

  if (nextStage > maxStage) {
    showToast('最大レベルです');
    eventState.selectedCell = null;
    renderEventBoard();
    return;
  }

  // 結果アイテム（霧フラグなし＝通常アイテム）
  const toWasFog = !!toItem?.isFog;
  const tutStepNow = currentTutStep();
  // 第一章Lv1はアップもしゃぼん玉もしない
  const isLv1Ch1 = chainId === undefined && nextStage === 1;

  // マージ結果は常に nextStage（ランダムボーナスなし）
  let finalStage = nextStage;

  eventState.board[toIdx]   = chainId !== undefined ? { chainId, stage: finalStage } : { stage: finalStage };
  eventState.board[fromIdx] = null;
  eventState.selectedCell   = null;
  // 霧セルがマージされたら隣接霧セルをアンロック
  if (toWasFog) unlockAdjacentFogCells(toIdx);

  if (chainId === undefined) {
    discoverEventItem(finalStage);
    if (finalStage !== nextStage) discoverEventItem(nextStage);

    // Lv4（スニーカー）初回到達でジェネレーター2枚目タイルを自動出現（第一章Lv2）
    // Lv8（カメラ）初回到達 or Scene8終了でLv3タイルを自動出現（progressStory参照）
    // Lv4タイル（ch1lv4）は第一章Scene12終了時（progressStory参照）
    if (nextStage === 4 && !eventState.genUpTriggered.has(4)) {
      eventState.genUpTriggered.add(4);
      const genTileCount = eventState.board.filter(c => c && c.isEventGen && !c.isFireGen).length;
      if (genTileCount < 2) {
        const curGenLv  = eventState.board.find(c => c && c.isEventGen && !c.isFireGen)?.genLevel ?? 0;
        const emptyIdx2 = eventState.board.findIndex(c => c === null);
        if (emptyIdx2 !== -1) {
          eventState.board[emptyIdx2] = { isEventGen: true, genLevel: curGenLv };
          hideNaviHint();
          setTimeout(() => startGenMergeTut(), 400);
        }
      }
    }

    // Lv8（カメラ）初回到達でジェネレーター2枚目タイルを自動出現（第一章Lv3）
    // ※ 第一章Scene8終了時にも同様に出現（progressStory参照）
    if (nextStage === 8 && !eventState.genUpTriggered.has('ch1lv3')) {
      eventState.genUpTriggered.add('ch1lv3');
      const genTileCount = eventState.board.filter(c => c && c.isEventGen && !c.isFireGen).length;
      if (genTileCount < 2) {
        const curGenLv  = eventState.board.find(c => c && c.isEventGen && !c.isFireGen)?.genLevel ?? 0;
        const emptyIdx2 = eventState.board.findIndex(c => c === null);
        if (emptyIdx2 !== -1) {
          eventState.board[emptyIdx2] = { isEventGen: true, genLevel: curGenLv };
          showToast('ジェネレーターが2枚出現！重ねてLvアップ！');
        }
      }
    }

    // ※ 第二章ジェネレーター解放は第一章 scene09 到達時に行う（progressStory 参照）
  }

  // 製造機アイテム（第二章）の発見トラッキングとLvアップ判定
  if (chainId === SEIZO_CHAIN_ID) {
    discoverSeizoItem(finalStage);
  } else if (chainId === KANTEITA_CHAIN_ID) {
    discoverKanteItem(finalStage);
  } else if (chainId === KEIKAKU_CHAIN_ID) {
    discoverKeikakuItem(finalStage);
  }

  // 5%の確率でしゃぼん玉アイテムを追加出現（Lv1/チュートリアル/霧マージは除外）
  const bubbleProb = 0.05;
  if (!tutStepNow && !isGenMergeTutActive() && !toWasFog && !isLv1Ch1 && Math.random() < bubbleProb) {
    const bubbleSlot = findNearestEmptyEventCell(toIdx);
    if (bubbleSlot !== -1) {
      eventState.board[bubbleSlot] = chainId !== undefined
        ? { chainId, stage: finalStage, isBubble: true, isNewBubble: true, bubbleTimestamp: Date.now() }
        : { stage: finalStage, isBubble: true, isNewBubble: true, bubbleTimestamp: Date.now() };

      // しゃぼん玉チュートリアルナビ（初回のみ・デバッグモード以外）
      if (!eventState.bubbleTutShown && !isDebugModeActive()) {
        eventState.bubbleTutShown = true;
        const slot = bubbleSlot;
        setTimeout(() => {
          const cells = document.querySelectorAll('#event-board .cell');
          const cell = cells[slot];
          if (cell) {
            cell.classList.add('bubble-tut-target');
            startGuide([
              'しゃぼん玉のアイテムはマージできません。時間が経過するとコインになります。アイテムを欲しい場合は、ダイヤを消費してしゃぼん玉を割ってください。'
            ], '.bubble-tut-target', () => {
              cell.classList.remove('bubble-tut-target');
            });
          }
        }, 200);
      }
    }
  }

  const step = currentTutStep();
  if (step && step.type === 'merge_focus') {
    setTimeout(() => advanceTutorial(), 500);
  }

  trackDailyMerge();

  renderEventBoard();
  renderEventGenerators();
  renderEventRequest();
  triggerMergeAnim('#event-board', toIdx);
}

// ========================================
// イベントジェネレーターパネル描画
// ========================================
function renderEventGenerators() {
  const container = document.getElementById('event-generators');
  if (!container) return;
  container.innerHTML = '';
  // 現在はボード上のタイルマージでLvアップする方式のため、パネルは空で問題なし
}

// ========================================
// イベントジェネレータータイルのマージ（Lvアップ）
// ========================================
function mergeEventGenerators(fromIdx, toIdx) {
  const toItem  = eventState.board[toIdx];
  const newLevel = (toItem.genLevel ?? 0) + 1;
  eventState.board[toIdx]   = { isEventGen: true, genLevel: newLevel };
  eventState.board[fromIdx] = null;
  eventState.selectedCell   = null;
  discoverGen('ch1', newLevel); // Lvアップで新レベルを発見
  const ch1GenName = EVENT_GEN_NAMES[Math.min(newLevel, EVENT_GEN_NAMES.length - 1)];
  showSpecialOnCell(toIdx, 'event-board', `${ch1GenName} Lv${newLevel + 1}！`, '#f9c846');
  trackDailyMerge();
  state.energy += 25; renderHeader();
  showAboveNaviToast(`${HP_ICON} +25 ジェネレーターLvアップボーナス！`);
  // Lvアップ時に出力Lvを自動で新しい最大値に設定
  eventState.genPowerLevel = getGenMaxAvailablePowerLv(newLevel);
  // ジェネレーターマージ誘導チュートリアルのフォーカスステップを完了
  if (eventState.genMergeTutStep === 0) {
    setTimeout(() => advanceGenMergeTut(), 400);
  }

  // Lvアップで依頼ステージ上限が上がるので再補充
  fillEventRequests();
  renderEventBoard();
  renderEventGenerators();
  renderEventRequest();
  renderEventHeader();
  triggerMergeAnim('#event-board', toIdx);
}

// 製造機ジェネレーター解放（メモ帳アイテムLv8到達時）
function unlockFireGenerator() {
  eventState.fireGenUnlocked = true;
  eventState.seizoGenLevel   = 0; // Lv1からスタート
  const emptyIdx = eventState.board.findIndex(c => c === null);
  if (emptyIdx === -1) { showToast('ボードが満杯で第二章ジェネレーターを配置できません'); return; }
  eventState.board[emptyIdx] = { isEventGen: true, isFireGen: true, seizoLevel: 0 };
  discoverGen('ch2', 0); // Lv1 を発見
  showToast('第二章ジェネレーター解放！');
  renderEventBoard();
  renderEventRequest();
}

// 鑑定台ジェネレーター解放（第二章ストーリー完了時）
function unlockKanteGenerator() {
  eventState.kanteGenUnlocked = true;
  eventState.kanteGenLevel    = 0; // Lv1からスタート
  const emptyIdx = eventState.board.findIndex(c => c === null);
  if (emptyIdx === -1) { showToast('ボードが満杯で第三章ジェネレーターを配置できません'); return; }
  eventState.board[emptyIdx] = { isEventGen: true, isKanteGen: true, kanteLevel: 0 };
  discoverGen('ch3', 0); // Lv1 を発見
  showToast('第三章ジェネレーター解放！');
  renderEventBoard();
  renderEventRequest();
}

// ========================================
// 章ジェネレーター LvUp タイル出現ヘルパー（シーン話数ベース）
// chapter: 2=製造機 / 3=鑑定台 / 4=設計台
// triggerKey: シーン話数（5/7/9/11/13）
// triggeredSet: 重複防止用 Set（eventState.seizoLvTriggered 等）
// ========================================
function _spawnChGenLvUpTile(chapter, triggerKey, triggeredSet) {
  let existingIdx, newTile, chName;
  if (chapter === 2) {
    existingIdx = eventState.board.findIndex(c => c && c.isFireGen);
    if (existingIdx === -1) return;
    const lv = eventState.board[existingIdx].seizoLevel ?? 0;
    newTile  = { isEventGen: true, isFireGen: true, seizoLevel: lv };
    chName   = '第二章';
  } else if (chapter === 3) {
    existingIdx = eventState.board.findIndex(c => c && c.isKanteGen);
    if (existingIdx === -1) return;
    const lv = eventState.board[existingIdx].kanteLevel ?? 0;
    newTile  = { isEventGen: true, isKanteGen: true, kanteLevel: lv };
    chName   = '第三章';
  } else if (chapter === 4) {
    existingIdx = eventState.board.findIndex(c => c && c.isKeikakuGen);
    if (existingIdx === -1) return;
    const lv = eventState.board[existingIdx].keikakuLevel ?? 0;
    newTile  = { isEventGen: true, isKeikakuGen: true, keikakuLevel: lv };
    chName   = '第四章';
  } else { return; }

  const emptyIdx = findNearestEmptyEventCell(existingIdx);
  if (emptyIdx === -1) { showBoardFullToast(existingIdx, true); return; }
  eventState.board[emptyIdx] = newTile;
  triggeredSet.add(triggerKey);
  eventState.pendingGenLvUpNotice.push({
    idx: emptyIdx,
    msg: `${chName}ジェネレータータイルが増えた！\nマージしてLvアップ！`,
  });
  showToast(`${chName}ジェネレータータイルが増えた！マージしてLvアップ！`);
  renderEventBoard();
}

// 製造機ジェネレーターLvアップ判定：プレイヤーLvベース（旧ロジック・未使用）
// ※ シーン話数ベースに移行済み。関数は互換のため残存。
const SEIZO_GEN_PLAYERLV_TRIGGERS = new Set([4, 6, 8, 10, 12, 14]);
function checkSeizoGenLevelUpByPlayerLevel(playerLevel) {
  if (!SEIZO_GEN_PLAYERLV_TRIGGERS.has(playerLevel)) return;
  if (!eventState.fireGenUnlocked) return;
  if (eventState.seizoLvTriggered.has(playerLevel)) return;
  const existingIdx = eventState.board.findIndex(c => c && c.isFireGen);
  if (existingIdx === -1) return;
  const currentLv = eventState.board[existingIdx].seizoLevel ?? 0;
  const emptyIdx = findNearestEmptyEventCell(existingIdx);
  if (emptyIdx === -1) { showBoardFullToast(existingIdx, true); return; }
  eventState.board[emptyIdx] = { isEventGen: true, isFireGen: true, seizoLevel: currentLv };
  eventState.seizoLvTriggered.add(playerLevel);
  eventState.pendingGenLvUpNotice.push({ idx: emptyIdx, msg: '第二章ジェネレータータイルが増えた！\nマージしてLvアップ！' });
  showToast('第二章ジェネレータータイルが増えた！マージしてLvアップ！');
  renderEventBoard();
}

// 鑑定台ジェネレーターLvアップ判定：プレイヤーLvベース（旧ロジック・未使用）
// ※ シーン話数ベースに移行済み（progressStory 内 _spawnChGenLvUpTile 参照）
const KANTE_GEN_PLAYERLV_TRIGGERS = new Set([8, 10, 12, 14, 16, 18]);
function checkKanteGenLevelUpByPlayerLevel(playerLevel) {
  if (!KANTE_GEN_PLAYERLV_TRIGGERS.has(playerLevel)) return;
  if (!eventState.kanteGenUnlocked) return;
  if (eventState.kanteLvTriggered.has(playerLevel)) return;
  const existingIdx = eventState.board.findIndex(c => c && c.isKanteGen);
  if (existingIdx === -1) return;
  const currentLv = eventState.board[existingIdx].kanteLevel ?? 0;
  const emptyIdx = findNearestEmptyEventCell(existingIdx);
  if (emptyIdx === -1) { showBoardFullToast(existingIdx, true); return; }
  eventState.board[emptyIdx] = { isEventGen: true, isKanteGen: true, kanteLevel: currentLv };
  eventState.kanteLvTriggered.add(playerLevel);
  eventState.pendingGenLvUpNotice.push({ idx: emptyIdx, msg: '第三章ジェネレータータイルが増えた！\nマージしてLvアップ！' });
  showToast('第三章ジェネレータータイルが増えた！マージしてLvアップ！');
  renderEventBoard();
}

// 製造機ジェネレーターLvアップ判定（旧：アイテムStageベース・現在は未使用）
function checkSeizoGenLevelUp(discoveredStage) {
  for (const trig of SEIZO_GEN_LEVELUP_TRIGGERS) {
    if (discoveredStage === trig.triggerStage &&
        !eventState.seizoLvTriggered.has(trig.triggerStage)) {
      // 既存の製造機タイルを探す
      const existingIdx = eventState.board.findIndex(c => c && c.isFireGen);
      if (existingIdx === -1) break;
      const existingTile = eventState.board[existingIdx];
      const currentLv = existingTile.seizoLevel ?? 0;
      // 同Lvの複製タイルを近くに配置（マージして昇格させる）
      const emptyIdx = findNearestEmptyEventCell(existingIdx);
      if (emptyIdx === -1) { showBoardFullToast(existingIdx, true); break; }
      eventState.board[emptyIdx] = { isEventGen: true, isFireGen: true, seizoLevel: currentLv };
      eventState.seizoLvTriggered.add(trig.triggerStage);
      showToast('第二章ジェネレータータイルが増えた！マージしてLvアップ！');
      renderEventBoard();
      break;
    }
  }
}

// ========================================
// 製造機ジェネレータータイル同士のマージ（Lvアップ）
// ========================================
function mergeFireGenerators(fromIdx, toIdx) {
  const toItem   = eventState.board[toIdx];
  const newLevel = (toItem.seizoLevel ?? 0) + 1;
  const maxLevel = SEIZO_GEN_IMAGES.length - 1;
  if (newLevel > maxLevel) { showToast('第二章ジェネレーターは最大レベルです'); return; }
  eventState.board[toIdx]   = { isEventGen: true, isFireGen: true, seizoLevel: newLevel };
  eventState.board[fromIdx] = null;
  eventState.selectedCell   = null;
  // グローバルレベルも最高値に更新
  eventState.seizoGenLevel = Math.max(eventState.seizoGenLevel, newLevel);
  discoverGen('ch2', newLevel); // Lvアップで新レベルを発見
  const ch2GenName = SEIZO_GEN_NAMES[Math.min(newLevel, SEIZO_GEN_NAMES.length - 1)];
  showSpecialOnCell(toIdx, 'event-board', `${ch2GenName} Lv${newLevel + 1}！`, '#f9c846');
  trackDailyMerge();
  addEnergy(25, '第二章ジェネレーターLvアップボーナス！');
  // Lvアップ時に出力Lvを自動で新しい最大値に設定
  eventState.firePowerLevel = getFireGenMaxAvailablePowerLv(newLevel);

  fillEventRequests();
  renderEventBoard();
  renderEventRequest();
  renderEventHeader();
  triggerMergeAnim('#event-board', toIdx);
}

// 鑑定台ジェネレータータイル同士のマージ（Lvアップ）
function mergeKanteGenerators(fromIdx, toIdx) {
  const toItem   = eventState.board[toIdx];
  const newLevel = (toItem.kanteLevel ?? 0) + 1;
  const maxLevel = KANTEITA_GEN_IMAGES.length - 1;
  if (newLevel > maxLevel) { showToast('第三章ジェネレーターは最大レベルです'); return; }
  eventState.board[toIdx]   = { isEventGen: true, isKanteGen: true, kanteLevel: newLevel };
  eventState.board[fromIdx] = null;
  eventState.selectedCell   = null;
  eventState.kanteGenLevel  = Math.max(eventState.kanteGenLevel, newLevel);
  discoverGen('ch3', newLevel);
  const name = KANTEITA_GEN_NAMES[Math.min(newLevel, KANTEITA_GEN_NAMES.length - 1)];
  showSpecialOnCell(toIdx, 'event-board', `${name} Lv${newLevel + 1}！`, '#f9c846');
  trackDailyMerge();
  addEnergy(25, '第三章ジェネレーターLvアップボーナス！');

  fillEventRequests();
  renderEventBoard();
  renderEventRequest();
  renderEventHeader();
  triggerMergeAnim('#event-board', toIdx);
}

// 製造機ジェネレータータップ（tappedCellIdx: タップされたセルのインデックス）
function onEventFireGenTap(tappedCellIdx = null) {
  // firePowerLevel に応じた出力設定
  const powerLv    = eventState.firePowerLevel;
  const cfg        = FIRE_POWER_CONFIG[powerLv] ?? FIRE_POWER_CONFIG[0];
  const outStage   = cfg.outStage;
  const energyCost = POWER_COSTS[powerLv] ?? 1;

  if (!debugState.infiniteEnergy && state.energy < energyCost) {
    if (!eventState.energyTutShown && !isDebugModeActive()) {
      eventState.energyTutShown = true;
      startGuide([
        'スタミナが不足すると、マージアイテムは出ません。時間が経過するとスタミナは少しずつ回復します。早く回復したい場合は、ショップで購入するか、ある条件を満たすと回復することもできます。'
      ], '#ev-energy', null);
    } else {
      const errIdx = tappedCellIdx ?? eventState.board.findIndex(c => c && c.isFireGen);
      showSpecialOnCell(errIdx, 'event-board', `${HP_ICON}が不足しています（必要：${HP_ICON}${energyCost}）`, '#e74c3c');
    }
    return;
  }

  // 空きセル確認
  if (eventState.board.every(c => c !== null)) {
    const fireGenIdx = tappedCellIdx !== null ? tappedCellIdx : eventState.board.findIndex(c => c && c.isEventGen && c.isFireGen);
    showBoardFullToast(fireGenIdx, true);
    return;
  }

  const animFrom = tappedCellIdx !== null
    ? tappedCellIdx
    : eventState.board.findIndex(c => c && c.isEventGen && c.isFireGen);

  // Power → Lucky の順で判定
  const chain = CHAINS[SEIZO_CHAIN_ID];
  let finalStage = outStage;
  let isLucky = false, isPower = false;

  const powerStage = rollPower(powerLv, chain.stages.length);
  if (powerStage !== null) {
    finalStage = powerStage;
    isPower = true;
  } else {
    const luckyMult = rollLucky(powerLv);
    if (luckyMult !== null) {
      const ls = Math.min(Math.floor(outStage * luckyMult), chain.stages.length);
      if (ls > outStage) { finalStage = ls; isLucky = true; }
    }
  }

  if (!debugState.infiniteEnergy) state.energy -= energyCost;

  const slot = animFrom !== -1 ? findNearestEmptyEventCell(animFrom) : eventState.board.findIndex(c => c === null);
  if (slot !== -1) {
    eventState.board[slot] = { chainId: SEIZO_CHAIN_ID, stage: finalStage };
    discoverSeizoItem(finalStage); // 生成時に発見登録
    const imgSrc = chain.stageImages?.[finalStage - 1];
    flyEventItemAnimation(animFrom !== -1 ? animFrom : slot, slot, imgSrc || chain.stages[finalStage - 1]);
  }
  const genShowIdx = animFrom !== -1 ? animFrom : (slot !== -1 ? slot : 0);
  if (isPower) showPowerOnCell(genShowIdx, 'event-board');
  else if (isLucky) showLuckyOnCell(genShowIdx, 'event-board');

  renderEventHeader();
  renderEventBoard();
  renderEventRequest();
}

// 第三章ジェネレーター（鑑定台）タップ → KANTEITA_CHAINアイテムを生成
function onEventKanteGenTap(tappedCellIdx = null) {
  const powerLv    = eventState.genPowerLevel;
  const cfg        = POWER_CONFIG[powerLv] ?? POWER_CONFIG[0];
  const outStage   = cfg.startStage;
  const energyCost = POWER_COSTS[powerLv] ?? 1;

  if (!debugState.infiniteEnergy && state.energy < energyCost) {
    if (!eventState.energyTutShown && !isDebugModeActive()) {
      eventState.energyTutShown = true;
      startGuide([
        'スタミナが不足すると、マージアイテムは出ません。時間が経過するとスタミナは少しずつ回復します。早く回復したい場合は、ショップで購入するか、ある条件を満たすと回復することもできます。'
      ], '#ev-energy', null);
    } else {
      const errIdx = tappedCellIdx ?? eventState.board.findIndex(c => c && c.isKanteGen);
      showSpecialOnCell(errIdx, 'event-board', `${HP_ICON}が不足しています（必要：${HP_ICON}${energyCost}）`, '#e74c3c');
    }
    return;
  }

  const animFrom = tappedCellIdx !== null
    ? tappedCellIdx
    : eventState.board.findIndex(c => c && c.isEventGen && c.isKanteGen);

  const emptyIdx = animFrom !== -1 ? findNearestEmptyEventCell(animFrom) : eventState.board.findIndex(c => c === null);
  if (emptyIdx === -1) { showBoardFullToast(animFrom !== -1 ? animFrom : null, true); return; }

  const chain = CHAINS[KANTEITA_CHAIN_ID];
  let finalStage = outStage;
  let isLucky = false, isPower = false;

  const powerStage = rollPower(powerLv, chain.stages.length);
  if (powerStage !== null) {
    finalStage = powerStage;
    isPower = true;
  } else if (outStage >= 2) {
    const luckyMult = rollLucky(powerLv);
    if (luckyMult !== null) {
      const ls = Math.min(Math.floor(outStage * luckyMult), chain.stages.length);
      if (ls > outStage) { finalStage = ls; isLucky = true; }
    }
  }

  if (!debugState.infiniteEnergy) state.energy -= energyCost;
  eventState.board[emptyIdx] = { chainId: KANTEITA_CHAIN_ID, stage: finalStage };
  discoverKanteItem(finalStage);

  const genShowIdx = animFrom !== -1 ? animFrom : emptyIdx;
  const imgSrc = chain.stageImages?.[finalStage - 1] || chain.stages[finalStage - 1];
  flyEventItemAnimation(genShowIdx, emptyIdx, imgSrc);
  if (isPower) showPowerOnCell(genShowIdx, 'event-board');
  else if (isLucky) showLuckyOnCell(genShowIdx, 'event-board');

  renderEventHeader();
  renderEventBoard();
  renderEventRequest();
}

// ========================================
// 第四章：設計台ジェネレーター
// ========================================

// 設計台ジェネレーター解放（第一章完了時）
function unlockKeikakuGenerator() {
  eventState.keikakuGenUnlocked = true;
  eventState.keikakuGenLevel    = 0;
  const emptyIdx = eventState.board.findIndex(c => c === null);
  if (emptyIdx === -1) { showToast('ボードが満杯で第四章ジェネレーターを配置できません'); return; }
  eventState.board[emptyIdx] = { isEventGen: true, isKeikakuGen: true, keikakuLevel: 0 };
  discoverGen('ch4', 0);
  showToast('第四章ジェネレーター解放！');
  renderEventBoard();
  renderEventRequest();
}

// 設計台ジェネレーターLvアップ判定：プレイヤーLvベース
// playerLevel 10/12/14/16/18/20 到達時にマージ用タイルを追加配置
const KEIKAKU_GEN_PLAYERLV_TRIGGERS = new Set([10, 12, 14, 16, 18, 20]);
function checkKeikakuGenLevelUpByPlayerLevel(playerLevel) {
  if (!KEIKAKU_GEN_PLAYERLV_TRIGGERS.has(playerLevel)) return;
  if (!eventState.keikakuGenUnlocked) return;
  if (eventState.keikakuLvTriggered.has(playerLevel)) return;
  const existingIdx = eventState.board.findIndex(c => c && c.isKeikakuGen);
  if (existingIdx === -1) return;
  const currentLv = eventState.board[existingIdx].keikakuLevel ?? 0;
  const emptyIdx = findNearestEmptyEventCell(existingIdx);
  if (emptyIdx === -1) { showBoardFullToast(existingIdx, true); return; }
  eventState.board[emptyIdx] = { isEventGen: true, isKeikakuGen: true, keikakuLevel: currentLv };
  eventState.keikakuLvTriggered.add(playerLevel);
  eventState.pendingGenLvUpNotice.push({ idx: emptyIdx, msg: '第四章ジェネレータータイルが増えた！\nマージしてLvアップ！' });
  showToast('第四章ジェネレータータイルが増えた！マージしてLvアップ！');
  renderEventBoard();
}

// 設計台ジェネレータータイル同士のマージ（Lvアップ）
function mergeKeikakuGenerators(fromIdx, toIdx) {
  const toItem   = eventState.board[toIdx];
  const newLevel = (toItem.keikakuLevel ?? 0) + 1;
  const maxLevel = KEIKAKU_GEN_IMAGES.length - 1;
  if (newLevel > maxLevel) { showToast('第四章ジェネレーターは最大レベルです'); return; }
  eventState.board[toIdx]   = { isEventGen: true, isKeikakuGen: true, keikakuLevel: newLevel };
  eventState.board[fromIdx] = null;
  eventState.selectedCell   = null;
  eventState.keikakuGenLevel = Math.max(eventState.keikakuGenLevel, newLevel);
  discoverGen('ch4', newLevel);
  const name = KEIKAKU_GEN_NAMES[Math.min(newLevel, KEIKAKU_GEN_NAMES.length - 1)];
  showSpecialOnCell(toIdx, 'event-board', `${name} Lv${newLevel + 1}！`, '#f9c846');
  trackDailyMerge();
  addEnergy(25, '第四章ジェネレーターLvアップボーナス！');

  fillEventRequests();
  renderEventBoard();
  renderEventRequest();
  renderEventHeader();
  triggerMergeAnim('#event-board', toIdx);
}

// 設計台ジェネレータータップ → KEIKAKU_CHAINアイテムを生成
function onEventKeikakuGenTap(tappedCellIdx = null) {
  const powerLv    = eventState.genPowerLevel;
  const cfg        = POWER_CONFIG[powerLv] ?? POWER_CONFIG[0];
  const outStage   = cfg.startStage;
  const energyCost = POWER_COSTS[powerLv] ?? 1;

  if (!debugState.infiniteEnergy && state.energy < energyCost) {
    if (!eventState.energyTutShown && !isDebugModeActive()) {
      eventState.energyTutShown = true;
      startGuide([
        'スタミナが不足すると、マージアイテムは出ません。時間が経過するとスタミナは少しずつ回復します。早く回復したい場合は、ショップで購入するか、ある条件を満たすと回復することもできます。'
      ], '#ev-energy', null);
    } else {
      const errIdx = tappedCellIdx ?? eventState.board.findIndex(c => c && c.isKeikakuGen);
      showSpecialOnCell(errIdx, 'event-board', `${HP_ICON}が不足しています（必要：${HP_ICON}${energyCost}）`, '#e74c3c');
    }
    return;
  }

  const animFrom = tappedCellIdx !== null
    ? tappedCellIdx
    : eventState.board.findIndex(c => c && c.isEventGen && c.isKeikakuGen);

  const emptyIdx = animFrom !== -1 ? findNearestEmptyEventCell(animFrom) : eventState.board.findIndex(c => c === null);
  if (emptyIdx === -1) { showBoardFullToast(animFrom !== -1 ? animFrom : null, true); return; }

  const chain = CHAINS[KEIKAKU_CHAIN_ID];
  let finalStage = outStage;
  let isLucky = false, isPower = false;

  const powerStage = rollPower(powerLv, chain.stages.length);
  if (powerStage !== null) {
    finalStage = powerStage;
    isPower = true;
  } else if (outStage >= 2) {
    const luckyMult = rollLucky(powerLv);
    if (luckyMult !== null) {
      const ls = Math.min(Math.floor(outStage * luckyMult), chain.stages.length);
      if (ls > outStage) { finalStage = ls; isLucky = true; }
    }
  }

  if (!debugState.infiniteEnergy) state.energy -= energyCost;
  eventState.board[emptyIdx] = { chainId: KEIKAKU_CHAIN_ID, stage: finalStage };
  discoverKeikakuItem(finalStage);

  const genShowIdx = animFrom !== -1 ? animFrom : emptyIdx;
  const imgSrc = chain.stageImages?.[finalStage - 1] || chain.stages[finalStage - 1];
  flyEventItemAnimation(genShowIdx, emptyIdx, imgSrc);
  if (isPower) showPowerOnCell(genShowIdx, 'event-board');
  else if (isLucky) showLuckyOnCell(genShowIdx, 'event-board');

  renderEventHeader();
  renderEventBoard();
  renderEventRequest();
}

// ========================================
// ドラッグ＆ドロップ
// ========================================
function startEvDrag(e, fromIdx) {
  // 前回のドラッグが残っていたら強制クリーンアップ
  if (evDrag.ghost) { evDrag.ghost.remove(); evDrag.ghost = null; }
  document.getElementById('ev-drag-ghost')?.remove();

  const item = eventState.board[fromIdx];
  if (!item || item.isFog) return; // 霧アイテムはドラッグ元にならない

  // ジェネレーターマージ誘導チュートリアル中の制御
  if (isGenMergeTutActive()) {
    const gmStep = currentGenMergeTutStep();
    if (!gmStep || gmStep.type === 'msg') return; // メッセージ中は全操作不可
    // focus ステップ: ジェネレータータイルのドラッグのみ許可
    if (!item.isEventGen || item.isFireGen) return;
  }

  const step = currentTutStep();
  if (step) {
    if (step.type === 'blocking_msg') return;
    if (step.type === 'request_focus') return;
    if (step.type === 'gen_focus') {
      // gen_focus: ジェネレーターはタップ扱い、アイテムはブロック
      if (item.isEventGen) { onEventGenTap(fromIdx); return; }
      return;
    }
    if (step.type === 'merge_focus' && item.isEventGen) return;
  }

  // ドラッグ開始時にナビヒントを表示（選択状態は変更しない）
  if (item.isEventGen) {
    if (item.isFireGen)          showNaviHintForFireGen(item, true);
    else if (item.isKanteGen)    showNaviHintForKanteGen(item, true);
    else                         showNaviHintForGen(item.genLevel ?? 0, true);
  } else if (item.isBubble) {
    showNaviHintForBubble(item);
  } else if (item.isCoin) {
    showNaviHintForCoin(item);
  } else if (!item.isFog) {
    showNaviHintForItem(item, true);
  }

  e.preventDefault();
  evDrag.active = true;
  evDrag.fromIdx = fromIdx;
  evDrag.tapHandled = false;
  evDrag.startX = e.clientX;
  evDrag.startY = e.clientY;
  evDrag.hasMoved = false;
  createEvGhost(e.clientX, e.clientY, fromIdx);
  document.addEventListener('mousemove', onEvDragMove);
  document.addEventListener('mouseup', onEvDragEnd);
}

function startEvDragTouch(e, fromIdx) {
  // 前回のドラッグが残っていたら強制クリーンアップ
  if (evDrag.ghost) { evDrag.ghost.remove(); evDrag.ghost = null; }
  document.getElementById('ev-drag-ghost')?.remove();

  const item = eventState.board[fromIdx];
  if (!item || item.isFog) return; // 霧アイテムはドラッグ元にならない

  // ジェネレーターマージ誘導チュートリアル中の制御
  if (isGenMergeTutActive()) {
    const gmStep = currentGenMergeTutStep();
    if (!gmStep || gmStep.type === 'msg') return;
    if (!item.isEventGen || item.isFireGen) return;
  }

  const step = currentTutStep();
  if (step) {
    if (step.type === 'blocking_msg') return;
    if (step.type === 'request_focus') return;
    if (step.type === 'gen_focus') return;
    if (step.type === 'merge_focus' && item.isEventGen) return;
  }

  // ドラッグ開始時にナビヒントを表示（選択状態は変更しない）
  if (item.isEventGen) {
    if (item.isFireGen)       showNaviHintForFireGen(item, true);
    else if (item.isKanteGen) showNaviHintForKanteGen(item, true);
    else                      showNaviHintForGen(item.genLevel ?? 0, true);
  } else if (item.isBubble) {
    showNaviHintForBubble(item);
  } else if (item.isCoin) {
    showNaviHintForCoin(item);
  } else if (!item.isFog) {
    showNaviHintForItem(item, true);
  }

  e.preventDefault();
  evDrag.active = true;
  evDrag.fromIdx = fromIdx;
  evDrag.tapHandled = false;
  const t = e.touches[0];
  evDrag.startX = t.clientX;
  evDrag.startY = t.clientY;
  evDrag.hasMoved = false;
  createEvGhost(t.clientX, t.clientY, fromIdx);
  document.addEventListener('touchmove', onEvDragMoveTouch, { passive: false });
  document.addEventListener('touchend', onEvDragEndTouch);
  document.addEventListener('touchcancel', onEvDragEndTouch);
}

function createEvGhost(x, y, fromIdx) {
  // 前回の残像が残っていたら先に除去
  document.getElementById('ev-drag-ghost')?.remove();
  if (evDrag.ghost) { evDrag.ghost.remove(); evDrag.ghost = null; }

  const item = eventState.board[fromIdx];
  const ghost = document.createElement('div');
  ghost.id = 'ev-drag-ghost';
  ghost.style.cssText = `
    position:fixed; pointer-events:none; z-index:999;
    opacity:0.85;
    transform:translate(-50%,-50%);
    left:${x}px; top:${y}px;
  `;

  // 画像があれば画像、なければ絵文字
  let imgSrc = null;
  let fallbackEmoji = '❓';
  if (item.isCoin) {
    const lv = item.coinLv ?? 1;
    imgSrc = COIN_IMAGES[lv] ?? null;
    fallbackEmoji = COIN_EMOJI[lv] ?? '🪙';
  } else if (item.isEventGen && item.isFireGen) {
    const sLv = item.seizoLevel ?? 0;
    imgSrc = SEIZO_GEN_IMAGES[Math.min(sLv, SEIZO_GEN_IMAGES.length - 1)];
  } else if (item.isEventGen && item.isKanteGen) {
    const kLv = item.kanteLevel ?? 0;
    imgSrc = KANTEITA_GEN_IMAGES[Math.min(kLv, KANTEITA_GEN_IMAGES.length - 1)];
  } else if (item.isEventGen) {
    imgSrc = EVENT_GEN_IMAGES[Math.min(item.genLevel ?? 0, EVENT_GEN_IMAGES.length - 1)];
  } else if (item.chainId !== undefined) {
    const chain = CHAINS[item.chainId];
    imgSrc = chain.stageImages?.[item.stage - 1] ?? null;
    fallbackEmoji = chain.stages[item.stage - 1] || '❓';
  } else {
    imgSrc = EVENT_CHAIN.stageImages?.[item.stage - 1] || null;
    fallbackEmoji = EVENT_CHAIN.stages[item.stage - 1] || '❓';
  }

  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.cssText = 'width:52px;height:52px;object-fit:contain;display:block;';
    ghost.appendChild(img);
  } else {
    ghost.textContent = fallbackEmoji;
    ghost.style.fontSize = '36px';
  }

  document.body.appendChild(ghost);
  evDrag.ghost = ghost;
}

function onEvDragMove(e) {
  if (!evDrag.ghost) return;
  if (!evDrag.hasMoved) {
    const dx = e.clientX - evDrag.startX, dy = e.clientY - evDrag.startY;
    if (dx * dx + dy * dy > 25) evDrag.hasMoved = true; // 5px閾値
  }
  evDrag.ghost.style.left = e.clientX + 'px';
  evDrag.ghost.style.top  = e.clientY + 'px';
  highlightEvDropTarget(e.clientX, e.clientY);
}

function onEvDragMoveTouch(e) {
  e.preventDefault();
  if (!evDrag.ghost) return;
  const t = e.touches[0];
  if (!evDrag.hasMoved) {
    const dx = t.clientX - evDrag.startX, dy = t.clientY - evDrag.startY;
    if (dx * dx + dy * dy > 25) evDrag.hasMoved = true; // 5px閾値
  }
  evDrag.ghost.style.left = t.clientX + 'px';
  evDrag.ghost.style.top  = t.clientY + 'px';
  highlightEvDropTarget(t.clientX, t.clientY);
}

function onEvDragEnd(e) {
  endEvDrag(e.clientX, e.clientY);
  document.removeEventListener('mousemove', onEvDragMove);
  document.removeEventListener('mouseup', onEvDragEnd);
}

function onEvDragEndTouch(e) {
  const t = e.changedTouches?.[0];
  if (t) endEvDrag(t.clientX, t.clientY);
  else {
    // touchcancel 等でタッチ座標が取れない場合の強制クリーンアップ
    if (evDrag.ghost) { evDrag.ghost.remove(); evDrag.ghost = null; }
    document.getElementById('ev-drag-ghost')?.remove();
    evDrag.active = false;
    evDrag.fromIdx = null;
    document.querySelectorAll('#event-board .cell').forEach(c => c.classList.remove('drop-over'));
    renderEventBoard(); // 選択状態などの残像を消す
  }
  document.removeEventListener('touchmove', onEvDragMoveTouch);
  document.removeEventListener('touchend', onEvDragEndTouch);
  document.removeEventListener('touchcancel', onEvDragEndTouch);
}

function highlightEvDropTarget(x, y) {
  document.querySelectorAll('#event-board .cell').forEach(c => c.classList.remove('drop-over'));
  const idx = getEvCellIndexAt(x, y);
  if (idx !== null && idx !== evDrag.fromIdx) {
    document.querySelectorAll('#event-board .cell')[idx]?.classList.add('drop-over');
  }
}

function getEvCellIndexAt(x, y) {
  const cells = document.querySelectorAll('#event-board .cell');
  for (const cell of cells) {
    const rect = cell.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      return parseInt(cell.dataset.index);
    }
  }
  return null;
}

function endEvDrag(x, y) {
  if (evDrag.ghost) { evDrag.ghost.remove(); evDrag.ghost = null; }
  if (!evDrag.active) return;

  const toIdx   = getEvCellIndexAt(x, y);
  const fromIdx = evDrag.fromIdx;
  evDrag.active  = false;
  evDrag.fromIdx = null;
  document.querySelectorAll('#event-board .cell').forEach(c => c.classList.remove('drop-over'));

  // 同一セルへのドロップ = タップ相当
  if (toIdx === null || toIdx === fromIdx) {
    const item = eventState.board[fromIdx];
    evDrag.tapHandled = true; // 後続clickをブロック（全ケース）

    if (item && item.isEventGen) {
      // ジェネレーターマージチュートリアル中（第一章のみ）は選択のみ
      if (!item.isFireGen && isGenMergeTutActive()) {
        eventState.selectedCell = (eventState.selectedCell === fromIdx) ? null : fromIdx;
        renderEventBoard();
        return;
      }
      handleAnyGenTap(fromIdx);
      return;
    }

    // 通常アイテムのタップ（touch では click が来ないためここで処理）
    if (item && !item.isFog) {
      // 指を動かしていた場合はドラッグ扱い → 選択しない（ナビヒントは startEvDragTouch で表示済み）
      if (evDrag.hasMoved) { renderEventBoard(); return; }

      // しゃぼん玉アイテムのタップ → ダイヤボタン表示
      if (item.isBubble) {
        eventState.selectedCell = fromIdx;
        showNaviHintForBubble(item);
        renderEventBoard();
        return;
      }

      // コインアイテムのタップ / ダブルタップ
      if (item.isCoin) {
        const now = Date.now();
        if (now - lastCoinTapTime < 400 && lastCoinTapIdx === fromIdx) {
          const reward = COIN_REWARD[item.coinLv ?? 1] ?? 0;
          state.coin += reward;
          eventState.board[fromIdx] = null;
          eventState.selectedCell   = null;
          hideNaviHint();
          showToast(`${COIN_ICON} +${reward}`);
          renderEventBoard();
          renderEventHeader();
          lastCoinTapTime = 0; lastCoinTapIdx = -1;
          return;
        }
        lastCoinTapTime = now; lastCoinTapIdx = fromIdx;
        if (eventState.selectedCell !== null && eventState.selectedCell !== fromIdx) {
          const sel = eventState.board[eventState.selectedCell];
          if (sel && evItemCanMerge(sel, item)) {
            doEventMerge(eventState.selectedCell, fromIdx);
            return;
          }
        }
        eventState.selectedCell = fromIdx;
        showNaviHintForCoin(item);
        renderEventBoard();
        return;
      }

      const tutStep = currentTutStep();
      if (tutStep && tutStep.type !== 'merge_focus') { renderEventBoard(); return; }
      if (isGenMergeTutActive()) { renderEventBoard(); return; }

      if (eventState.selectedCell !== null && eventState.selectedCell !== fromIdx) {
        const sel = eventState.board[eventState.selectedCell];
        if (sel && evItemCanMerge(sel, item)) {
          doEventMerge(eventState.selectedCell, fromIdx);
          return;
        }
        eventState.selectedCell = fromIdx;
        showNaviHintForItem(item, true);
        renderEventBoard();
        return;
      }
      if (eventState.selectedCell === fromIdx) {
        // 同一アイテム再タップ → 選択・ナビヒント維持
        return;
      }
      eventState.selectedCell = fromIdx;
      showNaviHintForItem(item, true);
      renderEventBoard();
      return;
    }

    // 空マス or 霧
    hideNaviHint();
    eventState.selectedCell = null;
    renderEventBoard();
    return;
  }

  // 実際にドラッグが発生した（別セルへ移動���→ 後続のclickイベントをブロック
  evDrag.tapHandled = true;

  const fromItem = eventState.board[fromIdx];
  const toItem   = eventState.board[toIdx];
  if (!fromItem || fromItem.isFog) return; // 霧アイテムはドラッグ元にならない

  const step = currentTutStep();

  if (!toItem) {
    // 空きセルへ移動（merge_focus またはチュートリアル完了後のみ）
    if (!step || step.type === 'merge_focus') {
      eventState.board[toIdx]   = fromItem;
      eventState.board[fromIdx] = null;
    }
  } else if (!fromItem.isFireGen && !toItem.isFireGen &&
             fromItem.isEventGen && toItem.isEventGen &&
             (fromItem.genLevel ?? 0) === (toItem.genLevel ?? 0)) {
    // メモ帳ジェネレータータイル同士のマージ → Lvアップ
    mergeEventGenerators(fromIdx, toIdx);
    return;
  } else if (fromItem.isFireGen && toItem.isFireGen &&
             (fromItem.seizoLevel ?? 0) === (toItem.seizoLevel ?? 0)) {
    // 製造機ジェネレータータイル同士のマージ → Lvアップ
    mergeFireGenerators(fromIdx, toIdx);
    return;
  } else if (fromItem.isKanteGen && toItem.isKanteGen &&
             (fromItem.kanteLevel ?? 0) === (toItem.kanteLevel ?? 0)) {
    // 鑑定台ジェネレータータイル同士のマージ → Lvアップ
    mergeKanteGenerators(fromIdx, toIdx);
    return;
  } else if (!fromItem.isEventGen && evItemCanMerge(fromItem, toItem)) {
    // 通常/霧アイテムのマージ（ロック済み霧はターゲット不可）
    if (toItem.isFog && !eventState.unlockedFogCells.has(toIdx)) {
      eventState.selectedCell = null;
      renderEventBoard();
      return;
    }
    doEventMerge(fromIdx, toIdx);
    return;
  } else if (!step && !toItem.isEventGen && !fromItem.isEventGen && !toItem.isFog) {
    // チュートリアル完了後のみ通常アイテム同士の入れ替え許可
    eventState.board[toIdx]   = fromItem;
    eventState.board[fromIdx] = toItem;
  }

  // ドラッグ後の選択状態更新
  // ジェネレーター: 選択中タイルを移動した場合は新位置を追跡
  // マージアイテム: 残像・誤マージ防止のためリセット
  if (fromItem.isEventGen) {
    if (eventState.selectedCell === fromIdx) {
      eventState.selectedCell = !toItem ? toIdx : null; // 空きへ移動→新位置, 入れ替え→解除
      if (eventState.selectedCell === null) hideNaviHint();
    }
  } else {
    if (eventState.selectedCell !== null) {
      eventState.selectedCell = null;
      hideNaviHint();
    }
  }
  renderEventBoard();
  renderEventRequest(); // 依頼達成可否を更新
}

// ========================================
// イベント画面ナビゲーション
// ========================================
document.getElementById('event-btn').addEventListener('click', () => {
  if (isTutorialInProgress()) return;
  document.getElementById('event-screen').classList.remove('hidden');
  renderEventBoard();
  renderEventHeader();
  renderEventRequest();
  renderTutorialPanel();
});

document.getElementById('event-close').addEventListener('click', () => {
  if (isTutorialInProgress()) return;
  document.getElementById('event-screen').classList.add('hidden');
  document.getElementById('tutorial-overlay').classList.add('hidden');
  document.getElementById('tutorial-panel').classList.add('hidden');
});

// チュートリアルオーバーレイ・パネルのタップで次へ
document.getElementById('tutorial-overlay').addEventListener('click', onTutorialTap);
document.getElementById('tutorial-panel').addEventListener('click', onTutorialTap);

// ナビキャラタップでヒント表示（チュートリアル外のみ）
document.getElementById('tutorial-char').addEventListener('click', (e) => {
  e.stopPropagation();
  if (!isTutorialComplete() || isGenMergeTutActive()) return;
  const genItem = eventState.board.find(c => c && c.isEventGen && !c.isFireGen);
  const genLevel = genItem ? (genItem.genLevel ?? 0) : 0;
  showNaviHintForGen(genLevel);
});

// LvアップダウンボタンのクリックでgenPowerLevelをサイクル
document.getElementById('navi-lv-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  // 選択中ジェネレーターの種類に応じてサイクル
  const selIdx  = eventState.selectedCell;
  const selItem = selIdx !== null ? eventState.board[selIdx] : null;
  if (selItem && selItem.isFireGen) {
    // 第二章ジェネレーター
    const sLv = selItem.seizoLevel ?? 0;
    cycleFireGenPowerLevel(sLv);
    updateFireNaviLvBtn(sLv);
  } else {
    // 第一章ジェネレーター
    const genItem  = eventState.board.find(c => c && c.isEventGen && !c.isFireGen);
    const genLevel = genItem ? (genItem.genLevel ?? 0) : 0;
    cycleGenPowerLevel(genLevel);
    updateNaviLvBtn(genLevel);
  }
  // 持続中はタイマーをリセットしない（選択中は消えない）
  if (!naviHintPersistent) {
    if (naviHintTimer) clearTimeout(naviHintTimer);
    naviHintTimer = setTimeout(() => {
      document.getElementById('navi-hint-panel')?.classList.add('hidden');
      naviHintTimer = null;
    }, 3500);
  }
});

// ダイヤボタン（しゃぼん玉を割る）
document.getElementById('navi-diamond-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  const selIdx  = eventState.selectedCell;
  const selItem = selIdx !== null ? eventState.board[selIdx] : null;
  if (!selItem || !selItem.isBubble) return;
  const cost = BUBBLE_DIAMOND_COST[selItem.stage] ?? 0;
  if (state.diamond < cost) {
    showToast(`ダイヤが足りません（必要: 💎${cost}）`);
    return;
  }
  state.diamond -= cost;
  trackDailyDiamond(cost);
  renderEventHeader();
  popBubble(selIdx);
});

// ゴミ箱ボタン（Lv1マージアイテムを削除）
document.getElementById('navi-trash-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  const selIdx  = eventState.selectedCell;
  if (selIdx === null) return;
  const selItem = eventState.board[selIdx];
  if (!selItem || selItem.stage !== 1 || selItem.isFog || selItem.isBubble || selItem.isCoin || selItem.isEventGen) return;
  eventState.board[selIdx] = null;
  eventState.selectedCell  = null;
  hideNaviHint();
  renderEventBoard();
});

// コインボタン（Lv2以上のマージアイテムをコインに換金）
document.getElementById('navi-coin-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  const selIdx  = eventState.selectedCell;
  if (selIdx === null) return;
  const selItem = eventState.board[selIdx];
  if (!selItem || selItem.stage < 2 || selItem.isFog || selItem.isBubble || selItem.isCoin || selItem.isEventGen) return;
  const reward = selItem.stage * 10;
  state.coin += reward;
  eventState.board[selIdx] = null;
  eventState.selectedCell  = null;
  hideNaviHint();
  showToast(`${COIN_ICON} +${reward}`);
  renderEventBoard();
  renderEventHeader();
});

// ========================================
// ヘッダー高さをCSS変数に反映（sticky top のズレ防止）
// ========================================
function updateStickyHeights() {
  const mainHeader  = document.getElementById('header');
  const eventHeader = document.getElementById('event-header-bar');
  const mh = mainHeader  ? mainHeader.getBoundingClientRect().height  : 0;
  const eh = eventHeader ? eventHeader.getBoundingClientRect().height : 0;
  if (mh > 0) document.documentElement.style.setProperty('--main-header-h',  mh + 'px');
  if (eh > 0) document.documentElement.style.setProperty('--event-header-h', eh + 'px');
}
window.addEventListener('resize', updateStickyHeights);

// ドラッグ中にウィンドウがフォーカスを失った場合（アプリ切り替え等）にゴーストを強制削除
window.addEventListener('blur', () => {
  if (evDrag.ghost || evDrag.active) {
    if (evDrag.ghost) { evDrag.ghost.remove(); evDrag.ghost = null; }
    document.getElementById('ev-drag-ghost')?.remove();
    evDrag.active = false;
    evDrag.fromIdx = null;
    document.querySelectorAll('#event-board .cell').forEach(c => c.classList.remove('drop-over'));
    renderEventBoard();
  }
  if (drag.ghost || drag.active) {
    if (drag.ghost) { drag.ghost.remove(); drag.ghost = null; }
    document.getElementById('drag-ghost')?.remove();
    drag.active = false;
    drag.fromIdx = null;
    document.querySelectorAll('.cell').forEach(c => c.classList.remove('drop-over'));
    renderBoard();
  }
});

// ========================================
// 起動
// ========================================


initGame();
initEventMap();
loadDailyMission();
checkDailyMissionReset();
renderDailyMissionBadge();

// フル画面 + 縦向きロック要求（ユーザー操作起因が必須のため、スタートボタン押下時に実行）
function requestAppFullscreen() {
  // Fullscreen API（Android Chrome 等で有効）
  const el = document.documentElement;
  if (el.requestFullscreen)             el.requestFullscreen();
  else if (el.webkitRequestFullscreen)  el.webkitRequestFullscreen();

  // 縦向き（portrait）固定
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('portrait').catch(() => {});
  }
}

// タイトル画面スタートボタン
document.getElementById('title-start-btn').addEventListener('click', () => {
  requestAppFullscreen();
  const ts = document.getElementById('title-screen');
  ts.classList.add('title-fade-out');
  setTimeout(() => ts.classList.add('hidden'), 600);
});

// ===== 画像プリロード =====
(function preloadImages() {
  const PRELOAD_PATHS = [
    // UI
    'img/UI/image_merge_title_main_01.png',
    'img/UI/image_merge_start_button.png',
    'img/UI/image_merge_navi_chara.png',
    'img/UI/image_merge_navi_close.png',
    'img/UI/image_merge_navi_daiya.png',
    'img/UI/image_merge_navi_hp.png',
    'img/UI/image_merge_navi_itemlist.png',
    'img/UI/image_merge_navi_setting.png',
    'img/UI/image_merge_navi_story.png',
    'img/UI/image_merge_icon_coin01.png',
    'img/UI/image_merge_icon_coin02.png',
    'img/UI/image_merge_icon_coin03.png',
    'img/UI/image_merge_icon_coin04.png',
    // 背景
    'img/bg/image_merge_bg.png',
    'img/bg/image_merge_bg_hiruma.png',
    'img/bg/image_merge_bg_light.png',
    'img/bg/image_merge_bg_road.png',
    'img/bg/image_merge_bg_road_light.png',
    'img/bg/image_merge_bg_road_light02.png',
    'img/bg/image_merge_bg_road_night.png',
    // Ch1 キャラ
    'img/Chapter1/Chara/image_merge_order_chara_00.png',
    'img/Chapter1/Chara/image_merge_order_chara_01.png',
    'img/Chapter1/Chara/image_merge_order_chara_01a.png',
    'img/Chapter1/Chara/image_merge_order_chara_01ab.png',
    'img/Chapter1/Chara/image_merge_order_chara_01b.png',
    'img/Chapter1/Chara/image_merge_order_chara_02.png',
    'img/Chapter1/Chara/image_merge_order_chara_03.png',
    'img/Chapter1/Chara/image_merge_order_chara_04.png',
    'img/Chapter1/Chara/image_merge_order_chara_05.png',
    'img/Chapter1/Chara/image_merge_order_chara_05a.png',
    'img/Chapter1/Chara/image_merge_order_chara_05b.png',
    // Ch1 アイコン
    'img/Chapter1/Icon/image_merge_gene1_01.png',
    'img/Chapter1/Icon/image_merge_gene1_02.png',
    'img/Chapter1/Icon/image_merge_gene1_03.png',
    'img/Chapter1/Icon/image_merge_gene1_04.png',
    'img/Chapter1/Icon/image_merge_icon1_01.png',
    'img/Chapter1/Icon/image_merge_icon1_02.png',
    'img/Chapter1/Icon/image_merge_icon1_03.png',
    'img/Chapter1/Icon/image_merge_icon1_04.png',
    'img/Chapter1/Icon/image_merge_icon1_05.png',
    'img/Chapter1/Icon/image_merge_icon1_06.png',
    'img/Chapter1/Icon/image_merge_icon1_07.png',
    'img/Chapter1/Icon/image_merge_icon1_08.png',
    'img/Chapter1/Icon/image_merge_icon1_09.png',
    'img/Chapter1/Icon/image_merge_icon1_10.png',
    'img/Chapter1/Icon/image_merge_icon1_11.png',
    'img/Chapter1/Icon/image_merge_icon1_12.png',
    // Ch2 キャラ
    'img/Chapter2/Chara/image_merge_order_chara_06a.png',
    'img/Chapter2/Chara/image_merge_order_chara_07.png',
    'img/Chapter2/Chara/image_merge_order_chara_08.png',
    'img/Chapter2/Chara/image_merge_order_chara_09.png',
    'img/Chapter2/Chara/image_merge_order_chara_09a.png',
    'img/Chapter2/Chara/image_merge_order_chara_10.png',
    // Ch2 アイコン
    'img/Chapter2/Icon/image_merge_gene2_01.png',
    'img/Chapter2/Icon/image_merge_gene2_02.png',
    'img/Chapter2/Icon/image_merge_gene2_03.png',
    'img/Chapter2/Icon/image_merge_gene2_04.png',
    'img/Chapter2/Icon/image_merge_gene2_05.png',
    'img/Chapter2/Icon/image_merge_gene2_06.png',
    'img/Chapter2/Icon/image_merge_gene2_07.png',
    'img/Chapter2/Icon/image_merge_icon2_01.png',
    'img/Chapter2/Icon/image_merge_icon2_02.png',
    'img/Chapter2/Icon/image_merge_icon2_03.png',
    'img/Chapter2/Icon/image_merge_icon2_04.png',
    'img/Chapter2/Icon/image_merge_icon2_05.png',
    'img/Chapter2/Icon/image_merge_icon2_06.png',
    'img/Chapter2/Icon/image_merge_icon2_07.png',
    'img/Chapter2/Icon/image_merge_icon2_08.png',
    'img/Chapter2/Icon/image_merge_icon2_09.png',
    'img/Chapter2/Icon/image_merge_icon2_10.png',
    'img/Chapter2/Icon/image_merge_icon2_11.png',
    'img/Chapter2/Icon/image_merge_icon2_12.png',
    'img/Chapter2/Icon/image_merge_icon2_13.png',
    'img/Chapter2/Icon/image_merge_icon2_14.png',
    'img/Chapter2/Icon/image_merge_icon2_15.png',
    // Ch2 背景
    'img/Chapter2/bg/image_merge_bg_Apartmentexterior.png',
    'img/Chapter2/bg/image_merge_bg_Apartmentinterior.png',
    'img/Chapter2/bg/image_merge_bg_sunrisehills.png',
    // Ch3 キャラ
    'img/Chapter3/chara/image_merge_order_chara_15.png',
    'img/Chapter3/chara/image_merge_order_chara_16.png',
    'img/Chapter3/chara/image_merge_order_chara_17.png',
    'img/Chapter3/chara/image_merge_order_chara_18.png',
    'img/Chapter3/chara/image_merge_order_chara_18_.png',
    'img/Chapter3/chara/image_merge_order_chara_18a.png',
    'img/Chapter3/chara/image_merge_order_chara_19.png',
    'img/Chapter3/chara/image_merge_order_chara_20.png',
    'img/Chapter3/chara/image_merge_order_chara_21.png',
    'img/Chapter3/chara/image_q.png',
    // Ch3 アイコン
    'img/Chapter3/icon/image_merge_gene3_01.png',
    'img/Chapter3/icon/image_merge_gene3_02.png',
    'img/Chapter3/icon/image_merge_gene3_03.png',
    'img/Chapter3/icon/image_merge_gene3_04.png',
    'img/Chapter3/icon/image_merge_gene3_05.png',
    'img/Chapter3/icon/image_merge_gene3_06.png',
    'img/Chapter3/icon/image_merge_gene3_07.png',
    'img/Chapter3/icon/image_merge_icon3_01.png',
    'img/Chapter3/icon/image_merge_icon3_02.png',
    'img/Chapter3/icon/image_merge_icon3_03.png',
    'img/Chapter3/icon/image_merge_icon3_04.png',
    'img/Chapter3/icon/image_merge_icon3_05.png',
    'img/Chapter3/icon/image_merge_icon3_06.png',
    'img/Chapter3/icon/image_merge_icon3_07.png',
    'img/Chapter3/icon/image_merge_icon3_08.png',
    'img/Chapter3/icon/image_merge_icon3_09.png',
    'img/Chapter3/icon/image_merge_icon3_10.png',
    'img/Chapter3/icon/image_merge_icon3_11.png',
    'img/Chapter3/icon/image_merge_icon3_12.png',
    'img/Chapter3/icon/image_merge_icon3_13.png',
    'img/Chapter3/icon/image_merge_icon3_14.png',
    'img/Chapter3/icon/image_merge_icon3_15.png',
    'img/Chapter3/icon/image_merge_icon3_16.png',
    'img/Chapter3/icon/image_merge_icon3_17.png',
    'img/Chapter3/icon/image_merge_icon3_18.png',
    'img/Chapter3/icon/image_merge_icon3_19.png',
    'img/Chapter3/icon/image_merge_icon3_20.png',
    // Ch3 背景
    'img/Chapter3/bg/image_merge_bg_inn_exterior.png',
    'img/Chapter3/bg/image_merge_bg_inn_interior.png',
    'img/Chapter3/bg/image_merge_bg_inn_study.png',
    'img/Chapter3/bg/image_merge_bg_lawyer_office.png',
    'img/Chapter3/bg/image_merge_bg_lawyer_office_evidence.png',
    'img/Chapter3/bg/image_merge_bg_lawyer_office_messy.png',
    'img/Chapter3/bg/image_merge_bg_lawyer_office_night.png',
    'img/Chapter3/bg/image_merge_bg_lawyer_office_rain.png',
  ];

  const total    = PRELOAD_PATHS.length;
  let   loaded   = 0;
  const barEl    = document.getElementById('title-loading-bar');
  const textEl   = document.getElementById('title-loading-text');
  const loadingEl = document.getElementById('title-loading');
  const startBtn = document.getElementById('title-start-btn');

  function onProgress() {
    loaded++;
    const pct = Math.round((loaded / total) * 100);
    if (barEl) barEl.style.width = pct + '%';
    if (textEl) textEl.textContent = `読み込み中... ${pct}%`;
    if (loaded >= total) onComplete();
  }

  function onComplete() {
    if (loadingEl) loadingEl.classList.add('hidden');
    if (startBtn) {
      startBtn.style.display = '';
    }
  }

  PRELOAD_PATHS.forEach(src => {
    const img = new Image();
    img.onload  = onProgress;
    img.onerror = onProgress; // エラーでも進める
    img.src     = src;
  });
})();

// 起動時にイベントマップ①を最初に表示
document.getElementById('event-screen').classList.remove('hidden');
renderEventBoard();
renderEventGenerators();
renderEventHeader();
renderEventRequest();
renderTutorialPanel();

// DOM描画完了後にヘッダー高さを計測（2段RFAで確実にレイアウト後に実行）
requestAnimationFrame(() => requestAnimationFrame(updateStickyHeights));
setTimeout(updateStickyHeights, 300);

// しゃぼん玉 → コイン変換タイマー（5秒ごとにチェック、60秒経過でLv1コインに変換）
setInterval(() => {
  let changed = false;
  eventState.board.forEach((item, i) => {
    if (!item || !item.isBubble) return;
    const ts = item.bubbleTimestamp ?? Date.now();
    if (Date.now() - ts >= BUBBLE_COIN_DELAY_MS) {
      eventState.board[i] = { isCoin: true, coinLv: 1 };
      // 選択中だったらナビヒントをリセット
      if (eventState.selectedCell === i) {
        eventState.selectedCell = null;
        hideNaviHint();
      }
      changed = true;
    }
  });
  if (changed) {
    const screen = document.getElementById('event-screen');
    if (!screen?.classList.contains('hidden')) renderEventBoard();
  }
}, 5000);

// ========================================
// デイリーミッション UI イベント
// ========================================
document.getElementById('daily-mission-btn').addEventListener('click', () => {
  checkDailyMissionReset();
  renderDailyMissionPopup();
  document.getElementById('daily-mission-screen').classList.remove('hidden');
});

document.getElementById('daily-mission-close').addEventListener('click', () => {
  document.getElementById('daily-mission-screen').classList.add('hidden');
});

// 画面外タップで閉じる
document.getElementById('daily-mission-screen').addEventListener('click', (e) => {
  if (e.target === document.getElementById('daily-mission-screen')) {
    document.getElementById('daily-mission-screen').classList.add('hidden');
  }
});
