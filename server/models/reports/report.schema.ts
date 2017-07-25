import * as mongoose from 'mongoose';


export const ReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 6
    },
    description: {
        type: String,
        require: true,
        minlength: 6
    },
    pictures: {
        type: [String]
    },
    approved: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    disapproved: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    created: {
        type: Date,
        required: true,
        default: new Date()
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }

});
