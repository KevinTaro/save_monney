import type { VirtualPet } from '../types.ts';

export const PET_ROSTER: VirtualPet[] = [
  {
    id: 'shiba',
    name: '銅幣小柴柴・旺旺',
    species: '守財柴犬',
    avatar: '🐕',
    unlockedThreshold: 0, // Default unlocked
    title: '初心冒險夥伴',
    description: '熱情活潑的小狗狗，只要你記下一筆帳，牠就會搖尾巴為你喝采！最喜歡跟著小主人一起學存錢。',
    favoriteFood: '小骨頭餅乾 🦴',
    personality: '忠誠又活潑',
    dialogueList: [
      '汪汪！今天記帳了嗎？每一枚銅板都有大大的力量喔！',
      '摸摸頭～主人好棒！我們要一起守護小金庫！',
      '記帳就像存骨頭，越多骨頭我就越安心！汪！',
      '如果想買玩具，記得先想 30 秒是「需要」還是「想要」喔！',
    ],
  },
  {
    id: 'squirrel',
    name: '松果小松鼠・奇奇',
    species: '橡實儲蓄專家',
    avatar: '🐿️',
    unlockedThreshold: 500, // Unlocks at balance >= $500
    title: '樹洞金庫管家',
    description: '秋天存橡實、冬天不挨餓的儲蓄大師！看著你的存款突破 500 元，牠興奮地把尾巴豎得老高。',
    favoriteFood: '黃金橡實 🌰',
    personality: '謹慎精明、機靈可愛',
    dialogueList: [
      '吱吱！500元大關達成了！你的小樹洞越來越滿囉！',
      '把小錢存起來，就像一顆小松果長成大橡樹！',
      '主人，今天少喝一杯含糖飲料，可以換成一顆金橡實存起來喔！',
      '好想抱抱小主人～你的理財習慣越來越棒了！',
    ],
  },
  {
    id: 'lucky_cat',
    name: '福氣招財貓・金金',
    species: '金幣招財貓',
    avatar: '🐱',
    unlockedThreshold: 1500, // Unlocks at balance >= $1500
    title: '四葉幸運守護者',
    description: '左手招人緣，右手招金幣！帶著清脆的鈴鐺聲，只有懂得自律存錢的孩子才能召喚牠！',
    favoriteFood: '特級小魚乾 🐟',
    personality: '溫柔優雅、自帶財氣',
    dialogueList: [
      '喵嗚～叮噹響！存款突破 1,500 元了，財氣滿滿！',
      '買文具是「需要」，買第三個筆袋是「想要」喔～喵！',
      '小金庫越來越有安全感了，你可以支撐好幾週的探險了呢！',
      '給小主人一個呼嚕嚕的幸運祝福！今天也是充實的一天！',
    ],
  },
  {
    id: 'dragon',
    name: '金光小萌龍・烈焰',
    species: '寶藏守護龍',
    avatar: '🐲',
    unlockedThreshold: 3500, // Unlocks at balance >= $3500
    title: '傳奇寶藏領主',
    description: '棲息在黃金金幣山上的神獸！能分辨世間所有真假財富，當存款達 3,500 元時破蛋而出！',
    favoriteFood: '金幣烤肉串 🍖',
    personality: '威風凜凜但其實超愛撒嬌',
    dialogueList: [
      '嗷嗚！我的龍巢被你滿滿的金幣照得金光閃閃！',
      '3,500 元！你已經具備小領主的財務自律力了！',
      '金融顧問的智慧：複利就像龍的魔法火焰，時間越久燃燒得越旺！',
      '誰敢亂花主人的辛苦積蓄？看我的守護火焰！嗷～',
    ],
  },
  {
    id: 'unicorn',
    name: '夢想獨角獸・露娜',
    species: '星光幻彩獸',
    avatar: '🦄',
    unlockedThreshold: 8000, // Unlocks at balance >= $8000
    title: '奇蹟夢想實踐家',
    description: '額頭上的螺旋角具有將夢想目標具現化的魔力。只有存款達到 8,000 元的大冒險家能獲得其認可！',
    favoriteFood: '彩虹棉花糖 🍭',
    personality: '高雅夢幻、充滿啟發',
    dialogueList: [
      '希律律～8,000 元的夢想星光！你已經超越 95% 的同齡孩子了！',
      '把夢想拆解成每週的小目標，奇蹟就會在眼前發生。',
      '記帳不是限制花錢，而是為了讓更美好的夢想實現！',
      '用魔法角輕觸你的小金庫，願你的每筆開銷都充滿價值！',
    ],
  },
  {
    id: 'phoenix',
    name: '至尊金鳳凰・菲尼克斯',
    species: '神殿財富神尊',
    avatar: '👑',
    unlockedThreshold: 15000, // Unlocks at balance >= $15000
    title: '終極財富大宗師',
    description: '象徵最高財務智慧與生生不息的財富循環！傳說中唯有存款達 15,000 元以上的理財傳奇才能加冕！',
    favoriteFood: '晨曦甘露果 🍇',
    personality: '威嚴睿智、大師風範',
    dialogueList: [
      '啾啾神鳴！恭喜登頂財富巔峰！你已經是小小金融大宗師！',
      '懂得開源（賺取獎勵）、節流（克制衝動）、儲蓄與投資，你將受用一生！',
      '未來的世界需要像你這樣懂財務、有自制力的優秀領袖！',
      '金羽閃耀，你的理財冒險已經寫下了傳奇的一頁！',
    ],
  },
];

export function getUnlockedPets(currentBalance: number): VirtualPet[] {
  return PET_ROSTER.filter(p => currentBalance >= p.unlockedThreshold);
}

export function getNextPetToUnlock(currentBalance: number): { pet: VirtualPet; needed: number } | null {
  const lockedPets = PET_ROSTER.filter(p => currentBalance < p.unlockedThreshold);
  if (lockedPets.length === 0) return null;
  const nextPet = lockedPets[0];
  return {
    pet: nextPet,
    needed: nextPet.unlockedThreshold - currentBalance,
  };
}
