const { validateHash } = require('../utils/hash');
const mongoose = require('mongoose');
const validator = require('validator');

const urlRegex = /^(https?:\/\/)(www\.)?([\w\-._~:/?#[\]@!$&'()*+,;=]+)#?$/;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'E-mail inválido.',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false
  },
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    default: 'Explorer',
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
    validate: {
      validator: (v) => urlRegex.test(v),
      message: 'O link do avatar é inválido.'
    }
  }
});

userSchema.statics.findByCredentials = async function findByCredentials({ email, password }) {
  const user = await this.findOne({ email })
  if (!user) {
    return { error: `User ${email} and/or password was not found!` }
  }
  if (!validateHash(password, user.password)) {
    return { error: `Credentials are invalid` }
  }
  return { id: user._id, name: user.name, about: user.about }
}

module.exports = mongoose.model('user', userSchema);