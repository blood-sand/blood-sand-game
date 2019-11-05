/**
  * Mongoose Schema for Gladiator data-structure
  **/
const Int32 = require('mongoose-int32');

module.exports = m => {
  const mongoose = m.mongoose;
  const model = m.model;
  const ObjectId = mongoose.Schema.Types.ObjectId;
  const Decimal128 = mongoose.Schema.Types.Decimal128;
  const gladiatorSchema = new mongoose.Schema({
    _id: ObjectId,
    owner: ObjectId,
    name: String,
    attributes: {
      abilitySum: Int32,
      dexterity: Int32,
      endurance: Int32,
      intelligence: Int32,
      perception: Int32,
      strength: Int32,
      vitality: Int32,
      willpower: Int32,
      modifiers: {
        age: Object,
        bmi: Object,
        sex: Object,
        final: {
          dexterity: Int32,
          endurance: Int32,
          intelligence: Int32,
          perception: Int32,
          strength: Int32,
          vitality: Int32,
          willpower: Int32
    }}},
    biometrics: {
      age: Int32,
      bmi: Int32,
      culture: Int32,
      height: Decimal128,
      rank: Int32,
      reach: Int32,
      sex: Int32,
      weight: Decimal128
    }});

  model.Gladiator = mongoose.model(
    'Gladiator', 
    gladiatorSchema
  );
}