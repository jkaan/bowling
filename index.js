import R from 'ramda';

export const addSecondRoll = R.add;
export const isStrike = R.equals(10);
export const isSpare = R.compose(R.equals(10), R.add);
export const isFrameE   nded = R.equals(10);
export const firstRoll = R.curry((firstPinsKnocked, secondPinsKnocked) => ({
    score: R.add(firstPinsKnocked, secondPinsKnocked),
    firstRollScore: firstPinsKnocked,
    secondRollScore: secondPinsKnocked,
    isSpare: !isStrike(firstPinsKnocked) && isSpare(firstPinsKnocked, secondPinsKnocked),
    isStrike: isStrike(firstPinsKnocked)
}));
const double = R.multiply(2);
export const addFrame = R.curry((game, frame) => {
    let calculateScore = R.add(game.score, frame.score);
    if (game.isSpare) {
        calculateScore = [game.score, double(frame.firstRollScore), frame.secondRollScore].reduce(R.add);
    }

    if (game.isStrike) {
        calculateScore = R.add(game.score, double(frame.score));
    }
    return {
        score: calculateScore,
        isStrike: frame.isStrike,
        isSpare: frame.isSpare
    };
});
const addFrameScore = (acc, frame, index) => {
    if (index + 1 === 10) {
        return addFrame(acc, frame).score;
    }
    return addFrame(acc, frame);
};

const reduce = R.curry((callback, array) => array.reduce(callback));

export const game = reduce(addFrameScore);


/*
(1pins) -=> {
    if (isStrike(pins)) {
        return () => {
            return {
                score: 10,
                isStrike: true
            };
        }
    }
    return (2pins) => {
        if (isSpare(2pins)) {
            return {
                score: 1pins +2pins,
                isSpare: true
            }
        }
        return {
            score: 1pins +2pins
        }
    }
}
*/
