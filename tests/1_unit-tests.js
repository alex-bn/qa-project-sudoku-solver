const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

const validPuzzleString = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function (done) {
    const completed = "568913724342687519197254386685479231219538467734162895926345178473891652851726943";
    assert.equal(solver.solve(validPuzzleString), completed);
    done();
  });
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
    const invalid = "gggg.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.solve(invalid), false);
    done();
  });
  test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
    const moreThan81Chars =
      "1.5..2.84..63.12.7.2..5..2131231.......9..1....8.2.3674.3.7.2..9.47...8..1..16....92612914.37.";
    assert.equal(solver.solve(moreThan81Chars), false);
    done();
  });
  test("Logic handles a valid row placement", function (done) {
    assert.equal(solver.checkRowPlacement(validPuzzleString, "A", "2", "4"), true);
    done();
  });
  test("Logic handles an invalid row placement", function (done) {
    assert.equal(solver.checkRowPlacement(validPuzzleString, "A", "2", "9"), false);
    done();
  });
  test("Logic handles a valid column placement", function (done) {
    assert.equal(solver.checkColPlacement(validPuzzleString, "A", "2", "4"), true);
    done();
  });
  test("Logic handles an invalid column placement", function (done) {
    assert.equal(solver.checkColPlacement(validPuzzleString, "A", "2", "9"), false);
    done();
  });
  test("Logic handles a valid region (3x3 grid) placement", function (done) {
    assert.equal(solver.checkRegionPlacement(validPuzzleString, "A", "2", "4"), true);
    done();
  });
  test("Logic handles an invalid region (3x3 grid) placement", function (done) {
    assert.equal(solver.checkRegionPlacement(validPuzzleString, "A", "2", "1"), true);
    done();
  });
  test("Valid puzzle strings pass the solver", function (done) {
    assert.equal(
      solver.solve(validPuzzleString),
      "568913724342687519197254386685479231219538467734162895926345178473891652851726943"
    );
    done();
  });
  test("Invalid puzzle strings fail the solver", function (done) {
    const invalid = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...311";
    assert.equal(solver.solve(invalid), false);
    done();
  });
  test("Solver returns the expected solution for an incomplete puzzle", function (done) {
    assert.equal(
      solver.solve(validPuzzleString),
      "568913724342687519197254386685479231219538467734162895926345178473891652851726943"
    );
    done();
  });
});
