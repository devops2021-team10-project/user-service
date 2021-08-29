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
  console.log("ID:");
  console.log(id);
  console.log(data);

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
  console.log("Result:");
  console.log(result);
  if(result.matchedCount !== 1) {
    throw "User not found for update ops.";
  }
};

const addMutedProfile = async ({ userId, toMuteUserId }) => {
  const { db } = await makeDb();
  const res = await db.collection('users').updateOne(
    {
      _id: userId,
      deletedAt: null
    }, 
    {
      $addToSet: { mutedProfiles: toMuteUserId }
    }
  );
};

const removeMutedProfile = async ({ userId, toUnmuteUserId }) => {
  const { db } = await makeDb();
  const res = await db.collection('users').updateOne(
    {
      _id: userId,
      deletedAt: null
    }, 
    {
      $pull: { mutedProfiles: toUnmuteUserId }
    }
  );
};

const addBlockedProfile = async ({ userId, toBlockUserId }) => {
  const { db } = await makeDb();
  const res = await db.collection('users').updateOne(
    {
      _id: userId,
      deletedAt: null
    }, 
    {
      $addToSet: { blockedProfiles: toBlockUserId }
    }
  );
};

const removeBlockedProfile = async ({ userId, toBlockUserId }) => {
  const { db } = await makeDb();
  const res = await db.collection('users').updateOne(
    {
      _id: userId,
      deletedAt: null
    }, 
    {
      $pull: { blockedProfiles: toBlockUserId }
    }
  );
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
    throw "Not Found";
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
    throw "Not Found";
  }
};


module.exports = Object.freeze({
  findById,
  findByUsername,
  findByEmail,

  insert,
  update,
  resetPassword,

  addMutedProfile,
  removeMutedProfile,
  addBlockedProfile,
  removeBlockedProfile,

  deleteById,
});