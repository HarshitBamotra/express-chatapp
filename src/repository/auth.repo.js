const jwt = require('jsonwebtoken');

const User = require("../models/user.model");
const { InternalServerError, NotFound } = require("../errors");
const {JWT_SECRET} = require("../config/server.config");


class AuthRepo{
    async register(userData){
        try{
            const { username, email, password } = userData;

            const existingUser = await User.findOne({ $or: [{ email }, { username }] });

            if (existingUser) {

                const isMatch = await existingUser.comparePassword(password);

                if (isMatch) {

                    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: '7d' });

                    return {
                        token,
                        user: {
                            id: existingUser._id,
                            username: existingUser.username,
                            email: existingUser.email,
                            profilePhoto: existingUser.profilePhoto
                        },
                        isNewUser: false
                    };
                } else {

                    return {
                        userExists: true,
                        isNewUser: false
                    };
                }
            }

            const user = await User.create({
                username,
                email,
                password
            });
            await user.save();

            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

            return {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
                isNewUser: true
            };
        }
        catch(err){
            console.log(err);
            throw new InternalServerError(err);
        }
    }

    async login(userData){
        try{
            const { email, password } = userData;

            const user = await User.findOne({ email });
            if (!user) {
                return { userNotFound: true };
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return { invalidPassword: true };
            }

            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

            return {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePhoto: user.profilePhoto
                }
            };
        }
        catch(err){
            console.log(err);
            throw new InternalServerError(err);
        }
    }
}

module.exports = AuthRepo;