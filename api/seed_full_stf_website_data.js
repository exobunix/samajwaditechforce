const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { uploadImageToImageKit } = require('./utils/imagekit');
const User = require('./models/User');
const Banner = require('./models/Banner');
const Poster = require('./models/Poster');
const Event = require('./models/Event');
const News = require('./models/News');
const Reel = require('./models/Reel');
const Task = require('./models/Task');
const HomeContent = require('./models/HomeContent');

const MONGO_URI = 'mongodb://adarshsachan7071_db_user:uFlWpq6NY7MHJTm9@ac-lqvblgl-shard-00-00.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-01.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-02.ksxxelf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-de1ek8-shard-0&authSource=admin&retryWrites=true&w=majority';

async function seedData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        // Find or create admin user to associate with uploads
        let admin = await User.findOne({ role: 'master-admin' });
        if (!admin) {
            console.log('No master admin found, creating a temp admin user...');
            admin = await User.create({
                name: 'Master Admin',
                email: 'samajwadi332@gmail.com',
                password: 'SAmajWAdi5544',
                role: 'master-admin',
                phone: '0000000000',
                adminVerification: true,
                verificationStatus: 'Verified'
            });
        }
        const adminId = admin._id;

        // Path to local assets
        const assetsDir = path.join(__dirname, '..', 'assets', 'images');
        
        console.log('Uploading local assets to your ImageKit...');
        const logoBuffer = fs.readFileSync(path.join(assetsDir, 'stf_logo.jpg'));
        const frame1Buffer = fs.readFileSync(path.join(assetsDir, 'frame1.png'));
        const frame2Buffer = fs.readFileSync(path.join(assetsDir, 'frame2.png'));
        const frame3Buffer = fs.readFileSync(path.join(assetsDir, 'frame3.png'));
        const heroBuffer = fs.readFileSync(path.join(assetsDir, 'heropre.png'));

        const logoUpload = await uploadImageToImageKit(logoBuffer, 'stf-assets');
        const frame1Upload = await uploadImageToImageKit(frame1Buffer, 'stf-frames');
        const frame2Upload = await uploadImageToImageKit(frame2Buffer, 'stf-frames');
        const frame3Upload = await uploadImageToImageKit(frame3Buffer, 'stf-frames');
        const heroUpload = await uploadImageToImageKit(heroBuffer, 'stf-assets');

        console.log('Asset URLs generated:', {
            logo: logoUpload.url,
            frame1: frame1Upload.url,
            frame2: frame2Upload.url,
            frame3: frame3Upload.url,
            hero: heroUpload.url
        });

        // 1. Seed Banners
        console.log('Seeding Banners...');
        await Banner.deleteMany({});
        await Banner.insertMany([
            { title: 'Samajwadi Party Official', imageUrl: logoUpload.url, isActive: true },
            { title: 'Digital Power of Social Change', imageUrl: heroUpload.url, isActive: true }
        ]);

        // 2. Seed Campaign Posters
        console.log('Seeding Campaign Posters...');
        await Poster.deleteMany({});
        await Poster.insertMany([
            { title: 'Social Justice Campaign Frame', imageUrl: frame1Upload.url, uploadedBy: adminId, isActive: true },
            { title: 'Youth Tech Force Card', imageUrl: frame2Upload.url, uploadedBy: adminId, isActive: true },
            { title: 'National Leader Welcome Frame', imageUrl: frame3Upload.url, uploadedBy: adminId, isActive: true }
        ]);

        // 3. Seed Events
        console.log('Seeding Events...');
        await Event.deleteMany({});
        await Event.insertMany([
            {
                title: 'Tech Force General Assembly Lucknow',
                description: 'Join the state-wide gathering of the Samajwadi Tech Force to coordinate the digital strategy for upcoming elections.',
                date: '2026-09-10',
                time: '11:00 AM',
                location: 'Samajwadi Party HQ, Lucknow',
                status: 'upcoming',
                type: 'meeting',
                image: heroUpload.url,
                isActive: true
            },
            {
                title: 'Social Media Strategy Workshop',
                description: 'Learn best practices for content creation, fact-checking, and digital campaigning directly from leadership.',
                date: '2026-09-15',
                time: '02:00 PM',
                location: 'Online / Zoom Webinar',
                status: 'upcoming',
                type: 'training',
                image: logoUpload.url,
                isActive: true
            }
        ]);

        // 4. Seed News
        console.log('Seeding News & Programs...');
        await News.deleteMany({});
        await News.insertMany([
            {
                title: 'Samajwadi Tech Force Launches Digital Leadership Drive',
                excerpt: 'A new campaign to recruit tech-savvy youth coordinators across all 403 Vidhansabha seats in Uttar Pradesh.',
                type: 'News',
                coverImage: heroUpload.url,
                status: 'Published',
                content: [
                    { type: 'heading', content: 'Connecting Youth for Development' },
                    { type: 'paragraph', content: 'The Samajwadi Party today officially inaugurated its expanded digital membership portal, aiming to recruit and train tech force volunteers across all districts.' },
                    { type: 'image', content: logoUpload.url }
                ],
                author: adminId
            },
            {
                title: 'Akhilesh Yadav Emphasizes Truthful Digital Campaigning',
                excerpt: 'National President urges volunteers to promote party work, development track record, and avoid spreading rumors.',
                type: 'News',
                coverImage: logoUpload.url,
                status: 'Published',
                content: [
                    { type: 'paragraph', content: 'Speaking at a state meet, Akhilesh Yadav highlighted the role of youth in keeping the public informed about constructive policies and developmental schemes.' }
                ],
                author: adminId
            }
        ]);

        // 5. Seed Reels
        console.log('Seeding Reels...');
        await Reel.deleteMany({});
        await Reel.insertMany([
            {
                title: 'Samajwadi Tech Force Anthem',
                videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Safe sample video
                thumbnail: logoUpload.url,
                description: 'Proud to be the digital voice of Samajwadi development!',
                likesCount: 154,
                viewsCount: 1205,
                uploadedBy: adminId
            }
        ]);

        // 6. Seed HomeContent
        console.log('Updating Home & Welcome Page Layout...');
        await HomeContent.deleteMany({});
        await HomeContent.create({
            hero: {
                title: 'Samajwadi Tech Force',
                subtitle: 'Digital Power of Social Change',
                image: heroUpload.url
            },
            trackRecord: {
                title: 'Our Track Record',
                stats: [
                    { value: '400+', label: 'Active Constituencies' },
                    { value: '50K+', label: 'Digital Volunteers' },
                    { value: '5M+', label: 'Social Reach' }
                ]
            },
            president: {
                name: 'Akhilesh Yadav',
                quote: 'The digital space must be used for positive transformation, youth empowerment, and development advocacy.',
                image: logoUpload.url
            },
            isActive: true
        });

        // 7. Seed Tasks
        console.log('Seeding Daily Tasks...');
        await Task.deleteMany({});
        await Task.insertMany([
            {
                title: 'Promote Samajwadi Development Campaign',
                description: 'Download the official campaign frame, add your photo, and share it on Facebook and Twitter with the tag #SamajwadiTechForce.',
                points: 50,
                type: 'Social Media',
                platform: 'twitter',
                linkToShare: 'https://twitter.com/samajwadiparty',
                createdBy: adminId
            },
            {
                title: 'Invite 5 Friends to Join Tech Force',
                description: 'Use your referral link inside your profile to register 5 local members from your assembly constituency.',
                points: 100,
                type: 'Field Work',
                createdBy: adminId
            }
        ]);

        console.log('🎉 SEEDING AND IMAGEKIT UPLOADS COMPLETED SUCCESSFULLY!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Seeding Fatal Error:', err);
        process.exit(1);
    }
}

seedData();
