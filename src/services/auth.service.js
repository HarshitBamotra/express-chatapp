class AuthService{
    constructor(AuthRepo){
        this.AuthRepo = AuthRepo
    }

    async register(userData){
        try{
            const response = await this.AuthRepo.register(userData);

            return response;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async login(userData){
        try{
            const response = await this.AuthRepo.login(userData);

            return response;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async updateProfile(userId, userData){
        try{
            const response = await this.AuthRepo.updateProfile(userId, userData);
            return response;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}

module.exports = AuthService;