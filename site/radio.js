(function (scope) {
  const weeks = [
    { name: '華語經典', tracks: [
      ['bu7nU9Mhpyo', '告白氣球', '周杰倫'],
      ['T4SimnaiktU', '光年之外', 'G.E.M. 鄧紫棋'],
      ['xWzlwGVQ6_Q', '那些年', '胡夏'],
      ['_sQSXwdtxlY', '小幸運', '田馥甄'],
      ['DYptgVvkVLQ', '晴天', '周杰倫'],
      ['sHD_z90ZKV0', '稻香', '周杰倫'],
      ['Bbp9ZaJD_eA', '七里香', '周杰倫'],
      ['KSSyJwlijAc', '修煉愛情', '林俊傑'],
      ['sRoEQFbYzAk', 'Last Dance（透南風 Live）', '伍佰 & China Blue']
    ] },
    { name: '日系旋律', tracks: [
      ['x8VYWazR5mE', '夜に駆ける', 'YOASOBI'],
      ['ZRtdQ81jPUQ', 'アイドル', 'YOASOBI'],
      ['SX_ViT4Ra7k', 'Lemon', '米津玄師'],
      ['PDSkFeMVNFs', '打上花火', 'DAOKO × 米津玄師'],
      ['Y4nEEZwckuU', '群青', 'YOASOBI'],
      ['dy90tA3TT1c', '怪物', 'YOASOBI'],
      ['M2cckDmNLMI', 'KICK BACK', '米津玄師'],
      ['9aJVr5tTTWk', 'ピースサイン', '米津玄師'],
      ['Qp3b-RXtz4w', 'うっせぇわ', 'Ado']
    ] },
    { name: '流行熱播', tracks: [
      ['kPa7bsKwL-c', 'Die With A Smile', 'Lady Gaga、Bruno Mars'],
      ['b1kbLwvqugk', 'Anti-Hero', 'Taylor Swift'],
      ['4NRXx6U8ABQ', 'Blinding Lights', 'The Weeknd'],
      ['JGwWNGJdvx8', 'Shape of You', 'Ed Sheeran'],
      ['YQHsXMglC9A', 'Hello', 'Adele'],
      ['rYEDA3JcQqw', 'Rolling in the Deep', 'Adele'],
      ['QtXby3twMmI', 'Adventure of a Lifetime', 'Coldplay'],
      ['LjhCEhWiKXk', 'Just the Way You Are', 'Bruno Mars'],
      ['DyDfgMOUjCI', 'bad guy', 'Billie Eilish']
    ] },
    { name: '韓流舞曲', tracks: [
      ['gdZLi9oWNZg', 'Dynamite', 'BTS'],
      ['ioNng23DkIM', 'How You Like That', 'BLACKPINK'],
      ['gQlMMD8auMs', 'Pink Venom', 'BLACKPINK'],
      ['ArmDp-zijuc', 'Super Shy', 'NewJeans'],
      ['MBdVXkSdhwU', 'DNA', 'BTS'],
      ['WMweEpGlu_U', 'Butter', 'BTS'],
      ['IHNzOHi8sJs', 'DDU-DU DDU-DU', 'BLACKPINK'],
      ['Amq-qlqbjYA', "As If It's Your Last", 'BLACKPINK'],
      ['i0p1bmr0EmE', 'What Is Love?', 'TWICE']
    ] }
  ];

  function shuffle(tracks) {
    const shuffled = [...tracks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const catalog = weeks.flatMap(week => week.tracks.map(([id, title, artist]) => ({ id, title, artist })));
  const size = 20;

  function refresh(previous = []) {
    const previousIds = new Set(previous.map(track => track.id));
    const fresh = shuffle(catalog.filter(track => !previousIds.has(track.id)));
    const repeats = shuffle(catalog.filter(track => previousIds.has(track.id)));
    return [...fresh, ...repeats].slice(0, size);
  }

  scope.WeeklyRadio = { catalog, size, refresh };
})(globalThis);
