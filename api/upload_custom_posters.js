const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const { uploadImageToImageKit } = require('./utils/imagekit');
const Poster = require('./models/Poster');
const HomeContent = require('./models/HomeContent');
const User = require('./models/User');

const MONGO_URI = 'mongodb://adarshsachan7071_db_user:uFlWpq6NY7MHJTm9@ac-lqvblgl-shard-00-00.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-01.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-02.ksxxelf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-de1ek8-shard-0&authSource=admin&retryWrites=true&w=majority';

// Clean political poster graphics (NOT screenshots)
const cleanImages = [
    {
        path: 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/41589c65-27c3-43c3-bde4-780c828e8a55/.user_uploaded/media_1787313414993.jpg',
        title: 'अखिलेश यादव जी कानपुर आगमन - सतीश कुमार निगम'
    },
    {
        path: 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/41589c65-27c3-43c3-bde4-780c828e8a55/.user_uploaded/media_1787313425250.png',
        title: 'युवाओं को नौकरी, शिक्षा शानदार - 2027 में समाजवादी सरकार'
    },
    {
        path: 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/41589c65-27c3-43c3-bde4-780c828e8a55/.user_uploaded/media_1787313434975.png',
        title: 'नफरत नहीं, विकास का विचार - 2027 में समाजवादी सरकार'
    },
    {
        path: 'C:/Users/Adarsh/.gemini/antigravity-ide/brain/41589c65-27c3-43c3-bde4-780c828e8a55/.user_uploaded/media_1787313446463.png',
        title: 'सड़क, बिजली, रोजगार का विस्तार - 2027 में समाजवादी सरकार'
    }
];

// Original header image (Akhilesh Yadav speaking to crowd)
const OLD_HEADER_IMAGE = 'https://ik.imagekit.io/v8swalwfs/stf-assets/image_1787309596741_5e41a3b9_9gQYjAoY4';

async function updateCleanPosters() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const admin = await User.findOne({ role: 'master-admin' });
        const adminId = admin ? admin._id : new mongoose.Types.ObjectId();

        // 1. Remove previous screenshot posters
        console.log('Deleting previous posters to prevent screenshots clutter...');
        await Poster.deleteMany({
            $or: [
                { title: /सतीश कुमार निगम/ },
                { title: /युवाओं को नौकरी/ },
                { title: /नफरत नहीं/ },
                { title: /सड़क, बिजली/ }
            ]
        });

        // 2. Upload clean graphics to ImageKit & Add to Posters DB
        console.log('Uploading clean graphics to ImageKit...');
        const uploadedUrls = [];

        for (const img of cleanImages) {
            if (fs.existsSync(img.path)) {
                const buffer = fs.readFileSync(img.path);
                const result = await uploadImageToImageKit(buffer, 'stf-campaign-posters');
                console.log(`✅ Uploaded clean image: ${img.title} -> ${result.url}`);

                await Poster.create({
                    title: img.title,
                    imageUrl: result.url,
                    uploadedBy: adminId,
                    downloadCount: Math.floor(Math.random() * 200) + 50,
                    isActive: true
                });
                uploadedUrls.push(result.url);
            } else {
                console.log(`⚠️ File not found: ${img.path}`);
            }
        }

        // 3. Keep header old image and set old content
        console.log('Updating HomeContent slide image back to the old banner image...');
        let homeContent = await HomeContent.findOne({ isActive: true });
        if (!homeContent) {
            homeContent = new HomeContent();
        }

        homeContent.hero = {
            slides: [
                {
                    badge: 'समाजवाद का अर्थ है – सबके लिए सम्मान, अवसर और न्याय।',
                    title: 'आदरणीय श्री अखिलेश यादव जी',
                    subtitle: 'श्री अखिलेश यादव जी उत्तर प्रदेश के प्रमुख समाजवादी नेता, समाजवादी पार्टी के राष्ट्रीय अध्यक्ष एवं प्रदेश के पूर्व मुख्यमंत्री हैं।',
                    image: OLD_HEADER_IMAGE,
                    ctaText: 'सदस्य बनें',
                    ctaLink: '/joinus',
                    stats: [
                        { num: '37', label: 'प्रदेश के सबसे ज्यादा सांसदों की पार्टी' }
                    ]
                }
            ]
        };

        await homeContent.save();
        console.log('🎉 HomeContent Hero Slide restored with the old banner graphic!');

        console.log('🎉 CLEAN MIGRATION PROCESS COMPLETED!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error during clean migration:', err);
        process.exit(1);
    }
}

updateCleanPosters();
