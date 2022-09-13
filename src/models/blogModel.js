//=====================Importing Packages=====================//
const mongoose = require('mongoose');

//=====================Storing type of AuthorID=====================//
const ObjectId = mongoose.Schema.Types.ObjectId

//=====================Creating Blog Schema=====================//
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    authorId: { type: ObjectId, required: true, ref: "authorDataBase" },
    tags: [{ type: String, trim: true }],
    category: { type: String, required: true, trim: true },
    subcategory: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: String, default: null },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

//=====================Module Export=====================//
module.exports = mongoose.model('blogProject_1', blogSchema)