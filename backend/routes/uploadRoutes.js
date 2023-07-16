import path from 'path';
import express from 'express';
import multer from 'multer';
const router = express.Router();

// storage = where do we want uploads to go (before it gets saved to db)
const storage = multer.diskStorage({
  destination(req, file, callback) {
    // null is for error
    // 'uploads/' is where we want our uploads to go  - lives in the project root
    callback(null, 'uploads/');
  },

  filename(req, file, callback) {
    // callback(null, `${file.fieldname}-${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
    // callback(null, `${file.fieldname}-${file.originalname}${path.extname(file.originalname)}`);
    // bug: clg(updatedProduct) --> image: "/uploads/image-detective.png.png") this works anyway

    // testing
    callback(null, `${file.fieldname}-${file.originalname}`);
    // bug fixed: clg(updatedProduct) --> image: "/uploads/image-detective.png")
  },
});

// check file format(s) to accepts only images
// code not working:
// function checkFileType(file, callback) {
//   const filetypes = /jpg|jpeg|png/; // regex
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);
//   if (extname && mimetype) {
//     return callback(null, true);
//   } else {
//     callback('Please upload images only (.jpg, .jpeg, or .png formats');
//   }
// }
// from github
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // true to accept the file // cb(null, false) to reject the file)
  } else {
    cb(new Error('Please upload images only (.jpg, .jpeg, .png, .webp formats'), false);
  }
}

const upload = multer({
  storage,
  //   checkFileType, // no effect, able to upload a pdf
  fileFilter,
});

// // now in the frontend we can add an image field to upload image to submit it to this route:

// not working with code below
// on choose file: , image uploading but url not updating. POST http://localhost:3000/api/upload 500 (Internal Server Error)

// router.post('/', upload.single('image'), (req, res) => {
//   // upload.single('image') is the middleware we are using
//   // ${file.fieldname} (line 15) is whatever we pass in, here: 'image'
//   if (error) {
//     res.status(400).send({ message: error.message });
//     console.log(error);
//   }
//   res.status(200).send({
//     message: 'Image uploaded',
//     image: `/${req.file.path}`, // image = imageUrl
//   });
// });

// this version works
const uploadSingleImage = upload.single('image');
router.post(
  '/', // (= '/api/upload')
  (req, res) => {
    uploadSingleImage(req, res, function (err) {
      if (err) {
        res.status(400).send({ message: err.message });
      }
      res.status(200).send({
        message: 'Image uploaded successfully',
        image: `/${req.file.path}`,
      });
    });
  }
);

export default router; // import into server.js to set up upload route '/api/upload'
