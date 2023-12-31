import mongoose, { isValidObjectId } from "mongoose"
import novels from "../models/novels.js"
import users from "../models/users.js"
export const getNovels = async (req, res) => {
    const NovelwithoutCountView = await novels.find().populate({
        path: 'owner',
        model: 'users',
        select: '_id username profileImgPath'
    }).exec()
    const Novels = NovelwithoutCountView.map((novel) => {
        const chapters = novel.chapter;
        const chapterViewsSum = chapters.reduce((acc, chapter) => acc + chapter.views.length, 0);
        const chapterLikeSum = chapters.reduce((acc, chapter) => acc + chapter.like.length, 0);
        return {
            ...novel._doc,
            chapterViewsSum: chapterViewsSum,
            chapterLikeSum: chapterLikeSum
        };
    });

    return res.status(200).json(Novels);
}

export const getNovel = async (req, res) => {
    const novelId = req.query.novelId
    const Novel = await novels.findById(novelId).populate({
        path: 'owner',
        model: 'users',
        select: '_id username profileImgPath'
    }).exec()
    if (!Novel) {
        return res.status(400).json({ message: 'Novel not found' })
    }
    return res.status(200).json(Novel)
}

export const createNovel = async (req, res) => {
    const {
        owner,
        title,
        description,
        category
    } = req.body
    if (!isValidObjectId(owner)) return res.status(400).json({ message: "Non valid objectId" })
    if (!title || !description || !category) {
        return res.status(400).json({ message: 'Please enter title description and category' })
    }
    if (!req.files?.length) {
        res.status(400).json({ message: 'Please choose an image of this novel' })
    }
    const images = req.files[0].originalname
    const Novel = await novels.create({
        title,
        description,
        images,
        owner,
        category
    })
    if (Novel) {
        return res.status(200).json(Novel)
    } else {
        return res.status(400).json({ message: 'Error occured' })
    }
}

export const editNovel = async (req, res) => {
    const {
        novelId,
        title,
        description,
    } = req.body
    if (!isValidObjectId(novelId)) return res.status(400).json({ message: "Non valid objectId" })
    const Novel = await novels.findById(novelId).exec()
    if (!Novel) return res.status(400).json({ message: 'Novel not found' })
    if (title) Novel.title = title
    if (description) Novel.description = description
    if (req.files?.length) Novel.images = req.files[0].originalname
    await Novel.save()
    return res.status(200).json(Novel)

}

export const deleteNovel = async (req, res) => {
    const { novelId } = req.body
    if (!isValidObjectId(novelId)) return res.status(400).json({ message: "Non valid objectId" })
    const Novel = await novels.findById(novelId)
    if (!Novel) {
        return res.status(400).json({ message: 'Novel not found' })
    }
    await Novel.deleteOne();
    return res.status(200).json({ message: 'Delete success' })
}

export const getBookshelfByUserId = async (req, res) => {
    const userId = req.query.userId
    const Novel = await novels.find({ bookshelf: { $in: [userId] } }).populate({
        path: 'owner',
        model: 'users',
        select: '_id username profileImgPath'
    }).exec()
    return res.status(200).json(Novel)
}

export const addOrRemoveNovelToBookshelf = async (req, res) => {
    const {
        novelId,
        userId
    } = req.body
    const Novel = await novels.findById(novelId).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const userInBookshelf = Novel.bookshelf.findIndex((item) => item.equals(userIdObjectId));
    let message;
    if (userInBookshelf === -1) {
        Novel.bookshelf.push(userIdObjectId);
        message = "Add to bookshelf successfully"
    } else {
        Novel.bookshelf.splice(userInBookshelf, 1)
        message = "Remove from the bookshelf successfully"
    }
    await Novel.save();
    return res.status(200).json({ message })
}

export const getChapters = async (req, res) => {
    const novelId = req.query.novelId
    const Novel = await novels.findById(novelId).populate({
        path: 'chapter.comments.author',
        model: 'users',
        select: '_id username profileImgPath'
    }).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    return res.status(200).json(Novel.chapter)
}

export const getChapter = async (req, res) => {
    const novelId = req.query.novelId
    const chapterId = req.query.chapterId
    const userId = req.query.userId
    const Novel = await novels.findById(novelId).populate({
        path: 'chapter.comments.author',
        model: 'users',
        select: '_id username profileImgPath'
    }).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    const Chapter = Novel.chapter.find((chapter) => chapter._id == chapterId)
    if (!Chapter) {
        return res.status(400).json({ message: "Chapter not found" })
    }
    const userIdObjectId = new mongoose.Types.ObjectId(userId)
    const viewChapter = Chapter.views.findIndex((userid) => userid == userId)
    if (viewChapter === -1) {
        Chapter.views.push(userIdObjectId)
        await Novel.save()
    }
    return res.status(200).json(Chapter)
}

export const createChapter = async (req, res) => {
    const { novelId, title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Please enter title and content of this chapter!" });
    }
    const Novel = await novels.findById(novelId).exec();
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" });
    }
    const createdChapter = await Novel.chapter.create({
        title,
        content
    });
    Novel.chapter.push(createdChapter);
    const novelChapterId = createdChapter._id;
    const updateQuery = { _id: { $in: Novel.bookshelf } };
    await users.updateMany(updateQuery, { $push: { notification: novelChapterId } });
    await Novel.save();
    return res.status(200).json(Novel.chapter);
}

export const editChapter = async (req, res) => {
    const {
        novelId,
        chapterId,
        title,
        content
    } = req.body
    if (title === '' || content === '') {
        return res.status(400).json({ message: "Please enter title and content of this chapter!" })
    }
    const Novel = await novels.findById(novelId).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    const Chapter = Novel.chapter.find((chapter) => chapter._id == chapterId)
    if (!Chapter) {
        return res.status(400).json({ message: "Chapter not found" })
    }
    Chapter.title = title
    Chapter.content = content
    Chapter.updatedAt = Date.now()
    await Novel.save()
    return res.status(200).json(Chapter)
}

export const deleteChapter = async (req, res) => {
    const {
        novelId,
        chapterId,
    } = req.body
    const Novel = await novels.findById(novelId).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    const chapterIndex = Novel.chapter.findIndex((chapter) => chapter._id == chapterId);
    if (chapterIndex === -1) {
        return res.status(400).json({ message: "Chapter not found in the novel" });
    }
    Novel.chapter.splice(chapterIndex, 1);
    await Novel.save();
    const updateQuery = { notification: chapterId };
    await users.updateMany(updateQuery, { $pull: { notification: chapterId } });
    return res.status(200).json({ message: "Chapter deleted successfully" });
}

export const addOrRemoveLike = async (req, res) => {
    const { novelId, chapterId, userId } = req.body
    const Novel = await novels.findById(novelId).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    const Chapter = Novel.chapter.find((chapter) => chapter._id == chapterId)
    if (!Chapter) {
        return res.status(400).json({ message: "Chapter not found" })
    }
    const findUserLiked = Chapter.like.findIndex((userid) => userid == userId)
    if (findUserLiked === -1) {
        Chapter.like.push(new mongoose.Types.ObjectId(userId))
    } else {
        Chapter.like.splice(findUserLiked, 1)
    }
    await Novel.save()
    return res.status(200).json({ message: "Success" })
}

export const sendComment = async (req, res) => {
    const { novelId, chapterId, author, comment } = req.body
    const Novel = await novels.findById(novelId).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    const Chapter = Novel.chapter.find((chapter) => chapter._id == chapterId)
    if (!Chapter) {
        return res.status(400).json({ message: "Chapter not found" })
    }
    Chapter.comments.push({
        author,
        comment
    })
    await Novel.save()
    return res.status(200).json({ message: "Success" })
}

export const editComment = async (req, res) => {
    const { novelId, chapterId, commentId, comment } = req.body
    const Novel = await novels.findById(novelId).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    const Chapter = Novel.chapter.find((chapter) => chapter._id == chapterId)
    if (!Chapter) {
        return res.status(400).json({ message: "Chapter not found" })
    }
    const Comment = Chapter.comments.find((comment) => comment._id == commentId)
    if (!Comment) {
        return res.status(400).json({ message: "Comment not found" })
    }
    Comment.comment = comment
    await Novel.save()
    return res.status(200).json({ message: "Comment edited successfully" })
}

export const deleteComment = async (req, res) => {
    const { novelId, chapterId, commentId } = req.body
    const Novel = await novels.findById(novelId).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    const Chapter = Novel.chapter.find((chapter) => chapter._id == chapterId)
    if (!Chapter) {
        return res.status(400).json({ message: "Chapter not found" })
    }
    const CommentIndex = Chapter.comments.findIndex((comment) => comment._id == commentId)
    if (CommentIndex === -1) {
        return res.status(400).json({ message: "Comment not found" })
    }
    Chapter.comments.splice(CommentIndex, 1)
    await Novel.save()
    return res.status(200).json({ message: "Comment deleted successfully" })
}

export const addOrRemoveLikeComment = async (req, res) => {
    const { novelId, chapterId, commentId, userId } = req.body
    const Novel = await novels.findById(novelId).exec()
    if (!Novel) {
        return res.status(400).json({ message: "Novel not found" })
    }
    const Chapter = Novel.chapter.find((chapter) => chapter._id == chapterId)
    if (!Chapter) {
        return res.status(400).json({ message: "Chapter not found" })
    }
    const Comment = Chapter.comments.find((comment) => comment._id == commentId)
    if (!Comment) {
        return res.status(400).json({ message: "Comment not found" })
    }
    const CommentIndex = Comment.like.findIndex((userid) => userid == userId)
    if (CommentIndex === -1) {
        Comment.like.push(new mongoose.Types.ObjectId(userId))
    } else {
        Comment.like.splice(CommentIndex, 1)
    }
    await Novel.save()
    return res.status(200).json({ message: "Success" })
}