const { Schema, model } = require('mongoose');

const welcomeChannelSchema = new Schema(
    {
        guildId: {
            type: String,
            required: true,
            // unique: true,
        },
        channelId: {
            type: String,
            required: true,
            unique: true,
        },
        customMessage: {
            type: String,
            default: null,
        },
        imageDescription: {
            type: String,
            default: null,
        },
        enableImage:{
            type: Boolean,
            default: false,
        },
        customimageURL: {
            type: String,
            default: null,
        }
    },
    { timestamps: true }
);

module.exports = model('WelcomeChannel', welcomeChannelSchema);
