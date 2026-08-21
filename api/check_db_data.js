const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://adarshsachan7071_db_user:uFlWpq6NY7MHJTm9@ac-lqvblgl-shard-00-00.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-01.ksxxelf.mongodb.net:27017,ac-lqvblgl-shard-00-02.ksxxelf.mongodb.net:27017/test?ssl=true&replicaSet=atlas-de1ek8-shard-0&authSource=admin&retryWrites=true&w=majority';

async function checkDb() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log(`Found ${collections.length} collections:`);
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(` - ${col.name}: ${count} documents`);
            if (count > 0) {
                const sample = await db.collection(col.name).findOne();
                console.log(`   Sample key/values:`, Object.keys(sample));
                // If there's an image or media URL in the sample, let's print it
                for (const key of Object.keys(sample)) {
                    if (typeof sample[key] === 'string' && (sample[key].startsWith('http') || sample[key].includes('/'))) {
                        console.log(`     * ${key}: ${sample[key]}`);
                    }
                }
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkDb();
