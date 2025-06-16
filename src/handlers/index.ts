import { Composer } from "grammy";

import startHandler from "./start";
import downloadHandler from "./downloader";

const composer = new Composer();

composer.use(startHandler);
composer.use(downloadHandler);

export default composer;