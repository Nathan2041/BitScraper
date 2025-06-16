import {
  buttonSpacing,
  divSpacing,
  level,
  gridSize,
  viewRadius,
  levels,
  numberToImage,
  numberToIsTransparent,
  numberToString,
  stringToNumber
} from "./vars.js";

/**
 * Determines if a cell at the given indices is visible based on line of sight
 * @param {number[]} toIndex - The [y, x] coordinates of the target cell
 * @param {string[][]} scene - The 2D scene array
 * @param {Object} stringToNumber - Mapping of string representations to number values
 * @param {Object} numberToIsTransparent - Mapping of number values to boolean transparency
 * @param {number} maxDistance - Maximum visible distance (optional)
 * @return {boolean} - Whether the cell is visible
 */
function isVisible(
  toIndex,
  scene,
  stringToNumber,
  numberToIsTransparent,
  maxDistance = Infinity
) {
  let fromIndex = findIndices(scene, "p", "NULL")[0];
  if (fromIndex[0] === toIndex[0] && fromIndex[1] === toIndex[1]) {
    return true;
  }
  const distance = Math.sqrt(
    Math.pow(toIndex[0] - fromIndex[0], 2) +
      Math.pow(toIndex[1] - fromIndex[1], 2)
  );

  if (distance > maxDistance) {
    return false;
  }

  const steps =
    Math.max(
      Math.abs(toIndex[0] - fromIndex[0]),
      Math.abs(toIndex[1] - fromIndex[1])
    ) * 10;

  for (let i = 1; i < steps; i++) {
    const ratio = i / steps;
    const y = fromIndex[0] + (toIndex[0] - fromIndex[0]) * ratio;
    const x = fromIndex[1] + (toIndex[1] - fromIndex[1]) * ratio;
    const gridY = Math.floor(y);
    const gridX = Math.floor(x);
    if (
      (gridY === fromIndex[0] && gridX === fromIndex[1]) ||
      (gridY === toIndex[0] && gridX === toIndex[1])
    ) {
      continue;
    }
    if (
      gridY < 0 ||
      gridY >= scene.length ||
      gridX < 0 ||
      gridX >= scene[0].length
    ) {
      return false;
    }
    const cellType = scene[gridY][gridX];
    const cellNumber = stringToNumber[cellType];
    const isTransparent = numberToIsTransparent[cellNumber];
    if (!isTransparent) {
      return false;
    }
  }

  return true;
}

/**
 * @param scene1 {number[][] | string[][]}
 * @param gType {string}
 * @param numberToString {object}
 */
function findIndices(scene1, gType, numberToString = "NULL") {
  let scene = scene1;
  if (numberToString !== "NULL") {
    scene = transformScene(scene1, numberToString);
  }
  let indices = [];
  for (let i = 0; i < scene.length; i++) {
    for (let j = 0; j < scene[0].length; j++) {
      if (scene[i][j] == gType) {
        indices.push([i, j]);
      }
    }
  }
  return indices;
}

function transformScene(scene, transformation) {
  let transformedScene = [];
  for (let i = 0; i < scene.length; i++) {
    transformedScene.push([]);
    for (let j = 0; j < scene[0].length; j++) {
      let transformed = transformation[scene[i][j]];
      transformedScene[i].push(transformed);
    }
  }
  return transformedScene;
}

function drawImage(ctx, gridSize, x, y, url) {
  x *= gridSize;
  y *= gridSize;

  let image = new Image();
  image.src = url;

  image.addEventListener("load", () => {
    ctx.drawImage(image, x, y, gridSize, gridSize);
  });
}

function drawScene(scene, ctx, gridSize, stringToNumber, numberToImage) {
  let newScene = transformSceneToImage(scene, stringToNumber, numberToImage);
  for (let i = 0; i < newScene.length; i++) {
    for (let j = 0; j < newScene[0].length; j++) {
      drawImage(ctx, gridSize, j, i, newScene[i][j]);
    }
  }
}

function transformSceneToImage(scene, stringToNumber, numberToImage) {
  let transformedScene = [];
  for (let i = 0; i < scene.length; i++) {
    transformedScene.push([]);
    for (let j = 0; j < scene[0].length; j++) {
      let number = stringToNumber[scene[i][j]];
      let image = numberToImage[number];
      transformedScene[i].push(image);
    }
  }
  return transformedScene;
}

function drawVisibility(
  ctx,
  scene,
  maxDistance,
  stringToNumber,
  numberToIsTransparent,
  numberToImage,
  gridSize
) {
  let newScene = transformSceneToImage(scene, stringToNumber, numberToImage);
  for (let i = 0; i < scene.length; i++) {
    for (let j = 0; j < scene[i].length; j++) {
      if (
        isVisible(
          [i, j],
          scene,
          stringToNumber,
          numberToIsTransparent,
          maxDistance
        )
      ) {
        drawImage(ctx, gridSize, j, i, newScene[i][j]);
      }
    }
  }
}

/**
  * @param viewRadius {number} - radius around player (u)
  * @param visibleScene {string[][]} - the full scene/map
  * @param playerPosition {number[]} - player position [x, y]
  * @return {string[][]} - view centered around player
  */
function convertToPlayerView(viewRadius, visibleScene, playerPosition) {
  const transformedArray = [];
  const viewSize = viewRadius * 2 + 1;
  
  for (let i = 0; i < viewSize; i++) {
    const row = [];
    for (let j = 0; j < viewSize; j++) {
      const worldRow = playerPosition[0] - viewRadius + i;
      const worldCol = playerPosition[1] - viewRadius + j;
      
      if (worldRow >= 0 && worldRow < visibleScene.length && 
          worldCol >= 0 && worldCol < visibleScene[0].length) {
        row[j] = visibleScene[worldRow][worldCol];
      } else {
        row[j] = 'u'; // Fill out-of-bounds with 'u'
      }
    }
    transformedArray[i] = row;
  }
  
  return transformedArray;
}

function sceneToVisibleScene(
  scene,
  viewRadius,
  stringToNumber,
  numberToIsTransparent
) {
  let visibleScene = scene;
  
  for (let i = 0; i < scene.length; i++) {
    visibleScene[i] = [];
    for (let j = 0; j < scene[i].length; j++) {
      if (
        !(isVisible(
          [i, j],
          scene,
          stringToNumber,
          numberToIsTransparent,
          viewRadius
        ))
      ) {
        visibleScene[i][j] = 'u';
      }
    }
  }
  
  return visibleScene;
}

// check if logic is correct

document.addEventListener("DOMContentLoaded", function () {
  let canvas = document.getElementById("canvas1");
  let canvas2 = document.getElementById("canvas2");

  let data = document.getElementById("data");
  let errors = document.getElementById("errors");
  let code = document.getElementById('code');

  let div1 = document.querySelector(".div1");
  let div2 = document.querySelector(".div2");
  let button = document.getElementById("button");

  let ctx = canvas.getContext("2d");
  let ctx2 = canvas2.getContext("2d");
  let dataArray = [];
  let errorsArray = [];

  let gridWidth = levels[level][0].length;
  let gridHeight = levels[level].length;

  canvas.width = gridWidth * gridSize;
  canvas.height = gridHeight * gridSize;

  canvas2.width = gridWidth * gridSize;
  canvas2.height = gridHeight * gridSize;

  button.style.width = `${window.innerWidth / 3 - buttonSpacing * 2}px`;
  button.style.marginLeft = `${buttonSpacing - 8}px`;

  drawScene(levels[level], ctx, gridSize, stringToNumber, numberToImage);
  drawVisibility(
    ctx2,
    levels[level],
    viewRadius,
    stringToNumber,
    numberToIsTransparent,
    numberToImage,
    gridSize
  );

  let isFirstRun = true;
  let previousPlayerInput = 'invalid';
  let cachedData = null;

  document.addEventListener('trigger', () => { // need actual trigger
    let visibleScene = sceneToVisibleScene(GameState.scene, viewRadius, stringToNumber, numberToIsTransparent);
    let newData = updatePlayer(
      isFirstRun,
      GameState.playerPosition,
      viewRadius,
      previousPlayerInput,
      code.value, visibleScene,
      GameState.scene,
      cachedData,
      GameState.gravity
    );
  
    GameState.scene = newData.scene;

    drawScene(GameState.scene, ctx, gridSize, stringToNumber, numberToImage);
    drawVisibility(
      ctx2,
      GameState.scene,
      viewRadius,
      stringToNumber,
      numberToIsTransparent,
      numberToImage,
      gridSize
    );

    isFirstRun ? isFirstRun = false : console.log('not first run');
    cachedData = newData.cachedData;

  });

  window.innerWidth < 1070 ? data.innerHTML = `<span class='emoji'>⚠</span>screen too small<span class='emoji'>⚠</span>` : data.innerText = '';

  window.addEventListener("resize", () => {
    button.style.width = `${window.innerWidth / 3 - buttonSpacing * 2}px`;

    window.innerWidth < 1070 ? data.innerHTML = `<span class='emoji'>⚠</span>screen too small<span class='emoji'>⚠</span>` : data.innerText = '';
  });
});


/**
 * @param isFirstRun {boolean}
 * @param playerPosition {number[]} [i,j]
 * @param previousPlayerPosition {number[]} [i,j]
 * @param playerFunction {string}
 * @param scene {string[][]}
 * @return response {{scene: string[][], cachedData:any, previousInput:number, gravity:number}}
 */
function updatePlayerGravity2(isFirstRun, playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData) {
  let appliedPlayerFunction = JSON.parse(playerFunction);
  let response = appliedPlayerFunction(visibleScene, cachedData);
  let partialReturn = 'unset';
  let isResponseDone = false;

  let playerI = playerPosition[0];
  let playerJ = playerPosition[1];

  let cellUpPosition = [playerI - 1, playerJ];
  let cellDownPosition = [playerI + 1, playerJ];
  let cellRightPosition = [playerI, playerJ + 1];
  let cellLeftPosition = [playerI, playerJ - 1];
  let cellBottomLeftPosition = [playerI + 1, playerJ - 1];
  let cellBottomRightPosition = [playerI + 1, playerJ + 1];

  let cellUp = scene[cellUpPosition[0]][cellUpPosition[1]];
  let cellDown = scene[cellDownPosition[0]][cellDownPosition[1]];
  let cellRight = scene[cellRightPosition[0]][cellRightPosition[1]];
  let cellLeft = scene[cellLeftPosition[0]][cellLeftPosition[1]];
  let cellBottomLeft = scene[cellBottomLeftPosition[0]][cellBottomLeftPosition[1]];
  let cellBottomRight = scene[cellBottomRightPosition[0]][cellBottomRightPosition[1]];

  if (cellBottomLeft !== 'a' && response.response == 3) {
    scene[cellLeftPosition[0]][cellLeftPosition[1]] = 'p';
    scene[playerI][playerJ] = 'a';
    let gravityNumber = gravityToNumber(cellBottomLeft);
    (gravityNumber = gravityNumber == 4 ? 2 : gravityNumber);
    partialReturn = {scene: scene, cachedData: response.cachedData, previousPlayerInput: response.response, gravity: gravityNumber};
    isResponseDone = true;
  }

  if (cellBottomRight !== 'a' && response.response == 1) {
    scene[cellRightPosition[0]][cellRightPosition[1]] = 'p';
    scene[playerI][playerJ] = 'a';
    let gravityNumber = gravityToNumber(cellBottomRight);
    gravityNumber = (gravityNumber == 4 ? 2 : gravityNumber);
    partialReturn = {scene: scene, cachedData: response.cachedData, previousPlayerInput: response.response, gravity: gravityNumber};
    isResponseDone = true;
  }

  if (cellRight == 'a' && response.response == 1 && isResponseDone == false) {
    scene[cellRightPosition[0]][cellRightPosition[1]] = 'p';
    scene[playerI][playerJ] = 'a';
    let gravityNumber = gravityToNumber(cellBottomRight);
    gravityNumber = (gravityNumber == 4 ? 2 : gravityNumber);
    partialReturn = {scene: scene, cachedData: response.cachedData, previousPlayerInput: response.response, gravity: gravityNumber};
    isResponseDone = true;
  }

  if (cellLeft == 'a' && response.response == 3 && isResponseDone == false) {
    scene[cellLeftPosition[0]][cellLeftPosition[1]] = 'p';
    scene[playerI][playerJ] = 'a';
    let gravityNumber = gravityToNumber(cellBottomLeft);
    gravityNumber = (gravityNumber == 4 ? 2 : gravityNumber);
    partialReturn = {scene: scene, cachedData: response.cachedData, previousPlayerInput: response.response, gravity: gravityNumber};
    isResponseDone = true;
  }

  return 'incomplete'
}

function updatePlayerGravity0 (isFirstRun, playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData) {}
function updatePlayerGravity1 (isFirstRun, playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData) {}
function updatePlayerGravity3 (isFirstRun, playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData) {}

function gravityToNumber(cell) {
  if (cell == 'g↑') {return 0}
  if (cell == 'g→') {return 1}
  if (cell == 'g↓') {return 2}
  if (cell == 'g←') {return 3}
  return 4
}

function updatePlayer(isFirstRun, playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData, gravity) {
  if (gravity == 2) {return updatePlayerGravity2(isFirstRun, playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData)}
  if (gravity == 0) {return updatePlayerGravity0(isFirstRun, playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData)}
  if (gravity == 1) {return updatePlayerGravity1(isFirstRun, playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData)}
  if (gravity == 3) {return updatePlayerGravity3(isFirstRun, playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData)}
  console.log('gravity invalid');
}

/*
g↑ -> 0 gravity up
g→ -> 1 gravity right
g↓ -> 2 gravity down
g← -> 3 gravity left

0 -> up
1 -> right
2 -> down
3 -> left
*/

class GameState {
  constructor() {
    this.level = 0;
    this.scene = levels[0];
    this.playerPosition = this.findPlayer();
    this.gravity = 2;
  }

  findPlayer() {
    let scene = this.scene;
    for (let i = 0; i < scene.length; i++) {
      for (let j = 0; j < scene[0].length; j++) {
        if (scene[i][j] === 'p') { return [i,j] }
      }
    }
    console.log('no player found');
  }

}