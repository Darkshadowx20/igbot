import { Bot } from "grammy";
import dotenv from "dotenv";
import composer from "./handlers";
import { connectDB } from "./db/connect";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN!);

const chatFilter = bot.filter(ctx => ctx.chat?.type == "private")

connectDB();
bot.use(chatFilter);
bot.use(composer);




bot.start({
    drop_pending_updates: true
});

//console.log("Bot started "+bot.api.getMe())

bot.catch((err)=>{
    console.log(err)
})

