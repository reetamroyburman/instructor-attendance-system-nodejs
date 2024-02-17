const { instructorModel } = require("../models/Schema");
const bcrypt = require("bcrypt");
const { uuid } = require('uuidv4');
const jwt = require("jsonwebtoken");

const signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).send("All fields are required");
        }

        //if the email already present in database or our Usermodels
        const oldUser = await instructorModel.findOne({ email });
        if (oldUser) {
            return res.status(409).send("instructor is already registered");
        }

        const _id = uuid()

        const hashedPassword = await bcrypt.hash(password, 10);

        const instructor = await instructorModel.create({
            name,
            email,
            password: hashedPassword,
            user_id:_id
        });

        return res.status(200).json({
            result: "instructor created successfully"
        })
    } catch (e) {
        return res.status(500).json({
            error:e.message
        })
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("All fields are required");
        }

        const instructor = await instructorModel.findOne({ email }).select('+password');
        if (!instructor) {
            return res.status(404).send("instructor is not registered");
        }

        const matched = await bcrypt.compare(password, instructor.password);
        if (!matched) {
            return res.status(403).send("Incorrect password");
        }

        const accessToken = generateAccessToken({
            user_id: instructor.user_id,
        });

        console.log(accessToken);

        return res.status(200).json({
            token:accessToken,
            name :instructor.name,
            email:instructor.email
        })
    } catch (e) {
        return res.status(403).json({
            error:e.message
        });
    }
};



//internal functions
const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "1d",
        });
        return token;
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    signupController,
    loginController
};