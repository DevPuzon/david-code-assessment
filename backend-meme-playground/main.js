const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
 
function encryptData(data, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}
 
function cacheEncryptedData(data, filePath) {
    fs.writeFileSync(filePath, data, 'utf8');
}
 
async function fetchMemeImages() {
    try {
        const response = await axios.get('https://api.imgflip.com/get_memes'); 
        return response.data.data.memes;
    } catch (error) {
        console.error('Error fetching meme images:', error);
        return [];
    }
}

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

async function main() { 

    const memeImages = await fetchMemeImages();
    
    console.log('Total number of images: ',memeImages.length);
 
    const imagesWithNameThe = memeImages.filter(image => image.name.toLowerCase().includes('the '));
    console.log('Total number of images with the: ',imagesWithNameThe.length); 
 
    const randomImage = memeImages[Math.floor(Math.random() * memeImages.length)];
    const imageUrl = randomImage.url;
 
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const imagePath = path.join('/tmp/meme_image.jpg'); 
    ensureDirectoryExistence(imagePath);
    const imageStream = fs.createWriteStream(imagePath);
    imageResponse.data.pipe(imageStream);
    await new Promise((resolve, reject) => {
        imageStream.on('finish', resolve);
        imageStream.on('error', reject);
    });

    console.log('Meme image saved at:', imagePath);

    const memeImageJson = JSON.stringify(Object.assign(randomImage,{imagePath}));
    const encryptionKey = process.env.ENCRYPTION_KEY; 
    const initializationVector = crypto.randomBytes(16); 
    const encryptedData = encryptData(memeImageJson, encryptionKey, initializationVector);
 
    const encryptedFilePath = '/tmp/encrypted_meme.txt';
    cacheEncryptedData(encryptedData, encryptedFilePath);
    console.log('Encrypted meme image JSON saved at:', encryptedFilePath);
}

module.exports = { fetchMemeImages };

main().catch(console.error);
