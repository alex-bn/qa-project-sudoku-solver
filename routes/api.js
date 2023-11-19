"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
const solver = new SudokuSolver();

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const puzzle = req.body.puzzle;
    const coordinate = req.body.coordinate;
    const value = req.body.value;

    if (!puzzle || !coordinate || !value) {
      res.json({ error: "Required field(s) missing" });
      return;
    }
    let [row, column] = coordinate.split("");

    if (coordinate.length !== 2 || !/[a-i]/i.test(row) || !/[1-9]/i.test(column)) {
      res.json({ error: "Invalid coordinate" });
      return;
    }
    if (!/^[1-9]{1}$/.test(value)) {
      res.json({ error: "Invalid value" });
      return;
    }
    if (puzzle.length !== 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (/[^0-9.]/g.test(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }

    let validCol = solver.checkColPlacement(puzzle, row, column, value);
    let validReg = solver.checkRegionPlacement(puzzle, row, column, value);
    let validRow = solver.checkRowPlacement(puzzle, row, column, value);

    let conflicts = [];

    if (!validRow) {
      conflicts.push("row");
    }
    if (!validCol) {
      conflicts.push("column");
    }
    if (!validReg) {
      conflicts.push("region");
    }

    if (conflicts.length == 0) {
      res.status(200).json({ valid: true });
    } else {
      res.status(200).json({
        valid: false,
        conflict: conflicts,
      });
    }
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    if (!puzzle) {
      res.json({ error: "Required field missing" });
      return;
    }
    if (puzzle.length !== 81) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (/[^0-9.]/g.test(puzzle)) {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }
    let solvedString = solver.solve(puzzle);
    if (!solvedString) {
      res.json({ error: "Puzzle cannot be solved" });
    } else {
      res.json({ solution: solvedString });
    }
  });
};
