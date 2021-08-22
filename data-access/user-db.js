function makeUserDb({ makeDb, Id, role }) {
  return Object.freeze({
    findById,
    findByUsername,
    findByEmail,
    insert,
    update,
    resetPassword,
    deleteById,
  })

  async function findById({ id: _id }) {
    const { db } = await makeDb();
    const result = await db.collection('users').find({ _id, deletedAt: null });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...info } = found[0];
    return { id, ...info };
  }

  async function findByUsername({ username }) {
    const { db } = await makeDb();
    const result = await db.collection('users').find({ username, deletedAt: null });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...insertedInfo } = found[0];
    return { id, ...insertedInfo };
  }

  async function findByEmail({ email }) {
    const { db } = await makeDb();
    const result = await db.collection('users').find({ email: email, deletedAt: null });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...insertedInfo } = found[0];
    return { id, ...insertedInfo };
  }

  async function insert({ id: _id = Id.makeId(), ...userData }) {
    try {
      const { db } = await makeDb();
      const result = await db
        .collection('users')
        .insertOne({ _id, ...userData });
      const { _id: id, ...insertedInfo } = result.ops[0];
      return { id, ...insertedInfo };
    } catch(err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw 'Email already in use.';
      } else {
        throw err;
      }
    }
  }

  async function update({ id, data }) {
    const { db } = await makeDb();
    const res = await db.collection('users').updateOne(
      {
        _id: id,
        deletedAt: null
      }, {
        $set: {
          ...data
        }
      }
    );
    if(res.modifiedCount !== 1) {
      throw "Not Found";
    }
  }

  async function resetPassword({ token, salt, hash }) {
    const { db, client } = await makeDb();
    const session = client.startSession({ defaultTransactionOptions: {
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
        readPreference: 'primary'
      }});
    try {
      await session.withTransaction(async function() {
        const col = db.collection('users');
        const user = await col.findOne({ "passwordReset.hash": token, deletedAt: null });
        if(!user){
          throw 'Forbidden';
        }
        let expDate = new Date(user.passwordReset.expirationDate);
        if(expDate < new Date()) {
          throw 'Password reset token expired.';
        }
        await col.updateOne({ "passwordReset.hash": token, deletedAt: null },
          {
            $set: {
              passwordReset: {
                hash: null,
                expirationDate: null
              },
              salt: salt,
              hash: hash
            }
          })
      });
    } finally {
      await session.endSession();
    }
  }

  async function deleteById({ id }) {
    const { db } = await makeDb();
    const res = await db.collection('users').updateOne(
      {
        _id: id,
        deletedAt: null
      }, {
        $set: {
          deletedAt: Date.now()
        }
      }
    );
    if(res.modifiedCount !== 1) {
      throw "Not Found";
    }
  }

}

module.exports.makeUserDb = makeUserDb;