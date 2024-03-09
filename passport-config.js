const { authenticate } = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const collection = require('./schema');

const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        try {
            const user = await collection.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'No user with that username' });
            }

            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await collection.findById(_id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = initialize;