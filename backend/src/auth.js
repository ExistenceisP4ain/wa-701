import mongo from 'mongodb';
import connect from './db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// Kreiranje indeksa pri pokretanju aplikacije (ukoliko već ne postoji)
(async () => {
    let db = await connect();
    db.collection('users').createIndex({ username: 1 }, { unique: true });
})();
export default {
 async registerUser(userData) {
 let db = await connect();
 let result;
    try {
        let doc = {
        username: userData.email,
        // lozinku ćemo hashirati pomoću bcrypta
        password: await bcrypt.hash(userData.password, 8),
        tipProfila: userData.tipProfila,
        datumregistracije:userData.datumreg
        };
    result = await db.collection('users').insertOne(doc);
        } catch (e) {
        if (e.name == 'MongoError') {
        if (e.code == 11000) {
        throw new Error('Username already exists');
        }
    }
}
if (result && result.insertedCount == 1) {
return result.insertedId;
} else {
throw new Error('Cannot register user');
}
},
async authenticateUser(username, password) {
    let db = await connect();
    let user = await db.collection('users').findOne({ username: username });
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
        delete user.password; // ne želimo u tokenu, token se sprema na klijentu
        let token = jwt.sign(user, process.env.JWT_SECRET, {
        algorithm: 'HS512',
        expiresIn: '1 week',
    });
    return {
        token,
        username: user.username,
        tipProfila: user.tipProfila
    };
        } else {
            throw new Error('Cannot authenticate');
        }
},
verifyUser(token) {
    try {
        let authorization = req.headers.authorization.split(" ");
        let type = authorization[0];
        let token = authorization[1];
  
        if (type !== "Bearer") {
          res.status(401).send();
        } else {
          req.jwt = jwt.verify(token, process.env.JWT_SECRET);
          return next();
        }
      } catch (e) {
        return res.status(401).send();
      }
},
};