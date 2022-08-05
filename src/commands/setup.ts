import Conf from "conf";
import pkg from "enquirer";
import fs from "fs";
import { download } from "../lib/download.js";

const { prompt } = pkg;

const config = new Conf();

let spinner;

export async function setup() {
    console.log("setup");

    const question = [
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
            message: "How much ram should the server use (in MB)",
            initial: "2000MB",
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
    ];

    let answers = await prompt(question);

    config.set(answers);

    if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data");
    }

    if (!fs.existsSync("./bin")) {
        fs.mkdirSync("./bin");
    }

    const version = await config.get("version");
    const flavour = await config.get("flavour");

    await download("https://dynamic.z3orc.com/" + flavour + "/" + version, "./bin/server.jar");
}