const { Schema, model } = require("mongoose");
const Thought = require("./Thought")

const userSchema = new Schema({


    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must match a valid email address'],
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: Thought,
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    parties: [{
        type: Schema.Types.ObjectId,
        ref: 'Party'
    }]
},
{
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});

userSchema.virtual('friendCount').get(function() {
    return this.friends.length
})

const User = model('User', userSchema);

module.exports = User;
