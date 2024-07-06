const mongoose = require("mongoose");
//const bcrypt = require('bcrypt');
const AutoIncrementFactory = require('mongoose-sequence');
const db = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(db);
const Schema = mongoose.Schema;
const User = new Schema(
    {
        //userid: {type: Number},
        name: {type: String},
        email: {type: String},
        age: {type: Number},
        password: {type: String},
        phone: {type:Number},
        role: {type:String},
        city: {type: String},
        photo: { type: String }
    },
    {
        collection:"users"
    }
 );
 //User.plugin(AutoIncrement, { inc_field: 'userid' });

// User.pre('save', async function(next) {
//     const user = this;

//     if (user.isModified('password') || user.isNew) {
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(user.password, salt);
//         user.password = hash;
//     }

//     next();
// });
// User.methods.comparePassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// }
module.exports = mongoose.model("users", User);