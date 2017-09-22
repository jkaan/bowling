import { addSecondRoll, isStrike, isSpare, isFrameEnded, firstRoll, addFrame, game } from '../index';

const FIRST_ROLL_5 = 5;
const FIRST_ROLL_10 = 10;
const SECOND_ROLL_0 = 0;
const SECOND_ROLL_1 = 1;
const SECOND_ROLL_5 = 5;

const IS_STRIKE = true;
const IS_NOT_STRIKE = false;
const IS_SPARE = true;
const IS_NOT_SPARE = false;
const IS_FRAME_ENDED = true;
const IS_FRAME_NOT_ENDED = false;

test('add score to first roll', () => {
    const actual = addSecondRoll(FIRST_ROLL_5, SECOND_ROLL_1);
    expect(actual).toBe(FIRST_ROLL_5 + SECOND_ROLL_1);
});

test('first roll is strike if 10 pins', () => {
    const actual = isStrike(FIRST_ROLL_10);
    expect(actual).toBe(IS_STRIKE);
});

test('first roll is NOT strike if less than 10 pins', () => {
    const actual = isStrike(SECOND_ROLL_1);
    expect(actual).toBe(IS_NOT_STRIKE);
});

test('second roll is spare if first roll combined with second is 10 pins', () => {
    const actual = isSpare(FIRST_ROLL_5, SECOND_ROLL_5);
    expect(actual).toBe(IS_SPARE);
});

test('second roll is NOT spare if first roll combined with second is less than 10 pins', () => {
    const actual = isSpare(FIRST_ROLL_5, SECOND_ROLL_1);
    expect(actual).toBe(IS_NOT_SPARE);
});

test('frame is ended when all 10 pins are knocked down', () => {
    const actual = isFrameEnded(FIRST_ROLL_5 + SECOND_ROLL_5);
    expect(actual).toBe(IS_FRAME_ENDED);
});

test('frame is NOT ended when less than 10 pins are knocked down', () => {
    const actual = isFrameEnded(FIRST_ROLL_5 + SECOND_ROLL_1);
    expect(actual).toBe(IS_FRAME_NOT_ENDED);
});

test('first roll of 5 and second roll of 1 is score of 6', () => {
    const actual = firstRoll(FIRST_ROLL_5)(SECOND_ROLL_1);
    expect(actual).toEqual({
        firstRollScore: FIRST_ROLL_5,
        isSpare: IS_NOT_SPARE,
        isStrike: IS_NOT_STRIKE,
        score: FIRST_ROLL_5 + SECOND_ROLL_1,
        secondRollScore: SECOND_ROLL_1
    });
});

test('first roll of 5 and second roll of 5 is score of 10 and spare ', () => {
    const actual = firstRoll(FIRST_ROLL_5)(SECOND_ROLL_5);
    expect(actual.score).toBe(FIRST_ROLL_5 + SECOND_ROLL_5);
    expect(actual.isSpare).toBe(IS_SPARE);
});

test('first roll of 10 no second roll is score of 10 and strike ', () => {
    const actual = firstRoll(FIRST_ROLL_10)(SECOND_ROLL_0);
    expect(actual.score).toBe(FIRST_ROLL_10);
    expect(actual.isStrike).toBe(IS_STRIKE);
});

test('add regular frame to regular frame', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_5)(SECOND_ROLL_1), firstRoll(FIRST_ROLL_5)(SECOND_ROLL_1));
    expect(actual.score).toBe(FIRST_ROLL_5 + SECOND_ROLL_1 + FIRST_ROLL_5 + SECOND_ROLL_1);
});

test('second roll returns object with firstRollScore', () => {
    const actual = firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0);
    expect(actual.firstRollScore).toBe(FIRST_ROLL_5);
});

test('second roll returns object with secondRollScore', () => {
    const actual = firstRoll(FIRST_ROLL_5)(SECOND_ROLL_1);
    expect(actual.secondRollScore).toBe(SECOND_ROLL_1);
});

test('add regular frame score to strike frame score', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_10)(SECOND_ROLL_0), firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0));
    expect(actual.score).toBe(FIRST_ROLL_10 + (FIRST_ROLL_5 + SECOND_ROLL_0) * 2);
});

test('remove strike flag after adding regular frame', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_10)(SECOND_ROLL_0), firstRoll(SECOND_ROLL_5)(SECOND_ROLL_0));
    expect(actual.isStrike).toBe(IS_NOT_STRIKE);
});

test('add first roll of regular frame to spare frame score', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_5)(SECOND_ROLL_5), firstRoll(FIRST_ROLL_5)(SECOND_ROLL_1));
    expect(actual.score).toBe(FIRST_ROLL_5 + SECOND_ROLL_5 + (FIRST_ROLL_5 * 2) + SECOND_ROLL_1);
});

test('remove spare flag after adding regular frame', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_5)(SECOND_ROLL_5), firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0));
    expect(actual.isSpare).toBe(IS_NOT_SPARE);
});

test('add strike frame score to regular frame score', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0), firstRoll(FIRST_ROLL_10)(SECOND_ROLL_0));
    expect(actual.score).toBe(FIRST_ROLL_5 + SECOND_ROLL_0 + FIRST_ROLL_10);
});

test('add strike frame score keeps strike flag', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0), firstRoll(FIRST_ROLL_10)(SECOND_ROLL_0));
    expect(actual.isStrike).toBe(IS_STRIKE);
});

test('add spare frame score to regular frame score', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0), firstRoll(FIRST_ROLL_5)(SECOND_ROLL_5));
    expect(actual.score).toBe(FIRST_ROLL_5 + SECOND_ROLL_0 + FIRST_ROLL_5 + SECOND_ROLL_5);
});

test('add spare frame score keeps spare flag', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0), firstRoll(FIRST_ROLL_5)(SECOND_ROLL_5));
    expect(actual.isSpare).toBe(IS_SPARE);
});

test('add strike frame score to spare frame score', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_5)(SECOND_ROLL_5), firstRoll(FIRST_ROLL_10)(SECOND_ROLL_0));
    expect(actual.score).toBe(FIRST_ROLL_5 + SECOND_ROLL_5 + (FIRST_ROLL_10 * 2) + SECOND_ROLL_0);
});

test('add spare frame score to strike frame score', () => {
    const actual = addFrame(firstRoll(FIRST_ROLL_10)(SECOND_ROLL_0), firstRoll(FIRST_ROLL_5)(SECOND_ROLL_5));
    expect(actual.score).toBe(FIRST_ROLL_10 + (FIRST_ROLL_5 + SECOND_ROLL_5) * 2);
});

test('return summed frame based on previous frames', () => {
    const actual = game([
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0)
    ]);

    expect(actual.score).toBe(
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0
    );
});

test('return sum all frames after 10 frames', () => {
    const actual = game([
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0)
    ]);

    expect(actual).toBe(
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0
    );
});

test('return sum all frames after 10 frames with one strike frame', () => {
    const actual = game([
        firstRoll(FIRST_ROLL_10)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_1),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
    ]);

    expect(actual).toBe(
        FIRST_ROLL_10 + SECOND_ROLL_0 +
        (FIRST_ROLL_5 + SECOND_ROLL_1) * 2 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0
    );
});

test('return sum all frames after 10 frames with one spare frame', () => {
    const actual = game([
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_5),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_1),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
        firstRoll(FIRST_ROLL_5)(SECOND_ROLL_0),
    ]);

    expect(actual).toBe(
        FIRST_ROLL_5 + SECOND_ROLL_5 +
        (FIRST_ROLL_5 * 2) + SECOND_ROLL_1 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0 +
        FIRST_ROLL_5 + SECOND_ROLL_0
    );
});


