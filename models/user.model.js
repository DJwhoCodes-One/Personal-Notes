const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jaindevanshu79:alphaMajorDJ@cluster0.4r4y29k.mongodb.net/authpersonalnotes?retryWrites=true&w=majority&appName=Cluster0')

const userSchema = mongoose.Schema(
    {
        username: String,
        name: String,
        age: Number,
        password: String,
        email: String,
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "post"
            }
        ]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("user", userSchema);