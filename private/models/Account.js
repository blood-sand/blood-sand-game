/**
  * Mongoose Schema for Account data-structure
  **/

const bcrypt = require('bcrypt');

/**
  * Generate a reproducable int based on
  * the characters in the raw-password.
  **/
function getSaltSeed(password) {
  let seed = 0;
  for (let i = 0; i < password.length; i += 1) {
    seed += password.charCodeAt(i);
  }
  return 10 + (seed % 6);
}

module.exports = m => {
  const model = m.model;
  const mongoose = m.mongoose;
  const accountSchema = new mongoose.Schema({
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    sessionId: {
      type: String,
      required: true
    }
  });

  accountSchema.methods.existing = async function () {
    return await this.model('Account').findOne({email: this.email});
  }
  accountSchema.methods.hashPassword = async function () {
    this.password = await bcrypt.hash(
      this.password, 
      getSaltSeed(this.password));
  };
  accountSchema.methods.checkPassword = async function (raw_password) {
    return await bcrypt.compare(raw_password, this.password);
  };
  model.Account = mongoose.model('Account', accountSchema);
}