const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const mongodb = require("../DB/connect");


const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  //console.log('Authorization Header:', authHeader);


  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    //console.log('Token:', token);

    // Decode the token to inspect its payload
    const decodedPayload = jwt.decode(token);
    //console.log('Decoded Payload:', decodedPayload);

    // Ensure the payload contains the expected fields
    if (!decodedPayload || !decodedPayload.userID) {
      console.log('Token payload is missing userID.');
      return res.status(401).send({ error: 'Invalid token payload.' });
    }

    const userId = new ObjectId(decodedPayload.userID);
   // console.log('Converted userID to ObjectId:', userId);

      // Verify the token
jwt.verify(token, process.env.JWT_SECRET, async (err) => {
  if (err) {
    // If token is expired or invalid, remove it from the user's tokens array
    try {
      await mongodb.getDb().db().collection('users').updateOne(
        { _id: userId },
        { $pull: { tokens: { token } } }
      );
      console.log('Token removed due to expiration or invalidity.');
    } catch (updateError) {
      console.error('Error removing token:', updateError);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
    return res.status(401).send({ error: 'Please authenticate.' });
  }

  try {
    const user = await mongodb.getDb().db().collection('users').findOne({ _id: userId, 'tokens.token': token });
   // console.log('User:', user);
    if (!user) {
      return res.status(401).send({ error: 'Please authenticate.' });
    }
    // Proceed with the rest of your logic here
    req.user = user;
    req.token = token;
    next();
  } catch (findError) {
    console.error('Error finding user:', findError);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});
  } catch (error) {
    console.error('Authentication error:', error.message); // Highlighted: Added error logging
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
