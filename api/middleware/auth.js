const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const mongodb = require("../DB/connect");


const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('Authorization Header:', authHeader);


  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token);

    // Decode the token to inspect its payload
    const decodedPayload = jwt.decode(token);
    console.log('Decoded Payload:', decodedPayload);

    // Ensure the payload contains the expected fields
    if (!decodedPayload || !decodedPayload.userID) {
      console.log('Token payload is missing userID.');
      return res.status(401).send({ error: 'Invalid token payload.' });
    }

    const userId = new ObjectId(decodedPayload.userID);
    console.log('Converted userID to ObjectId:', userId);

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err) => {
          if (err) {
            // If token is expired or invalid, remove it from the user's tokens array
            await mongodb.getDb().db().collection('users').updateOne(
              { _id: userId },
              { $pull: { tokens: { token } } }
            );
            console.log('Token removed due to expiration or invalidity.');
            return res.status(401).send({ error: 'Please authenticate.' });
          }

    const user = await mongodb.getDb().db().collection('users').findOne({ _id: userId, 'tokens.token': token });
    console.log('User:', user);

    if (!user) {
      console.log('User not found with given token.');
      return res.status(401).send({ error: 'User not found' });
    }

    req.token = token;
    req.user = user;

    console.log('Authenticated User:', user);;
    next();
  });
  } catch (error) {
    console.error('Authentication error:', error.message); // Highlighted: Added error logging
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
