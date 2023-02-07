const multer = require('multer');

const MIME_TYPE_MAP = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpeg',
	'image/png': 'png',
	'image/jfif': 'jfif' 
};
const fileUpload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, 'public/images');
		},

		filename: (req, file, cb) => {
			const ext = MIME_TYPE_MAP[file.mimetype];
			cb(null, Date.now() + '.' + ext);
		},
		fileFilter: (req, file, cb) => {
			const isValid = !!MIME_TYPE_MAP[file.mimetype];
			const error = isValid ? null : new Error('Invalid Mime Type');
			cb(error, isValid);
		}
	})
}); //it provide middleware

module.exports = fileUpload;
