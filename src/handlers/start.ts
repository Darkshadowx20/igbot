import { Composer } from "grammy";
import * as DB from "../db/functions/start"

const startHandler = new Composer();

startHandler.command('start',async (ctx)=>{
    const isExists = await DB.checkUser(ctx.from!.id.toString());
    if (!isExists) {
        const referrer = ctx.match || null
        const username = ctx.from!.username || null
        const userID = ctx.from!.id.toString()
        DB.saveNewUser(userID ,username ,referrer)
        ctx.reply(`Hello ${ctx.from?.first_name}! Welcome to ${(await ctx.api.getMe()).first_name}\n\nSend me a link to any instagram post/reel/story , and i'll download it!`)
    } else {
        ctx.reply(`Send me a link to any instagram post/reel/story , and i'll download it!`)
    }

})

export default startHandler;