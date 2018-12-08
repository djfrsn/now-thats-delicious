const mongoose = require('mongoose');
const Store = mongoose.model('Store');

const jimp = require('jimp');
const uuid = require('uuid');

const multer = require('multer');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');

    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: "That filetype isn't allowed!" }, false);
    }
  }
};

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' });
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    return next(); // go to next middleware
  }
  const extension = req.file.mimetype.split('/')[1];

  req.body.photo = `${uuid.v4()}.${extension}`;
  // resize now
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // after writing photo to filesystem
  next();
};

exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save();

  req.flash(
    'success',
    `Successfully Created ${store.name}. Care to leave a review?`
  );

  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();

  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });

  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point'; // Set location data to be a point
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead of the old one
    runValidators: true
  }).exec();

  req.flash(
    'success',
    `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${
      store.slug
    }">View Store →</a>`
  );

  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });

  if (!store) {
    return next(); // Send to 404 page if store not found
  }

  res.render('store', { title: store.name, store });
};
exports.getStoresByTag = async (req, res, next) => {
  const tags = await Store.getTagsList();
  const tag = req.params.tag;
  res.render('tags', { title: 'Tags', tags, tag });
};
