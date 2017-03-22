const strategiesArr = [];
const DIMENSION = 3;
const VALUES = ['stone', 'paper', '``scirsus``']; // array no less values then DIMENSION
const PROBABILITY_PRECISION = 0.1;
const PLAYER_AMOUNT = 3;
const PRESENT_PRICE = 10;
const EPSILON = 0.1;
function createValues(VALUE_STEP, DIMENSION) {
  const VALUES = [];
  for (let i = 0; i < DIMENSION; i+=VALUE_STEP) {
    VALUES.push();
  }
  return
}


function fillStartArray(vectorLength, propStep, strategiesArr, topProp, currentStrategy) {
  if(currentStrategy.length < vectorLength - 1) {
    for(let q = 0; q<=topProp ; q += propStep) {
      currentStrategy.push(q);
      fillStartArray(vectorLength, propStep, strategiesArr, topProp - q, currentStrategy);
      currentStrategy.length = currentStrategy.length - 1;
    }
  } else {
    currentStrategy.push(1 - _.sum(currentStrategy));
    strategiesArr.push([...currentStrategy]);
    currentStrategy.length = currentStrategy.length - 1;
  }
}


function findOptimalStrategiesSet(strategiesArr) {
  let optimalStrategies = [];
  // remove all equal strategies for unoptimal
    // find all pure maximum strategies
    for (let j = 0; j++; j < strategiesArr.length) {
      for (let k = 0; k++; k < strategiesArr.length) {
        // let mixedStrategy1 = strategiesArr[i];
        let mixedStrategy2 = strategiesArr[j];
        let mixedStrategy3 = strategiesArr[k];
        const goodPureStrategies = getGoodPureStrategiesForPlayer(0, [null, mixedStrategy2, mixedStrategy3]);
        const mixedStrategies

        const strategySet = [mixedStrategy1, mixedStrategy2, mixedStrategy3];
        if (isStrategyOptimalForPlayer(0, strategySet) &&
          isStrategyOptimalForPlayer(1, strategySet) &&
          isStrategyOptimalForPlayer(2, strategySet)) {
          optimalStrategies.push(strategySet);
        }
      }
    }

  return optimalStrategies;
}

function getGoodPureStrategiesForPlayer(playerNumber, strategySet) {

}

function isSetOptimal(strategySet) {
  return isStrategyOptimalForPlayer(0, strategySet) &&
   isStrategyOptimalForPlayer(1, strategySet) &&
   isStrategyOptimalForPlayer(2, strategySet);
}

function isStrategyOptimalForPlayer(playerNumber, strategySet) {
  const playerStrategy = strategySet[playerNumber];
  const indexOfPositiveProbability = playerStrategy.findIndex(probability => probability > 0);
  const strategyExpectedPayof = getPayoffOfPureStrategy(playerNumber, indexOfPositiveProbability, strategySet);

    for (let index = 0; index < playerStrategy.length; index++) {
      let probability = playerStrategy[index];
      const pureStrategyExpectedPayof = getPayoffOfPureStrategy(playerNumber, index, strategySet);
      if ((probability && !isEqual(pureStrategyExpectedPayof, strategyExpectedPayof)) ||
          !probability && moreThan(pureStrategyExpectedPayof, strategyExpectedPayof)) {
          return false;
      }
    }

  return true;
}

function getPayoffOfPureStrategy(playerNumber, indexOfPure, strategySet) {
  const currentPureStrategy = getPureStrategy(indexOfPure);
  const currentTestSet = strategySet.map((strategy, i) => i === playerNumber ? currentPureStrategy : strategy);
  return getExpectedPlayerPayof(playerNumber, currentTestSet);
}


function getPureStrategy(index) {
  const arr = (new Array(DIMENSION)).fill(0);
  arr[index] = 1;
  return arr;
}

function isEqual(a, b) {
  return Math.abs(a - b) < EPSILON;
}

function moreThan(a, b) {
  return a - b > EPSILON;
}

function getExpectedPlayerPayof(playerNumber, testSet) {
  let expectedPlayerPayof = 0;
  testSet[0].forEach((probability0, index0) => {
    testSet[1].forEach((probability1, index1) => {
      testSet[2].forEach((probability2, index2) => {
        const caseProbability = probability0 * probability1 * probability2;
        if (caseProbability) { //in case it is unreal - skip case
          const casePlayerPayoff = getPayofsForAll([index0, index1, index2])[playerNumber];
          expectedPlayerPayof += casePlayerPayoff * caseProbability;
        }
      });
    });
  });
  return expectedPlayerPayof;
}

// function getPayofsForAll(indexes) {
//   const values = [VALUES[indexes[0]], VALUES[indexes[1]], VALUES[indexes[2]]];
//   const max = Math.max(...values);
//   const winner = values.indexOf(max);
//   // here should be logic in case of equal payments
//   switch(winner) {
//     case 0:
//       return [PRESENT_PRICE - values[0],2 ,-5];
//     case 1:
//       return [-5, PRESENT_PRICE - values[1], 3];
//     case 2:
//       return [1, -5, PRESENT_PRICE - values[2]];
//   }
// }
// const VALUES = ['stone', 'paper', '``scirsus``']; // array no less values then DIMENSION

function getPayofsForAll(indexes) {
  const values = [VALUES[indexes[0]], VALUES[indexes[1]], VALUES[indexes[2]]];
  const thatCase = values[0] + '_' + values[1];
  if (thatCase === 'stone_paper' || thatCase === 'paper_``scirsus``' || thatCase === '``scirsus``_stone') {
    return [-1, 1, 0];
  } else if (thatCase === 'stone_stone'  || thatCase === 'paper_paper' || thatCase === '``scirsus``_``scirsus``') {
    return [0, 0, 0];
  } else {
    return [1, -1, 0];
  }
}


fillStartArray(DIMENSION, PROBABILITY_PRECISION, strategiesArr, 1, []);
console.log(strategiesArr);
// const optimal = findOptimalStrategiesSet(strategiesArr);
// console.log(optimal);
