const { Comment, Image } = require('../models');

async function countDocuments(model) {
    try {
        return await model.countDocuments();
    } catch (error) {
        return 0;
    }
}

async function aggregateTotal(model, field) {
    try {
        const result = await model.aggregate([
            {
                $group: {
                    _id: '1',
                    [`${field}Total`]: { $sum: `$${field}` }
                }
            }
        ]);

        return result?.[0]?.[`${field}Total`] || 0;
    } catch (error) {
        return 0;
    }
}

async function imagesCounter() {
    return await countDocuments(Image);
}

async function commentsCounter() {
    return await countDocuments(Comment);
}

async function imagesTotalViewsCounter() {
    return await aggregateTotal(Image, 'views');
}

async function likeTotalCounter() {
    return await aggregateTotal(Image, 'likes');
}

module.exports = async () => {
    const [imagesCount, commentsCount, totalViews, totalLikes] = await Promise.all([
        imagesCounter(),
        commentsCounter(),
        imagesTotalViewsCounter(),
        likeTotalCounter()
    ]);

    return {
        images: imagesCount,
        comments: commentsCount,
        views: totalViews,
        likes: totalLikes
    };
};

