const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Poster = require('./models/Poster');

const MONGO_URI = 'mongodb://adarshsachan7071_db_user:uFlWpq6NY7MHJTm9@ac-lqvblgl-shard-00-00.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-01.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-02.ksxxelf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-de1ek8-shard-0&authSource=admin&retryWrites=true&w=majority';

async function removePosters() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        console.log('Deleting the 4 custom campaign posters...');
        const result = await Poster.deleteMany({
            $or: [
                { title: /सतीश कुमार निगम/ },
                { title: /युवाओं को नौकरी/ },
                { title: /नफरत नहीं/ },
                { title: /सड़क, बिजली/ }
            ]
        });

        console.log(`Deleted ${result.deletedCount} posters.`);
        console.log('🎉 PROCESS COMPLETE!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error removing posters:', err);
        process.exit(1);
    }
}

removePosters();
