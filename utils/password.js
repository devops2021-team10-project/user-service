const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', './keys/id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const accessTokenTTL = process.env.ACCESS_TOKEN_TTL;
const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL;

const validPassword = (password, hash, salt) => {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
};

const  issueJWT = (type, id) => {
  if(type !== 'access' && type !== 'refresh') {
    throw { status: 400, msg: "Bad token type."};
  } else {
    if(type === 'access') {
      ttl = accessTokenTTL;
    } else {
      ttl = refreshTokenTTL;
    }
    const payload = {
      type: type,
      sub: id,
      iat: Math.floor(Date.now() / 1000)
    };
    if(ttl === 'inf') {
      const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { algorithm: 'RS256' });
      return {
        token: signedToken
      }
    } else {
      const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: ttl, algorithm: 'RS256' });
      return {
        token: signedToken,
        expires: ttl
      }
    }
  }
};

const genPassword = (password) => {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return {
    salt: salt,
    hash: genHash
  };
};

module.exports = Object.freeze({
  validPassword,
  issueJWT,
  genPassword
});