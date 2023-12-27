const {Image} = require('../models');

module.exports ={
    async popular (){
        const Images = await Image.find()
            .limit(9)
            .sort({likes : -1});

        return Images;
    }
    
}