const path = require("path");
const fs = require("fs-extra");
const md5 = require("md5");
const sidebar = require("../helpers/sidebar");

const { randomNumber } = require("../helpers/libs");
const { Image, Comment } = require("../models/index");

const ctrl = {};

ctrl.index = async (req, res) => {
  let viewModel = { image: {}, comments: {} };
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    image.views += 1;
    viewModel.image = image;
    await image.save();
    const comments = await Comment.find({ image_id: image._id });
    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);
    res.render("image", viewModel);
  } else {
    res.redirect("/");
  }
};

const VALID_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif"];

const isExtensionValid = (ext) => VALID_EXTENSIONS.includes(ext);

ctrl.create = async (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const images = await Image.find({ filename: imgUrl });

    if (images.length > 0) {
      saveImage();
    } else {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const imageTempPath = req.file.path;
      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

      if (!isExtensionValid(ext)) {
        await fs.unlink(imageTempPath);
        return res.status(500).json({ error: "Only images are allowed" });
      }

      await fs.rename(imageTempPath, targetPath);
      const newImg = new Image({
        title: req.body.title,
        filename: imgUrl + ext,
        description: req.body.description,
      });
      await newImg.save();
      res.redirect("/images/" + imgUrl);
    }
  };

  await saveImage();
};

ctrl.like = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  //console.log(image.filename);
  //console.log(image.filename.$regex);

  if (image) {
    image.likes += 1;
    await image.save();
    res.json({ likes: image.likes });
  } else {
    res.status(500).json({ error: "Internal error" });
  }
};

ctrl.comment = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    await newComment.save();

    res.redirect("/images/" + image.uniqueId);
  } else {
    redirect("/");
  }
};

ctrl.remove = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id },
  });
  if (image) {
    await fs.unlink(path.resolve("./src/public/upload/" + image.filename));
    await Comment.deleteMany({ image_id: image._id });
    await image.deleteOne();
    res.json(true);
  }
};

module.exports = ctrl;
