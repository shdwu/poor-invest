import * as mongoose from 'mongoose'
import { User, comparePasswordFunction } from './user.interface'
import * as bcrypt from 'bcrypt-nodejs'

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  roles: Array,
  village: {
    ref: 'Village',
    type: mongoose.Schema.Types.ObjectId,
  },
}, { timestamps: true })

userSchema.pre('save', function save(next) {
  const user = this as User & mongoose.Document
  if (user.isModified('password')) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(user.password, salt)
    user.password = hash
  }
  next()
})

const comparePassword: comparePasswordFunction = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password)
}

userSchema.methods.comparePassword = comparePassword

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema)

export { userModel }
