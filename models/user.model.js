const mongoose = require('mongoose');

mongoose.connect(process.env.DB);

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