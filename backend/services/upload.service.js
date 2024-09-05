const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;



/*

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage });

*/