import {HydratedDocument} from "mongoose";
import {Prop, SchemaFactory, Schema} from "@nestjs/mongoose";
import {hashPassword, verifyPassword} from "../../utils";


@Schema()
class User {
    @Prop({isRequired: true, unique: true})
    email: string;
    @Prop({isRequired: false, unique: true})
    username: string;
    @Prop({isRequired: true})
    password: string;

}

type UserDocument = HydratedDocument<User>;
const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({email: 1, username: 1}, {unique: true})
UserSchema.pre("save", function (next) {
    if (this.isModified('password')) {
        this.password = hashPassword(this.password);
    }
    next();
})
UserSchema.methods.verifyPassword = function (inputPassword: string): boolean {
    return verifyPassword(inputPassword, this.password)
}
export {UserSchema, UserDocument, User as UserModel}
