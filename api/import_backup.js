const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = 'mongodb://adarshsachan7071_db_user:uFlWpq6NY7MHJTm9@ac-lqvblgl-shard-00-00.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-01.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-02.ksxxelf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-de1ek8-shard-0&authSource=admin&retryWrites=true&w=majority';

const mapping = {
  'adminapprovals': 'AdminApproval',
  'announcements': 'Announcement',
  'banners': 'Banner',
  'contactpagesettings': 'ContactPageSettings',
  'districts': 'District',
  'events': 'Event',
  'eventregistrations': 'EventRegistration',
  'feedbacks': 'Feedback',
  'footers': 'Footer',
  'homecontents': 'HomeContent',
  'members': 'Member',
  'news': 'News',
  'notifications': 'Notification',
  'onboardings': 'Onboarding',
  'pages': 'Page',
  'pointactivities': 'PointActivity',
  'posters': 'Poster',
  'reels': 'Reel',
  'resources': 'Resource',
  'tasks': 'Task',
  'trainingmodules': 'TrainingModule',
  'users': 'User',
  'usertasks': 'UserTask',
  'vidhansabhas': 'Vidhansabha'
};

function parseExtendedJson(obj) {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) {
        return obj.map(parseExtendedJson);
    }
    if (typeof obj === 'object') {
        if (obj.$oid && typeof obj.$oid === 'string') {
            return new mongoose.Types.ObjectId(obj.$oid);
        }
        if (obj.$date) {
            return new Date(obj.$date);
        }
        const newObj = {};
        for (const key in obj) {
            newObj[key] = parseExtendedJson(obj[key]);
        }
        return newObj;
    }
    return obj;
}

async function importBackup() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const backupDir = path.join(__dirname, '..', 'samajwadi_db_backup');
        const files = fs.readdirSync(backupDir);

        for (const file of files) {
            if (!file.endsWith('.json')) continue;
            
            const key = file.replace('.json', '');
            const modelName = mapping[key];
            if (!modelName) {
                console.log(`No mapping found for ${file}, skipping.`);
                continue;
            }

            const filePath = path.join(backupDir, file);
            const rawData = fs.readFileSync(filePath, 'utf8');
            let data = JSON.parse(rawData);

            if (!Array.isArray(data) || data.length === 0) {
                console.log(`Skipping empty or invalid file: ${file}`);
                continue;
            }

            console.log(`Importing ${data.length} records into ${modelName} from ${file}...`);
            const Model = require('./models/' + modelName);

            // Clean Extended JSON syntax recursively
            data = parseExtendedJson(data);

            // Clear existing collection before importing
            await Model.deleteMany({});
            
            // Insert data
            await Model.insertMany(data);
            console.log(`Successfully imported ${modelName}`);
        }

        console.log('Import completed successfully!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error during import:', err);
        process.exit(1);
    }
}

importBackup();
