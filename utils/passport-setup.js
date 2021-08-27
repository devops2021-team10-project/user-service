const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');

const userDb = require('../data-access/user-db');

const pathToKey = path.join(__dirname, '..', 'keys/id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

module.exports = (passport) => {
  passport.use('access', new JwtStrategy(options, async(jwt_payload, done) => {
    if(jwt_payload.type === 'access') {
      userDb.findById({ id: jwt_payload.sub }).then((user) => {
        if (user) {
          if(user.isBlocked === false) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } else {
          return done(null, false);
        }
      })
        .catch((err) => {
          return done(err, false);
        });
    } else {
      return done(null, false);
    }
  }));
}