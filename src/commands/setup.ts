import Conf from "conf";
import pkg from "enquirer";
import fs from "fs";
import { download } from "../lib/download.js";

const { prompt } = pkg;

const config = new Conf({ cwd: "./config/ender.json" });

let spinner;

export async function setup() {
    const questions = [
        {
            type: "input",
            name: "version",
            message: "Which minecraft version",
            initial: "1.19",
        },
        {
            type: "select",
            name: "flavour",
            message: "Choose a server-jar flavour",
            choices: ["Vanilla", "Paper", "Purpur"],
        },
        {
            type: "input",
            name: "ram",
            message: "How much ram should the server use (in Mb, do not include the unit)",
            initial: "2000",
        },
        {
            type: "input",
            name: "player_limit",
            message: "Enter the maximum player limit",
            initial: "12",
        },
        {
            type: "input",
            name: "world_seed",
            message: "Enter a world seed (optional)",
            initial: "",
        },
        {
            type: "select",
            name: "gamemode",
            message: "Choose default gamemode",
            choices: ["survival", "creative", "adventure"],
        },
        {
            type: "select",
            name: "difficulty",
            message: "Choose server difficulty",
            choices: ["peaceful", "easy", "normal", "hard"],
        },
        {
            type: "input",
            name: "port",
            message: "Which port the server should listen on",
            initial: "25565",
        },
        {
            type: "confirm",
            name: "whitelist",
            message: "Should the server be whitelisted?",
        },
        {
            type: "confirm",
            name: "eula",
            message: "I have read and agree to the Minecraft EULA (https://www.minecraft.net/eula)",
        },
    ];

    let answers = await prompt(questions);

    config.set(answers);

    if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data");
    }

    if (!fs.existsSync("./bin")) {
        fs.mkdirSync("./bin");
    }

    var properties = fs.createWriteStream("./data/server.properties", {
        flags: "a", // 'a' means appending (old data will be preserved)
    });

    const version = await config.get("version");
    const flavour = await config.get("flavour");
    const player_limit = await config.get("player_limit");
    const world_seed = await config.get("world_seed");
    const gamemode = await config.get("gamemode");
    const difficulty = await config.get("difficulty");
    const port = await config.get("port");
    const whitelist = await config.get("whitelist");
    const eula = await config.get("eula");

    properties.write(`max-players=${player_limit}\n`);
    properties.write(`level-seed=${world_seed}\n`);
    properties.write(`gamemode=${gamemode}\n`);
    properties.write(`difficulty=${difficulty}\n`);
    properties.write(`server-port=${port}\n`);
    properties.write(`white-list=${whitelist}\n`);

    properties.end();

    if (eula) {
        fs.writeFile("./data/eula.txt", "eula=true", (err) => {
            if (err) {
                console.error(err);
            }
        });
    } else {
        console.log("You must agree to the Minecraft EULA (https://www.minecraft.net/eula)");
        process.exit();
    }

    await download("https://dynamic.z3orc.com/" + flavour + "/" + version, "./bin/server.jar");
}
