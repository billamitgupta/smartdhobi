const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    label: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
}, { _id: false });

const UserProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    preferences: {
        type: String,
        default: '',
    },
    addresses: {
        type: [AddressSchema],
        default: [],
    },
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
module.exports = UserProfile;
