import {
  buttonSpacing,
  divSpacing,
  level,
  gridSize,
  viewRadius,
  levels,
  gravityUp,
  gravityDown,
  gravityLeft,
  gravityRight,
  air,
  barrier,
  finish,
  ice,
  kill,
  numberToImage,
  numberToIsTransparent,
  numberToString,
  stringToNumber,
  player,
  unknown
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
  * @param player {Player} - player object with position [x, y]
  * @return {string[][]} - view centered around player
  */
function convertSceneSpaceToPlayerSpace(viewRadius, visibleScene, playerPosition) {
  let transformedArray = [];
  const viewSize = viewRadius * 2 + 1;
  
  for (let i = 0; i < viewSize; i++) {
    transformedArray.push([]);
    for (let j = 0; j < viewSize; j++) {
      const worldRow = playerPosition[0] - viewRadius + i;
      const worldCol = playerPosition[1] - viewRadius + j;
      
      if (worldRow >= 0 && worldRow < visibleScene.length && 
          worldCol >= 0 && worldCol < visibleScene[0].length) {
        transformedArray[i][j] = visibleScene[worldRow][worldCol];
      }
    }
  }
  
  return transformedArray;
}
// check if logic is correct

document.addEventListener("DOMContentLoaded", function () {
  let canvas = document.getElementById("canvas1");
  let canvas2 = document.getElementById("canvas2");

  let data = document.getElementById("data");
  let errors = document.getElementById("errors");

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

window.innerWidth < 1070 ? data.innerHTML = `<span class='emoji'>⚠</span>screen too small<span class='emoji'>⚠</span>` : data.innerText = '';

  window.addEventListener("resize", () => {
    button.style.width = `${window.innerWidth / 3 - buttonSpacing * 2}px`;

    window.innerWidth < 1070 ? data.innerHTML = `<span class='emoji'>⚠</span>screen too small<span class='emoji'>⚠</span>` : data.innerText = '';
  });
});


/**
 * @param playerPosition {number[]} [i,j]
 * @param previousPlayerPosition {numner[]} [i,j]
 * @param playerFunction {string}
 * @param scene {string[][]}
 * @return scene {string[][]}
 */
function updatePlayer(playerPosition, viewRadius, previousPlayerInput, playerFunction, visibleScene, scene, cachedData) {
  let isInAir = false;
  let appliedPlayerFunction = JSON.parse(playerFunction);
  let response = appliedPlayerFunction(visibleScene, cachedData);
  let canApplyResponse = true;

  let centerX = Math.floor(visibleScene.length / 2);
  let centerY = Math.floor(visibleScene[0].length / 2);

  const cellAbove = centerY > 0 ? visibleScene[centerY - 1][centerX] : 'b';
	const cellRight = centerX < visibleScene[0].length - 1 ? visibleScene[centerY][centerX + 1] : 'b';
	const cellsBelow = [];
	const cellLeft = centerX > 0 ? visibleScene[centerY][centerX - 1] : 'b';

  const cellTopLeft = (centerY > 0 && centerX > 0) ? visibleScene[centerY - 1][centerX - 1] : 'b';
  const cellTopRight = (centerY > 0 && centerX < visibleScene[0].length - 1) ? visibleScene[centerY - 1][centerX + 1] : 'b';
  const cellBottomLeft = (centerY < visibleScene.length - 1 && centerX > 0) ? visibleScene[centerY + 1][centerX - 1] : 'b';
  const cellBottomRight = (centerY < visibleScene.length - 1 && centerX < visibleScene[0].length - 1) ?  visibleScene[centerY + 1][centerX + 1] : 'b';

  for (let i = 0; i < (viewRadius * 2 + 1); i++) { // probably inneficient but who cares
    let cellBelow = centerY < visibleScene.length - i /*is this 1 or i?*/ ? visibleScene[centerY + i][centerX] : 'b'; // also might be wrong probably check
    if (cellBelow == 'a') {
      cellsBelow.push('a');
    }
    else {
      break;
    }
  }

  if (cellsBelow[0].length > 0) {
    if (cellBottomLeft !== 'a' && response == 2) {isInAir = false} else {
    if (cellBottomRight !== 'a' && response == 3) {isInAir = false} else {
      scene[playerPosition[0]][playerPosition[1]] = 'a';
      scene[playerPosition[0] + cellsBelow.length][playerPosition[1]] = 'p';
      isInAir = true;
      playerPosition = [playerPosition[0] + cellsBelow.length, playerPosition[1]];
    }}
  }

  if (response.response == 1 && cellRight == 'a') {
    scene[playerPosition[0]][playerPosition[1]] = 'a';
    scene[playerPosition[0]][playerPosition[1] + 1] == 'p';
    return ['complete', scene]
  }

  if (response.response == 0) {
    if (isInAir == true) {return ['complete', scene]}
    if (cellAbove == 'a') {
      cellAbove = 'p';
      //
      //scene[]
    } // incomplete
  }

  return 'incomplete'
}

class GameState {
  constructor() {
    this.level = levels[0];
    //this.playerPosition = 
  }
}