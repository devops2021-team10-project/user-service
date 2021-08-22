const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', './keys/id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const accessTokenTTL = process.env.ACCESS_TOKEN_TTL;
const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL;

function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

function issueJWT(type, id) {
  if(type !== 'access' && type !== 'refresh') {
    throw new Error('Bad JWT type');
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
        token: "Bearer " + signedToken
      }
    } else {
      const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: ttl, algorithm: 'RS256' });
      return {
        token: "Bearer " + signedToken,
        expires: ttl
      }
    }
  }
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return {
    salt: salt,
    hash: genHash
  };
}

module.exports.validPassword = validPassword;
module.exports.issueJWT = issueJWT;
module.exports.genPassword = genPassword;