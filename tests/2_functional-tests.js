const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../server");

const assert = chai.assert;
chai.use(chaiHttp);

const validPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: validPuzzle })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        let complete = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
        assert.equal(res.body.solution, complete);
        done();
      });
  });
  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    const missingPuzzleString = {};
    chai
      .request(server)
      .post("/api/solve")
      .send(missingPuzzleString)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });
  test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    const invalidCharactersPuzzle =
      ").5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidCharactersPuzzle })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    const incorrectLengthPuzzle =
      "11111.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: incorrectLengthPuzzle })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    const puzzleThatCannotBeSolved =
      "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: puzzleThatCannotBeSolved })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });
  test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    const allFields = { puzzle: validPuzzle, coordinate: "A2", value: "3" };
    chai
      .request(server)
      .post("/api/check")
      .send(allFields)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
    const singlePlacementConflict = { puzzle: validPuzzle, coordinate: "A2", value: "8" };
    const nrConflicts = 1;
    chai
      .request(server)
      .post("/api/check")
      .send(singlePlacementConflict)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, nrConflicts);
        done();
      });
  });
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
    const multiplePlacementConflict = { puzzle: validPuzzle, coordinate: "A2", value: "6" };
    const nrConflicts = 2;
    chai
      .request(server)
      .post("/api/check")
      .send(multiplePlacementConflict)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, nrConflicts);
        done();
      });
  });
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
    const allPlacementConflict = { puzzle: validPuzzle, coordinate: "A2", value: "2" };
    const nrConflicts = 3;

    chai
      .request(server)
      .post("/api/check")
      .send(allPlacementConflict)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, nrConflicts);
        done();
      });
  });
  test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
    const missingCoordinate = { puzzle: validPuzzle, value: "2" };
    chai
      .request(server)
      .post("/api/check")
      .send(missingCoordinate)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
    const invalidCharacterInPuzzle =
      "h.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: invalidCharacterInPuzzle, coordinate: "A2", value: "2" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
    const invalidCharacterInPuzzle =
      "h.1115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: invalidCharacterInPuzzle, coordinate: "A2", value: "2" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
    const invalidCoordinate = { puzzle: validPuzzle, coordinate: "L2", value: "2" };

    chai
      .request(server)
      .post("/api/check")
      .send(invalidCoordinate)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
    const invalidCoordinate = { puzzle: validPuzzle, coordinate: "A2", value: "g" };

    chai
      .request(server)
      .post("/api/check")
      .send(invalidCoordinate)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});
