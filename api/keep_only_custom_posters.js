const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const { uploadImageToImageKit } = require('./utils/imagekit');
const Poster = require('./models/Poster');
const HomeContent = require('./models/HomeContent');
const User = require('./models/User');

const MONGO_URI = 'mongodb://adarshsachan7071_db_user:uFlWpq6NY7MHJTm9@ac-lqvblgl-shard-00-00.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-01.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-02.ksxxelf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-de1ek8-shard-0&authSource=admin&retryWrites=true&w=majority';

// The 4 clean posters provided by the user
const cleanPosters = [
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

const OLD_HEADER_IMAGE = 'https://ik.imagekit.io/v8swalwfs/stf-assets/image_1787309596741_5e41a3b9_9gQYjAoY4';

async function processPosters() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const admin = await User.findOne({ role: 'master-admin' });
        const adminId = admin ? admin._id : new mongoose.Types.ObjectId();

        // 1. Delete ALL posters currently in the collection
        console.log('Removing ALL current posters...');
        await Poster.deleteMany({});

        // 2. Upload and insert ONLY the 4 proper custom posters
        console.log('Uploading and inserting ONLY the 4 clean posters...');
        for (const img of cleanPosters) {
            if (fs.existsSync(img.path)) {
                const buffer = fs.readFileSync(img.path);
                const result = await uploadImageToImageKit(buffer, 'stf-campaign-posters');
                console.log(`✅ Uploaded and inserted: ${img.title} -> ${result.url}`);

                await Poster.create({
                    title: img.title,
                    imageUrl: result.url,
                    uploadedBy: adminId,
                    downloadCount: Math.floor(Math.random() * 200) + 50,
                    isActive: true
                });
            } else {
                console.log(`⚠️ File not found: ${img.path}`);
            }
        }

        // 3. Ensure HomeContent Hero has the old header banner graphic
        console.log('Restoring HomeContent Hero Banner...');
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
        console.log('🎉 Hero header restored!');

        console.log('🎉 DONE!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

processPosters();
