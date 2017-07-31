import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
        match: /(?=.*[a-zA-Z])(?=.*[0-9]+).*/,
        minlength: 6
    },
    email: {
        type: String,
        require: true,
        match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    },
    name: {
      type: String,
      require: true,
      minlength: 3,
      maxlength: 30
    },
    admin: Boolean,
    created: {
        type: Date,
        required: true,
        default: new Date()
    },
    verified: Boolean,
},
{
    toJSON: {
        transform: (doc:any, ret:any, options:any) => {
            delete ret.password;
            delete ret.created;
            return ret;
        }
}
});
