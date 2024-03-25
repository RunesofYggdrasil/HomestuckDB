const asyncHandler = require("express-async-handler");
const Character = require("./models/characterModel");
const Ship = require("./models/shipModel");
const { constants } = require("./constants");

const characterList = [];
const shipList = [];

function createShip(characterOne, characterTwo) {
  const ship_name = characterOne.first_name + characterTwo.first_name;
  const first_id = characterOne._id;
  const second_id = characterTwo._id;
  const flushed = 0;
  const pitch = 0;
  const pale = 0;
  const ashen = 0;
  const other = 0;

  const ship = new Ship({
    ship_name,
    first_id,
    second_id,
    flushed,
    pitch,
    pale,
    ashen,
    other,
  });
  try {
    ship.save();
  } catch (error) {
    if (error.name === "ValidationError") {
      if (error.errors.ship_name) {
        throw new Error(error.errors.ship_name.message);
      } else if (error.errors.first_id) {
        throw new Error(error.errors.first_id.message);
      } else if (error.errors.second_id) {
        throw new Error(error.errors.second_id.message);
      } else if (error.errors.flushed) {
        throw new Error(error.errors.flushed.message);
      } else if (error.errors.pitch) {
        throw new Error(error.errors.pitch.message);
      } else if (error.errors.pale) {
        throw new Error(error.errors.pale.message);
      } else if (error.errors.ashen) {
        throw new Error(error.errors.ashen.message);
      } else if (error.errors.other) {
        throw new Error(error.errors.other.message);
      }
    } else {
      throw new Error("Invalid Input: Ship Name Must be Unique.");
    }
  }
};

const createAllShips = asyncHandler(async (req, res) => {
  let charIndex = 0;
  let shipIndex = 0;

  const allCharacters = await Character.find({});
  allCharacters.forEach(character => {
    characterList[charIndex] = character;
    charIndex++;
  });

  const allShips = await Ship.find({});
  allShips.forEach(ship => {
    shipList[shipIndex] = ship;
    shipIndex++;
  });

  for (let charactersX = 0; charactersX < characterList.length; charactersX++) {
    for (let charactersY = (charactersX + 1); charactersY < characterList.length; charactersY++) {
      let namePair = characterList[charactersX].first_name + characterList[charactersY].first_name;
      let namePairFlipped = characterList[charactersY].first_name + characterList[charactersX].first_name;
      const shipExists = await Ship.exists({ ship_name: namePair });
      const shipFlippedExists = await Ship.exists({ ship_name: namePairFlipped });
      if (!shipExists && !shipFlippedExists) {
        createShip(characterList[charactersX], characterList[charactersY]);
      }
    }
  }
});

module.exports = { createAllShips };