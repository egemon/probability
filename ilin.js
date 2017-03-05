const strategiesArr = [];
const DIMENSION = 2;
const PROBABILITY_PRECISION = 0.1;
const PLAYER_AMOUNT = 3;

function getStrategyExpenses (strategy) {
  return  strategy.reduce((prev, cur, i) => {
    // here i means 0,1,2...N $
    return prev + cur*i;
  }, 0);
}

function getPureStrategies(dimension) {
  return (new Array(dimension)).fill(0).map((val, index) => {
    const arr = new Array(dimension).fill(0);
    arr[index] = 1;

    return arr;
  })
}
const pureStrategies = getPureStrategies(DIMENSION);


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
fillStartArray(DIMENSION, PROBABILITY_PRECISION, strategiesArr, 1, []);
// console.log(strategiesArr);

function getExpectedProfitForPlayer(playerNumber, strategies) {
  const playerExpenses = getStrategyExpenses(strategies.slice(playerNumber, playerNumber+1)[0]);
  const otherExpenses = strategies.reduce((prev, cur, i) => {
    if (i === playerNumber) return prev;
    return prev + getStrategyExpenses(cur);
  }, 0);
  return (otherExpenses + 0.1 * PLAYER_AMOUNT)/ (playerExpenses+0.1);
}



function isGoodStrategyFor(playerNumber, mixedStrategy, playerAmount, strategies, expectedProfits) {
  if (strategies.length <= playerAmount) {
    if (playerNumber === strategies.length) {
      strategies.push(mixedStrategy);
      isGoodStrategyFor(playerNumber, mixedStrategy, playerAmount-1, strategies, expectedProfits);
      strategies.length--;
    } else {
      pureStrategies.forEach((pureStrategy) => {
        strategies.push(pureStrategy);
        isGoodStrategyFor(playerNumber, mixedStrategy, playerAmount-1, strategies, expectedProfits);
        strategies.length--;
      });
    }
  } else {
    strategiesList.push(strategies);
    expectedProfits.push(getExpectedProfitForPlayer(playerNumber, strategies));
  }
}
const profits = [];
const strategiesList = [];
function getListOfGoodStrategies(palyerAmount, strategiesArr) {
  (new Array(palyerAmount)).fill(0).map((val, i) => i).forEach((playerNumber) => {
    //dont know what to do if good??
    strategiesArr.forEach((mixedStrategy) => {
      let expectedProfits = [];
      isGoodStrategyFor(playerNumber, mixedStrategy, palyerAmount, [], expectedProfits);
      profits.push(expectedProfits);
    });
  });
}

getListOfGoodStrategies(PLAYER_AMOUNT, strategiesArr);
console.log('profits', profits);
console.log('strategiesList', strategiesList);