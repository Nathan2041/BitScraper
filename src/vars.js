export const level = 0;
export const gridSize = 50;
export const viewRadius = 3;
export const divSpacing = 20;
export const buttonSpacing = 7.5;
export const codeMirrorHeight = '500px';
export const codeMirrorWidth = '600px';
export const levels =  [
  [
    ["b","b","b","b","b","b","b","b","b"], 
    ["b","a","a","a","a","a","a","a","b"], 
    ["b","p","a","a","b","a","a","f","b"], 
    ["b","b","b","b","b","b","b","b","b"]
  ], 
  [
    ["b","b","b","b","b","b","b","b","b"], 
    ["b","a","a","g→","a","a","a","a","b"], 
    ["b","a","a","a","a","a","a","a","b"], 
    ["b","p","a","a","b","a","a","f","b"], 
    ["b","b","b","g↑","b","b","b","b","b"]
  ],
];
export const gravityUp = 'https://i.postimg.cc/J0W1rn6h/Gravity-Up.png';
export const gravityDown = 'https://i.postimg.cc/SQBJtQmj/Gravity-Down.png';
export const gravityRight = 'https://i.postimg.cc/G2ZhNzw6/Gravity-Right.png';
export const gravityLeft = 'https://i.postimg.cc/0yc5x91Y/Gravity-Left.png';
export const air = 'https://i.postimg.cc/Kz9HQcwY/Air.png';
export const barrier = 'https://i.postimg.cc/bwyDQzxM/Barrier.png';
export const kill = 'https://i.postimg.cc/mrxPLD71/Kill.png'; /* fix this one too */
export const ice = 'https://i.postimg.cc/7ZNCwKCz/Ice.png'; /* fix this texture to be hand drawn */
export const finish = 'https://i.postimg.cc/7Y4f4HWL/Finish.png';
export const player = 'https://i.postimg.cc/1tT6SZZm/Player.png';
export const unknown = 'https://i.postimg.cc/kgB4Tvsm/Unknown.png';
export const stringToNumber = {
  'p': 0,
  'u': 1,
  'a': 2,
  'b': 3,
  'k': 4,
  'i': 5,
  'f': 10,
  'g↑': 20,
  'g→': 21,
  'g↓': 22,
  'g←': 23
};
export const numberToString = {
  0: 'p',
  1: 'u',
  2: 'a',
  3: 'b',
  4: 'k',
  5: 'i',
  10: 'f',
  20: 'g↑',
  21: 'g→',
  22: 'g↓',
  23: 'g←'
};
export const numberToImage = {
  20: gravityUp,
  22: gravityDown,
  21: gravityRight,
  23: gravityLeft,
  1: unknown,
  2: air,
  3: barrier,
  4: kill,
  5: ice,
  10: finish,
  0: player
};
export const numberToIsTransparent = {
  2: true,
  3: false,
  4: false,
  5: true,
  10: true,
  20: false,
  21: false,
  22: false,
  23: false
};