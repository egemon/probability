const strategiesArr = [];
const DIMENSION = 2;
// const VALUES = [0 , 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // array no less values then DIMENSION
const PROBABILITY_PRECISION = 0.1;
const PLAYER_AMOUNT = 3;
const PRESENT_PRICE = 10;

function createValues(VALUE_STEP, DIMENSION) {
  const VALUES = [];
  for (var i = 0; i < DIMENSION; i+=VALUE_STEP) {
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
  strategiesArr.forEach((mixedStrategy1) => {
    strategiesArr.forEach((mixedStrategy2) => {
      strategiesArr.forEach((mixedStrategy3) => {
        const strategySet = [mixedStrategy1, mixedStrategy2, mixedStrategy3];
        if (isSetOptimal(strategySet)) {
          optimalStrategies.push(strategySet);
        }
      });
    });
  });
  return optimalStrategies;
}

function isSetOptimal(strategySet) {
  return isStrategyOptimalForPlayer(0, strategySet) &&
   isStrategyOptimalForPlayer(1, strategySet) &&
   isStrategyOptimalForPlayer(2, strategySet);
}

function isStrategyOptimalForPlayer(playerNumber, strategySet) {
  const playerStrategy = strategySet[playerNumber];
  const indexOfPositiveProbability = playerStrategy.findIndex(probability => probability > 0);
  const pureStrategy = getPureStrategy(indexOfPositiveProbability);
  const testSet = strategySet.map((strategy, i) => i === playerNumber ? pureStrategy : strategy);
  const strategyExpectedPayof = getExpectedPlayerPayof(playerNumber, testSet);
  playerStrategy.forEach((probability, index) => {
    const currentPureStrategy = getPureStrategy(index);
    const currentTestSet = strategySet.map((strategy, i) => i === playerNumber ? currentPureStrategy : strategy);
    const pureStrategyExpectedPayof = getExpectedPlayerPayof(playerNumber, currentTestSet);
    if ((probability && !isEqual(pureStrategyExpectedPayof, strategyExpectedPayof)) ||
        !probability && moreThan(pureStrategyExpectedPayof, strategyExpectedPayof)) {
        return false;
    }
  });
  return true;
}

function getPureStrategy(index) {
  const arr = (new Array(DIMENSION)).fill(0);
  arr[index] = 1;
  return arr;
}

function isEqual(a, b) {
  return a === b;
}

function moreThan(a, b) {
  return a > b;
}

function getExpectedPlayerPayof(playerNumber, testSet) {
  let expectedPlayerPayof = 0;
  testSet[0].forEach((probability0, index0) => {
    testSet[1].forEach((probability1, index1) => {
      testSet[2].forEach((probability2, index2) => {
        const caseProbability = probability0 * probability1 * probability2;
        if (caseProbability) { //in case it is unreal - skip case
          const casePlayerPayoff = getPayofsForAll([VALUES[index0], VALUES[index1], VALUES[index2]])[playerNumber];
          expectedPlayerPayof += casePlayerPayoff * caseProbability;
        }
      });
    });
  });
  return expectedPlayerPayof;
}

function getPayofsForAll(values) {
  const max = Math.max(...values);
  const winner = values.indexOf(max);
  // here should be logic in case of equal payments
  switch(winner) {
    case 0:
      return [PRESENT_PRICE - values[0],2 ,-5];
    case 1:
      return [-5, PRESENT_PRICE - values[1], 3];
    case 2:
      return [1, -5, PRESENT_PRICE - values[2]];
  }
}
fillStartArray(DIMENSION, PROBABILITY_PRECISION, strategiesArr, 1, []);
console.log(strategiesArr);
const optimal = findOptimalStrategiesSet(strategiesArr);
console.log(optimal);