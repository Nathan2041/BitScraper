/**
 * @param position {number[]}
 * @param gravityDIrection {number}
 */
class Player {
    constructor(position, gravityDirection = 2) {
      this.position = position;
      this.gravityDirection = gravityDirection;
    } 
  }
  
  /**
   * @class Scene
   * @param scene {string[][]}
   * @param player {Player}
   * @param stringToNumber {object}
   * @param numberToIsTransparent {object}
   * @param maxDistance {number}
   */
  class Scene {
    constructor(scene, player, stringToNumber, numberToIsTransparent, maxDistance) {
      this.scene = scene;
      this.visibleScene = [];
      this.player = player;
      this.stringToNumber = stringToNumber;
      this.numberToIsTransparent = numberToIsTransparent;
      this.maxDistance = maxDistance;
    }
  
    /**
     * @return {string[][]}
     */
    updateVisibleScene() {
      for (let i = 0; i < this.scene.length; i++) {
        this.visibleScene.push([]);
        for (let j = 0; j < this.scene[i].length; j++) {
          if (
            isVisible(
              [i][j], // might be swapped
              this.scene,
              stringToNumber,
              numberToIsTransparent,
              maxDistance
            )
          ) {
            this.visibleScene[i].push(this.scene[i,j]);
          }
          else {
            this.visibleScene[i].push('u');
          }
        }
      }
    }
  }
  
  /**
   * @param viewRadius {number}
   * @param visibleScene {string[][]}
   * @param player {Player}
   * @return {string[][]}
   */
  function convertSceneSpaceToPlayerSpace(viewRadius, visibleScene, player) {
    let transformedArray = [];
    for (let i = 0; i < viewRadius * 2 + 1; i++) {
        transformedArray.push([]);
        for (let j = 0; j < viewRadius * 2 + 1; j++) {
            let coordinates = [player.position[0] + i, playerPosition[1] + j]; // might be flipped or negated
            let isInBox = 
        }
    }
    
    return transformedArray
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /**
   * Determines if a cell at the given indices is visible based on line of sight
   * @param {number[]} toIndex - The [y, x] coordinates of the target cell
   * @param {string[][]} scene - The 2D scene array
   * @param {Object} stringToNumber - Mapping of string representations to number values
   * @param {Object} numberToIsTransparent - Mapping of number values to boolean transparency
   * @param {number} maxDistance - Maximum visible distance (optional)
   * @return {boolean} - Whether the cell is visible
   */
  function isVisible(toIndex, scene, stringToNumber, numberToIsTransparent, maxDistance = Infinity) {
    let fromIndex = findIndices(scene, 'p', 'NULL')[0];
    if (fromIndex[0] === toIndex[0] && fromIndex[1] === toIndex[1]) { return true }
    const distance = Math.sqrt(
      Math.pow(toIndex[0] - fromIndex[0], 2) + 
      Math.pow(toIndex[1] - fromIndex[1], 2)
    );
  
    if (distance > maxDistance) { return false }
  
    const steps = Math.max(
        Math.abs(toIndex[0] - fromIndex[0]), 
        Math.abs(toIndex[1] - fromIndex[1])
    ) * 10;
  
    for (let i = 1; i < steps; i++) {
      const ratio = i / steps;
      const y = fromIndex[0] + (toIndex[0] - fromIndex[0]) * ratio;
      const x = fromIndex[1] + (toIndex[1] - fromIndex[1]) * ratio;
      const gridY = Math.floor(y);
      const gridX = Math.floor(x);
      if ((gridY === fromIndex[0] && gridX === fromIndex[1]) || 
        (gridY === toIndex[0] && gridX === toIndex[1])) { continue }
      if (gridY < 0 || gridY >= scene.length || gridX < 0 || gridX >= scene[0].length) { return false }
      const cellType = scene[gridY][gridX];
      const cellNumber = stringToNumber[cellType];
      const isTransparent = numberToIsTransparent[cellNumber];
      if (!isTransparent) { return false }
    }
  
    return true
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
    return transformedScene
  }
  
  /**
  * @param scene1 {number[][] | string[][]}
  * @param gType {string}
  * @param numberToString {object}
  */
  function findIndices(scene1, gType, numberToString = 'NULL') {
      let scene = scene1;
      if (numberToString !== 'NULL') { scene = transformScene(scene1, numberToString); }
      let indices = [];
      for (let i = 0; i < scene.length; i++) {
        for (let j = 0; j < scene[0].length; j++) {
          if (scene[i][j] == gType) { indices.push([i, j]); }
        }
      }
    return indices
  }