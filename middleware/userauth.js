const jwt = require("jsonwebtoken");

//this will check the student is verified
userAuth = async (req, res, next) => {
    try {

        let token

        if (!req.headers.authorization)
            res.status(401).json({ success: false, message: "No authorization header found" })

        //checking the token type is user
        if (req.headers.authorization.startsWith("User")) {
            //token is an array, this will take the data in the first index
            token = req.headers.authorization.split(" ")[1];
        }

        //get data from token
        let decodedData;
        decodedData = jwt.verify(token, process.env.JWT_SECRET);

        //add user id to request
        req.userID = decodedData?.id;

        //if all data is valid pass to next step
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "User Authentication failed", error: error.message })
    }
}

module.exports = userAuth;