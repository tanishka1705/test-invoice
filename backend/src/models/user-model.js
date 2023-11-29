import { Schema, model } from "mongoose";
import joiValidator from "../utils/joiValidator";

const userSchema = Schema({
    name: { type: String, unique: true, uppercase: true },
    email: { type: String, unique: true },
    gstin: { type: String, unique: true, uppercase: true },
    pan: { type: String, uppercase: true, unique: true },
    account: {
        acc_no: { type: Number, unique: true },
        bank: { type: String },
        ifsc: { type: String }
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pin: { type: Number },
        country: { type: String }
    },
    contact: { type: Number },
    password: { type: String || undefined },
    passwordResetToken: { type: String }
}, {
    timestamps: true
});

userSchema.methods.joiValidate = function (obj) {
    const schema = joiValidator
    return schema.validate(obj);
}

const User = model('user', userSchema)
export default User