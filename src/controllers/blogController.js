//=====================Importing Module and Packages=====================//
const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
var moment = require('moment');

//=====================Checking the input value is Valid or Invalid=====================//
let checkValid = function (value) {
    if (typeof value == "undefined" || typeof value == "number" || value.length === 0 || value == null) return false
    return true
}

//=============Create a blog document from request body. Get authorId in request body only ====//
const createBlog = async function (req, res) {
    try {
        let blog = req.body
        let { title, authorId, category, subcategory, body, tags } = blog
        //=====================Checking the validation=====================//
        if (!(title && authorId && category && body))
            return res.status(400).send({ status: false, msg: "Please fill the Mandatory Fields." });

        //=====================Validation of Title=====================//
        if (!checkValid(title))
            return res.status(400).send({ status: false, message: "Please enter Blog Title." });

        //=====================Validation of Blog Body=====================//
        if (!checkValid(body))
            return res.status(400).send({ status: false, message: "Please enter Blog Body." });

        //=====================Validation of Tags=====================//
        if (!checkValid(tags))
            return res.status(400).send({ status: false, message: "Please enter Blog Tags." });

        //=====================Validation of Category=====================//
        if (!checkValid(category))
            return res.status(400).send({ status: false, message: "Please enter Blog Category." });

        //=====================Validation of Subcategory=====================//
        if (!checkValid(subcategory))
            return res.status(400).send({ status: false, message: "Please enter Subcategory of The Blog." })
        //===================== Checking given Published is True or False inside Body. Then publishedAt will Update the Current Date & Time When You Create Blog =====================//
        if (req.body.isPublished == true) {
            req.body.publishedAt = moment().format()
        }
        //===================== Checking given AuthorID Whether It is You or Not! =====================//
        let authorid = blog.authorId
        const authorArr = await authorModel.find().select({ _id: 1 })
        let checkAuthorID = false
        authorArr.forEach(element => {
            let authorID2 = element._id
            if (authorID2 == authorid) {
                checkAuthorID = true
            }
        });
        if (checkAuthorID) {
            let data = await blogModel.create(blog)
            res.status(201).send({ status: true, data: data })

        }
        else res.status(400).send({ msg: "author id is not valid" })

    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

// =========================================
let getBlogs = async function (req, res) {
    try {
        let { tags, authorId, category, subcategory } = req.query
        const filter = { isDeleted: false, isPublished: true }
        if (category) filter.category = category
        if (authorId) filter.authorId = authorId
        if (subcategory) filter.subcategory = subcategory.split(",");
        if (tags) filter.tags = tags.split(",");

        const matchedData = await blogModel.find(filter)
        //===================== Checking length of blogData =====================//
        if (matchedData.length == 0) res.status(404).send({ status: false, msg: "No data found" })
        return res.status(200).send({ status: true, data: matchedData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



// ===================================updateBlogs======================
const updateBlogs = async function (req, res) {
    try {
        let Id = req.params.blogId
        let { title, body, tags, subcategory } = req.body
        let validBlogId = await blogModel.findById(Id).select({ _id: 1 })
        if (!validBlogId) return res.status(404).send({ status: false, msg: "Please input valid BlogId." })

        let blog = await blogModel.findOneAndUpdate({ _id: Id }, {
            $push: { subcategory: subcategory, tags: tags },
            $set: { title: title, body: body, isPublished: true, publishedAt: moment().format() }
        }, { new: true })

        return res.status(200).send({ status: true, msg: blog })
    }
    catch (error) {
        return res.status(400).send({ status: false, msg: error.message })
    }
}

    // ======================delBlogByParams=============================
    const delBlogByParams = async function (req, res) {
        try {
            let blogToBeDeleted = req.params.blogId;
            let getBlog = await blogModel.findOne({ _id: blogToBeDeleted });
            if (!getBlog) res.status(404).send({ status: false, msg: "No Blog" })
            let check = getBlog.isDeleted;
            if (!check) {
                let deleteBlog = await blogModel.findByIdAndUpdate({ _id: blogToBeDeleted }, { isDeleted: true, deletedAt: moment().format() }, { new: true })
                res.status(200).send({ status: true, data: deleteBlog })
            } else {
                res.status(404).send("blog is not exist")
            }
        }
        catch (error) {
            return res.status(500).send({status:false,msg: error.message})
        }
    }

    // ========================DeleteBlog By Query Param===========================
    const delBlogByQuery = async function (req, res) {
        try {
            let filter = req.filter;
            let matchedData = await blogModel.find(filter);
            if (matchedData.length === 0) return res.status(404).send({ status: false, message: "no such data with provided filter conditions" });
            let updateDelete = await blogModel.updateMany({ $and: [{ authorId: req.authorizedDataToBeDeleted }, filter] }, { $set: { isDeleted: true, deletedAt: moment().format()} }, { new: true })

            console.log(updateDelete);
            return res.status(200).send({ status: true, data: updateDelete })
        }
        catch (error) {
            return res.status(500).send({status:false,msg: error.message})
        }
    }


    module.exports.delBlogByQuery = delBlogByQuery
    module.exports.updateBlogs = updateBlogs
    module.exports.delBlogByParams = delBlogByParams
    module.exports.getBlogs = getBlogs
    module.exports.createBlog = createBlog