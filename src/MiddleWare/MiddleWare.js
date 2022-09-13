const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel")

const authenticate = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
        let decodedToken = jwt.verify(token, "functionup-Plutonium_Mini_Blog");
        if (!decodedToken) {
            return res.status(403)({ status: false, msg: "token is invalid or NOT AUTHENTICATED" });
        }
        req.decodedToken = decodedToken
        next()
    }
    catch (error) {
        return res.status(500).send({status:false,msg: error.message})
    }
}


const authorise = async function (req, res, next) {
    try {
        //If user Gives blogid
        let userToModify = req.params.blogId
        let userToLoggedIn = req.decodedToken.authorid
        let blog = await blogModel.find({ _id: userToModify })
        let authorid = blog[0].authorId
        if ((authorid != userToLoggedIn)) {
            return res.status(403).send({ msg: "User Has No Access to the Collection due to blogID" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({status:false,msg: error.message})
    }
}

const authorise2 = async function (req, res, next) {
    try {
        let userToLoggedIn = req.decodedToken.authorid
        let {category, authorId, tags, subcategory, isPublished} = req.query;
        const filter = {isDeleted: false};
        if(category) filter.category = category;
        if(authorId) filter.authorId = authorId;
        if(tags) filter.tags = tags.split(",");
        if(subcategory) filter.subcategory = subcategory.split(",");
        // if isPublished true then we dont needto add this filter because we nned to delete only if blog is unpublished
        if(isPublished == false) filter.isPublished = isPublished;

        let matchedData = await (await blogModel.find(filter)).filter(x => x.authorId == userToLoggedIn);
        if(matchedData.length === 0)  return res.status(404).send({status: false, msg: "no such data with provided filter conditions"});

        let filterAuthorId = matchedData[0].authorId
       
        if ((filterAuthorId != userToLoggedIn)) {
            return res.status(403).send({ msg: "User Has No Access" })
        }
        req.authorizedDataToBeDeleted = userToLoggedIn;
        req.filter = filter;
        next()
    }
    catch (error) {
        return res.status(500).send({status:false,msg: error.message})
    }
}




module.exports.authenticate = authenticate
module.exports.authorise = authorise
module.exports.authorise2 = authorise2