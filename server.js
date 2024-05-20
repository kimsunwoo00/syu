const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt'];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILENAME_LENGTH = 255;

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileExt = path.extname(file.originalname).toLowerCase().substring(1);
        if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
            return cb(new Error('허용되지 않는 파일 형식입니다.'));
        }
        if (file.originalname.length > MAX_FILENAME_LENGTH) {
            return cb(new Error('파일 이름이 너무 깁니다.'));
        }
        cb(null, true);
    }
}).single('file');

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // 멀터 오류
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // 파일 필터 오류 또는 기타 오류
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: '업로드된 파일이 없습니다.' });
        }

        res.json({ message: '파일이 안전합니다.' });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
