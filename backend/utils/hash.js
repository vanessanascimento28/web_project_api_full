import bcrypt from "bcryptjs";

export function createHash(password) {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

export function validateHash(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword)
}
