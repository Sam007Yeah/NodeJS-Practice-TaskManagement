const db = require("../db/db");
const Jwt_Service = require("./Jwt-Service");

function UserService() {
    const count = userCount();
    const jwt_service = Jwt_Service()

    async function userCount() {
        const query = `SELECT COUNT(*) FROM users`;
        let usersCount = await db.query(query,[]);
        return usersCount.rows[0].count;
    }

    function encodePassword(pass) {
        const buffer = Buffer.from(pass, 'utf-8');
        const base64 = buffer.toString('base64');
        return(base64);
    }

    function decodePassword(pass) {
        const buffer = Buffer.from(pass, 'base64');
        const original = buffer.toString('utf-8');
        return(original);
    }
    
    return {
        async getCount() {
            return await count;
        },

        async createUser(username, password) {
            if(!username || !password)
                throw error("No username or password provided.")

            const id = "U00" + await count;
            const encodedPassword = encodePassword(password);
            const query = `
                INSERT INTO users (id, name, password) 
                VALUES ($1, $2, $3)
            `;

            try {
                await db.query(query,[id, username, encodedPassword]);
                const message = "User Created with id : " + id;
                return({"message" : message});
            } 
            catch(err) {
                throw error("User cannot be created due to error!");
            }
        },

        async verifyUser(id, password) {
            if(!id || !password)
                throw error("no id or password provided");

            const encodedPassword = encodePassword(password);
            const decodedPassword = decodePassword(password);

            const query = `
                SELECT COUNT(*) FROM users
                WHERE id = $1 AND
                password = $2
            `

            try {
                const result = (await db.query(query, [id, encodedPassword])).rows[0].count;
                if(result > 1 || result === '0')
                    throw error("Error with backend in processing information or user does not exist");

                user = result[0];
                return({"message" : "User Verified!"})
            }
            catch(err) {
                throw error(err.message || "User Not Found")
            }

        },

        async login(id, password) {
            const payload = {
                user : id,
                role : "admin"
            }
            try {
                const result = await this.verifyUser(id, password);
                if(result.message.toString().includes("User Verified")) {
                    return({"Token": jwt_service.createToken(payload)})
                }
            }
            catch (err) {
                throw error(err.message || "Internal server error")
            }
        },

        verifyToken(token) {
            return jwt_service.verifyToken(token);
        }
    }
}

module.exports = UserService;