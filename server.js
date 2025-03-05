const app = require('./app');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://root:root@twitter.m71fn.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Database connected');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(col => col.name));

    mongoose.connection.close();
});
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});