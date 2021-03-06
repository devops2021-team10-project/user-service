// Main
const Id = require('../utils/id');
const { makeDb } = require('./db');


const findById = async ({ id: _id }) => {
  const { db } = await makeDb();
  const result = await db.collection('users').find({ _id, deletedAt: null });
  const found = await result.toArray();
  if (found.length === 0) {
    return null;
  }
  const { _id: id, ...info } = found[0];
  return { id, ...info };
};

const searchByName = async ({ name }) => {
  const { db } = await makeDb();
  const result = await db.collection('users').find(
    { $text: { $search: name } },
    { score: { $meta: "textScore" } }
  ).sort( { score: { $meta: "textScore" } } );
  const found = await result.toArray();
  if (found.length === 0) {
    return null;
  }

  const normal = [];
  for (let e of found) {
    const { _id: id, ...info } = e;
    normal.push({ id, ...info });
  }
  return normal;
};

const findByUsername = async ({ username }) => {
  const { db } = await makeDb();
  const result = await db.collection('users').find({ username, deletedAt: null });
  const found = await result.toArray();
  if (found.length === 0) {
    return null;
  }
  const { _id: id, ...insertedInfo } = found[0];
  return { id, ...insertedInfo };
};

const findByEmail = async ({ email }) => {
  const { db } = await makeDb();
  const result = await db.collection('users').find({ email: email, deletedAt: null });
  const found = await result.toArray();
  if (found.length === 0) {
    return null;
  }
  const { _id: id, ...insertedInfo } = found[0];
  return { id, ...insertedInfo };
};

const insert = async ({ data }) => {
  try {
    const id = Id.makeId();
    const { db } = await makeDb();
    const result = await db
      .collection('users')
      .insertOne({ _id: id, ...data });
    const { _id, ...insertedUser } = result.ops[0];
    return { id: _id, ...insertedUser };
  } catch(err) {
    throw err;
  }
};

const update = async ({ id, data }) => {
  const { db } = await makeDb();
  const result = await db.collection('users').updateOne(
    {
      _id: id,
      deletedAt: null
    }, {
      $set: {
        ...data
      }
    }
  );
  if (result.matchedCount !== 1) {
    throw "User not found for update ops";
  }
};

const resetPassword = async ({ userId, passwordHash, passwordSalt }) => {
  const { db } = await makeDb();
  const res = await db.collection('users').updateOne(
    {
      _id: userId
    }, {
      $set: {
        passwordHash,
        passwordSalt
      }
    }
  );
  if(res.matchedCount !== 1) {
    throw "User not found for reset password ops";
  }
};

const deleteById = async ({ id }) => {
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
  if(res.matchedCount !== 1) {
    throw "User not found for delete ops";
  }
};


module.exports = Object.freeze({
  findById,
  searchByName,
  findByUsername,
  findByEmail,

  insert,
  update,
  resetPassword,

  deleteById,
});