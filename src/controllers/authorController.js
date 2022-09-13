
//=====================Importing Module and Packages=====================//
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");


//=====================Checking the input value is Valid or Invalid=====================//
let checkValid = function (value) {
    if (typeof value == "undefined" || typeof value == "number" || value.trim().length === 0 || value == null) return false
    return true
}


const createAuthor = async function (req, res) {
    try {
        let author = req.body;
        let { fname, lname, title, email, password } = author
        //=====================Checking the validation=====================//
        if (!(fname && lname && title && email && password)) {
            return res.status(400).send({ status: false, msg: "All fields are mandatory." })
        }
         //=====================Validation of First Name=====================//
         if (!checkValid(fname)) return res.status(400).send({ status: false, message: "Please Provide valid fname" })
 
 
         //=====================Validation of Last Name=====================//
         if (!checkValid(lname)) return res.status(400).send({ status: false, message: "Please Provide valid lname" })
 
 
         //=====================Validation of Title=====================//
         if (!(/^(Mr|Mrs|Miss)+$\b/).test(title)) return res.status(400).send({ status: false, msg: "Please Use Valid Title." })
 
 
         //=====================Validation of EmailID=====================//
         if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/).test(email)) { return res.status(400).send({ status: false, msg: "Please provide valid Email" }) }
         let checkDuplicate = await authorModel.findOne({ email })
         if (checkDuplicate) { return res.status(400).send({ status: false, msg: `${email} already exists please provide another EmailID.`}) }
 
 
         //=====================Validation of Password=====================//
         if (!checkValid(password)) return res.status(400).send({ status: false, message: "Please Provide valid password" })
 
         //=====================Create Author=====================//
         let createAuthor = await authorModel.create(author)
         res.status(201).send({ status: true, msg: createAuthor })

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

// ==================================================================

//Login User Create Jwt
//Download npm i jsonwebtoken
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpZCI6IjYzMTVlZmVkMTFkMzVjYjJiODZjMzg4MyIsImJhdGNoIjoiUGx1dG9uaXVtIiwib3JnYW5pc2F0aW9uIjoiRlVuY3Rpb25VcCIsIlByb2plY3QiOiJNaW5pX0Jsb2ciLCJpYXQiOjE2NjI1NDkxMjd9.eb9ULFTvuATCnM5SbOc81QzGjg-WNredbMSrNok8DR4
//{
//     "emailId" : "chetan@gmail.com",
//     "password" : "chetam@123"
// }

const loginUser = async function (req, res) {
    try {
        let emailId = req.body.emailId;
        let password = req.body.password;
        let author = await authorModel.findOne({ emailId: emailId, password: password });
        if (!author)
            return res.status(404).send({
                status: false,
                msg: "username or the password is not corerct",
            });

        let token = jwt.sign(
            {
                authorid: author._id.toString(),
                batch: "Plutonium",
                organisation: "FUnctionUp",
                Project: "Mini_Blog"
            },
            "functionup-Plutonium_Mini_Blog"
        );
        res.setHeader("x-api-key", token);
        res.status(201).send({ status: true, data: token });
    }
    catch (error) {
        return res.status(500).send({status:false,msg: error.message})
    }
};

module.exports.loginUser = loginUser
module.exports.createAuthor = createAuthor