import { User } from "../models/user.model";

export function getUserByEmail(email: string) {
    return User.findOne({ email });
}

export function saveUser(data: { name: string; email: string; authId: string }) {
    const user = new User(data);
    return user.save();
}

export function updateUser(id: string, updateData: Partial<{ name: string; phone: string; dob: Date; profilePicture: string }>) {
    return User.findByIdAndUpdate({ id }, updateData);
}