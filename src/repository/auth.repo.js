const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

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

            user.status = 'online';
            await user.save();

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

    async updateProfile(userId, userData){
        try{
            const {username, profilePhotoUrl, profilePhotoName} = userData;
            
            const user = await User.findById(userId);

            if(!user){
                throw new NotFound("User", userId);
            }
            
            if(profilePhotoUrl && profilePhotoName){
                const prevPhoto = user.profilePhoto?.publicId;

                user.profilePhoto.url = profilePhotoUrl;
                user.profilePhoto.publicId = profilePhotoName;

                if(prevPhoto){
                    await cloudinary.uploader.destroy(prevPhoto);
                }
            }

            if(username){
                user.username = username;
            }
            
            await user.save();

            return user;
        }
        catch(err){
            console.log(err);
            throw new InternalServerError(err);
        }
    }
}

module.exports = AuthRepo;