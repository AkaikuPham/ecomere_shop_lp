'use strict'

const userModel = require("../models/user.model")
const bcrypt = require('bcrypt')
// const crypto = require('crypto')
const crypto = require('node:crypto') // Node 19 đã tích hợp crypto vào rồi nên có thể không cần cài thêm ngoài nữa thành thừa
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

const RoleUser = {
   USER: 'USER',
   EDITOR: 'EDITOR',
   ADMIN: 'ADMIN'
}

class AccessService {

  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exists??
      
      const holderlUser = await userModel.findOne({ email }).lean()
      if (holderlUser) {
        return {
          code: 400,
          message: 'Email already registered!',
          status: 'error'
        }
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = await userModel.create({
        name, email, password: passwordHash, roles: [RoleUser.USER]
      })

      if (newUser) {
        // create privateKey, publicKey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   }
        // })
        
        // Cach đơn giản hơn thay vì generateKey ra
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // Public key CryptoGraphy Standads 1

        // console.log({ privateKey, publicKey }) // save collection KeyStore

        const keyStore = await KeyTokenService.createToken({
          userId: newUser._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return {
            code: 500,
            message: 'keyStore error'
          }
        }

        // const publicKeyObject = crypto.createPublicKey(publicKeyString)

        // created token pair
        const tokens = await createTokenPair(
          { userId: newUser._id, email},
          publicKey,
          privateKey
        )

        // console.log(tokens)
        return {
          code: 201,
          metadata: {
            user: getInfoData({ fileds: ['_id', 'name', 'email'], object: newUser }),
            tokens
          }
        }
      }

      return {
        code: 200,
        metadata: null
      }
    } catch (error) {
      return {
        code: 500,
        message: error.message,
        status: 'error'
      }
    }
  }

}
module.exports = AccessService
