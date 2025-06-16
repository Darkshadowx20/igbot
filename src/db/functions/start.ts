import { User } from "../models/user";

export async function checkUser(userID: String) {
    try {
    return await User.exists({ userID }) !== null;
    } catch {
        return null
    }
}

export async function saveNewUser(userID: String,username: String | null, referrer: String | null){
    try { 
        const user = new User({
        userID: userID,
        username: username,
        referrer: referrer
    })
    user.save();
    return true

    } catch {
        return false
    }
}