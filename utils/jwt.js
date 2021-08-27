const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToPrivKey = path.join(__dirname, '..', './keys/id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8');

const pathToPubKey = path.join(__dirname, '..', 'keys/id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');

const accessTokenTTL = process.env.ACCESS_TOKEN_TTL;
const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL;


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

const verifyJWT = (token) => {
  try {
    const data = jsonwebtoken.verify(token, PUB_KEY, { algorithm: 'RS256' });
    // TODO: check expiration?
    return data;   
  } catch (err) {
    throw { status: 400, msg: "Bad auth token."}
  };
}

module.exports = Object.freeze({
  issueJWT,
  verifyJWT,
});