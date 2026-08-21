const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Banner = require('./models/Banner');
const Poster = require('./models/Poster');
const Event = require('./models/Event');
const News = require('./models/News');
const Reel = require('./models/Reel');
const Task = require('./models/Task');
const HomeContent = require('./models/HomeContent');
const TrainingModule = require('./models/TrainingModule');

const MONGO_URI = 'mongodb://adarshsachan7071_db_user:uFlWpq6NY7MHJTm9@ac-lqvblgl-shard-00-00.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-01.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-02.ksxxelf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-de1ek8-shard-0&authSource=admin&retryWrites=true&w=majority';

// ImageKit URLs (100% hotlink-safe)
const assets = {
  logo: 'https://ik.imagekit.io/v8swalwfs/stf-assets/image_1787309591679_60ec34e9_-vbfiMrkDX',
  frame1: 'https://ik.imagekit.io/v8swalwfs/stf-frames/image_1787309593128_64ec9d38_IOAfnP1PW',
  frame2: 'https://ik.imagekit.io/v8swalwfs/stf-frames/image_1787309594329_12230314_NIbsp6LfUN',
  frame3: 'https://ik.imagekit.io/v8swalwfs/stf-frames/image_1787309595549_490e61e6_1JXcZNzqy',
  hero: 'https://ik.imagekit.io/v8swalwfs/stf-assets/image_1787309596741_5e41a3b9_9gQYjAoY4'
};

const imagesPool = [
  assets.hero,
  assets.logo
];

async function seedVastData() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const admin = await User.findOne({ role: 'master-admin' });
        const adminId = admin ? admin._id : new mongoose.Types.ObjectId();

        // 1. Seed 30+ Samajwadi Campaign Posters
        console.log('Generating 35 Posters...');
        await Poster.deleteMany({});
        const postersData = [];
        const posterCategories = [
            'समाजवादी विकास रथ यात्रा', 'सपा युवा डिजिटल पहचान पत्र', 'विधानसभा स्वागत बैनर',
            'किसान उत्थान अभियान फ्रेम', 'महिला सशक्तिकरण पोस्टर', 'अखिलेश यादव लाइव जनसभा',
            'सपा डिजिटल आर्मी कार्ड', 'रोजगार अधिकार रैली फ़्रेम'
        ];

        for (let i = 1; i <= 35; i++) {
            const category = posterCategories[i % posterCategories.length];
            const frameImg = i % 3 === 0 ? assets.frame1 : (i % 3 === 1 ? assets.frame2 : assets.frame3);
            postersData.push({
                title: `${category} - फ़्रेम ${i}`,
                imageUrl: frameImg,
                uploadedBy: adminId,
                downloadCount: Math.floor(Math.random() * 500) + 10,
                isActive: true
            });
        }
        await Poster.insertMany(postersData);
        console.log(`Successfully seeded ${postersData.length} posters.`);

        // 2. Seed 50+ Samajwadi News (with categories & in Hindi)
        console.log('Generating 55 News & Programs in Hindi...');
        await News.deleteMany({});
        const newsData = [];
        const categoriesList = ['politics', 'development', 'announcements', 'government'];

        const newsTemplates = [
            {
                title: 'अखिलेश यादव ने लखनऊ में नए आईटी हब के निर्माण की घोषणा की',
                excerpt: 'सपा राष्ट्रीय अध्यक्ष ने युवाओं के लिए तकनीकी रोजगार और राज्य में डिजिटल बुनियादी ढांचे को मजबूत करने का संकल्प लिया।',
                topic: 'विकास और तकनीकी क्रांति'
            },
            {
                title: 'समाजवादी पार्टी मेट्रो परियोजना के दूसरे चरण का ब्लूप्रिंट तैयार',
                excerpt: 'प्रदेश के विकास ट्रैक रिकॉर्ड को बढ़ाते हुए नए मेट्रो कॉरिडोर के विस्तार से लाखों नागरिकों को मिलेगी बड़ी राहत।',
                topic: 'शहरी परिवहन और आधारभूत ढांचा'
            },
            {
                title: 'सपा टेक फ़ोर्स सोशल मीडिया फैक्ट-चेकिंग कार्यशाला का सफल आयोजन',
                excerpt: '500 से अधिक डिजिटल कार्यकर्ताओं ने अफवाहों का मुकाबला करने और सही तथ्यों को साझा करने का प्रशिक्षण प्राप्त किया।',
                topic: 'सोशल मीडिया और डिजिटल साक्षरता'
            },
            {
                title: 'युवा नेतृत्व डिजिटल शिखर सम्मेलन: नई आवाज़ों को मंच',
                excerpt: 'समाजवादी विचारधारा को जन-जन तक पहुंचाने के लिए राज्य स्तरीय युवा संयोजकों का सम्मेलन संपन्न हुआ।',
                topic: 'युवा नेतृत्व और विकास'
            },
            {
                title: 'किसानों के कल्याण और न्यूनतम समर्थन मूल्य (MSP) पर सपा का समर्थन',
                excerpt: 'ग्रामीण क्षेत्रों में मुफ्त सिंचाई, कृषि ऋण राहत और फसलों के उचित मूल्य के लिए समाजवादी पार्टी का बड़ा आंदोलन।',
                topic: 'किसान और ग्रामीण समृद्धि'
            },
            {
                title: 'महिला सुरक्षा और सशक्तिकरण के लिए समाजवादी पेंशन योजना का प्रस्ताव',
                excerpt: 'महिलाओं को आर्थिक रूप से स्वतंत्र बनाने और स्थानीय स्तर पर नेतृत्व के अवसरों को बढ़ावा देने की योजना।',
                topic: 'महिला अधिकार और सुरक्षा'
            }
        ];

        for (let i = 1; i <= 55; i++) {
            const template = newsTemplates[i % newsTemplates.length];
            const coverImage = imagesPool[i % imagesPool.length];
            const category = categoriesList[i % categoriesList.length];
            newsData.push({
                title: `${template.title} (अपडेट ${i})`,
                excerpt: template.excerpt,
                type: i % 5 === 0 ? 'Program' : 'News',
                category: category,
                coverImage: coverImage,
                status: 'Published',
                views: Math.floor(Math.random() * 2000) + 50,
                content: [
                    { type: 'paragraph', content: `सपा डिजिटल विंग और टेक फ़ोर्स का उद्देश्य समाज के हर वर्ग तक सकारात्मक संदेश पहुँचाना है। श्री अखिलेश यादव जी के नेतृत्व में उत्तर प्रदेश को फिर से तरक्की और सामाजिक न्याय की राह पर अग्रसर किया जाएगा।` },
                    { type: 'image', content: coverImage }
                ],
                author: adminId,
                createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
            });
        }
        await News.insertMany(newsData);
        console.log(`Successfully seeded ${newsData.length} news articles.`);

        // 3. Seed Reels (incorporating the training videos from WhatsApp screenshot)
        console.log('Seeding Reels & Training Videos...');
        await Reel.deleteMany({});
        await Reel.insertMany([
            {
                title: 'Samajwadi Tech Force App and WebSite Training',
                videoUrl: 'https://www.youtube.com/embed/IHdxkg8tqKo',
                thumbnail: assets.hero,
                description: 'Full video walkthrough showing how to use the Samajwadi Tech Force application and responsive dashboard.',
                likesCount: 320,
                viewsCount: 2500,
                uploadedBy: adminId
            },
            {
                title: 'समाजवादी टेक फ़ोर्स में अपने पोस्टर को कैसे बनाएं',
                videoUrl: 'https://www.youtube.com/embed/3uU6tNA_oys',
                thumbnail: assets.logo,
                description: 'Step-by-step tutorial on generating your custom campaign poster using frames inside the portal.',
                likesCount: 450,
                viewsCount: 3200,
                uploadedBy: adminId
            },
            {
                title: 'समाजवादी टेक फ़ोर्स के लीडर बोर्ड पे कैसे काम करे',
                videoUrl: 'https://www.youtube.com/embed/rDyy0mTRQyc',
                thumbnail: assets.logo,
                description: 'Learn how points, referals, and digital tasks update your ranking on the state leaderboard.',
                likesCount: 180,
                viewsCount: 1500,
                uploadedBy: adminId
            },
            {
                title: 'Leaderboard Point Strategy & Daily Tasks Guide',
                videoUrl: 'https://www.youtube.com/embed/a5oEqCMPOP0',
                thumbnail: assets.hero,
                description: 'Optimize your daily tasks workflow to maximize points and earn verified digital ID badges.',
                likesCount: 220,
                viewsCount: 1900,
                uploadedBy: adminId
            }
        ]);
        console.log('Successfully seeded Reels.');

        // 4. Update HomeContent (Keeping Hindi content for Hero Header)
        console.log('Updating HomeContent layout (Hindi Hero Slide)...');
        await HomeContent.deleteMany({});
        await HomeContent.create({
            hero: {
                slides: [
                    {
                        badge: 'समाजवाद का अर्थ है – सबके लिए सम्मान, अवसर और न्याय।',
                        title: 'आदरणीय श्री अखिलेश यादव जी',
                        subtitle: 'श्री अखिलेश यादव जी उत्तर प्रदेश के प्रमुख समाजवादी नेता, समाजवादी पार्टी के राष्ट्रीय अध्यक्ष एवं प्रदेश के पूर्व मुख्यमंत्री हैं।',
                        image: assets.hero,
                        ctaText: 'सदस्य बनें',
                        ctaLink: '/joinus',
                        stats: [
                            { num: '37', label: 'प्रदेश के सबसे ज्यादा सांसदों की पार्टी' }
                        ]
                    }
                ]
            },
            trackRecord: {
                title: 'Our Track Record',
                items: [
                    { icon: 'account-group', num: '1.7K+', label: 'Verified Volunteers' },
                    { icon: 'city', num: '75', label: 'Districts Covered' },
                    { icon: 'checkbox-marked-circle', num: '403', label: 'Assemblies Connected' },
                    { icon: 'bullhorn', num: '10M+', label: 'Digital Impressions' }
                ]
            },
            president: {
                title: 'Our Leadership',
                slides: [
                    {
                        badge: 'National President',
                        name: 'Akhilesh Yadav',
                        quote: 'The digital space must be used for positive transformation, development advocacy, and social justice.',
                        image: assets.logo,
                        isActive: true
                    }
                ]
            },
            legacy: {
                title: 'Our Legacy',
                leaders: [
                    {
                        name: 'Mulayam Singh Yadav',
                        role: 'Founder',
                        image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Mulayam_Singh_Yadav.jpg',
                        description: 'Visionary leader who founded Samajwadi Party in 1992.',
                        isActive: true
                    }
                ]
            },
            explorePages: {
                title: 'Explore Pages',
                selectedPageIds: []
            },
            isActive: true
        });
        console.log('HomeContent layout updated with Hindi Hero Header.');

        // 5. Seed Training Modules for all 4 Phases
        console.log('Seeding Training Modules for Phases 1-4...');
        await TrainingModule.deleteMany({});
        await TrainingModule.insertMany([
            // Phase 1 - Connect
            {
                title: 'सपा डिजिटल विंग - परिचय',
                description: 'प्लेटफ़ॉर्म का उपयोग शुरू करें, प्रोफ़ाइल सेट करें और डिजिटल विंग आचार संहिता सीखें।',
                phase: 'Phase 1',
                type: 'video',
                contentUrl: 'https://www.youtube.com/embed/IHdxkg8tqKo',
                thumbnail: assets.hero,
                duration: '10 min',
                createdBy: adminId
            },
            // Phase 2 - Create
            {
                title: 'चुनावी पोस्टर कैसे बनाएं',
                description: 'पोर्टल में फ्रेम का उपयोग करके अपनी तस्वीर के साथ चुनावी बैनर बनाना सीखें।',
                phase: 'Phase 2',
                type: 'video',
                contentUrl: 'https://www.youtube.com/embed/3uU6tNA_oys',
                thumbnail: assets.logo,
                duration: '12 min',
                createdBy: adminId
            },
            // Phase 3 - Conquer
            {
                title: 'लीडरबोर्ड और दैनिक डिजिटल कार्य',
                description: 'अधिकतम पॉइंट प्राप्त करने और लीडरबोर्ड पर आगे बढ़ने की पूरी रणनीति।',
                phase: 'Phase 3',
                type: 'video',
                contentUrl: 'https://www.youtube.com/embed/rDyy0mTRQyc',
                thumbnail: assets.hero,
                duration: '8 min',
                createdBy: adminId
            },
            // Phase 4 - Conclusion
            {
                title: 'डिजिटल आईडी और प्रमाण पत्र जारी करना',
                description: 'सफलतापूर्वक प्रशिक्षण पूरा होने पर अपना डिजिटल पहचान पत्र डाउनलोड करने की विधि।',
                phase: 'Phase 4',
                type: 'document',
                contentUrl: 'https://www.google.com',
                thumbnail: assets.hero,
                duration: '5 min',
                createdBy: adminId
            }
        ]);
        console.log('Training Modules seeded successfully.');

        console.log('🎉 VAST HINDI DATA & HOME CONTENT SEEDED SUCCESSFULLY!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedVastData();
