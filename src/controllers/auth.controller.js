const AuthRepo = require("../repository/auth.repo");
const AuthService = require("../services/auth.service");
const { StatusCodes } = require("http-status-codes");

const authService = new AuthService(new AuthRepo);

async function register(req, res, next){
    try{
        const userData = {...req.body};
        const result = await authService.register(userData);

        if (result.userExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "User already exists. Please log in or use a different email/username.",
                err: {},
                data: null
            });
        }

        const message = result.isNewUser ? "User created successfully" : "User already exists. Successfully logged in.";

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: message,
            err: {},
            data: result
        });
    }
    catch(err){
        next(err);
    }
}

module.exports = {
    register
};