import express from 'express';
export default express.static(process.env.IMAGE_UPLOAD_DIR);
