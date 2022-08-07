import Conf from "conf";
import pkg from "enquirer";
import { download } from "../lib/download.js";
import { backup } from "./backup.js";

const { prompt } = pkg;

export async function upgrade() {
    const config = new Conf({ cwd: "./config/ender.json" });
    const version = String(await config.get("version")).toLowerCase();
    const flavour = String(await config.get("flavour")).toLowerCase();

    const response = await prompt({
        type: "confirm",
        name: "include_snapshots",
        message: "Include snapshots as an option?",
    });

    const include_snapshots = response["include_snapshots"];

    var possible_versions = await get_possible_versions(version, flavour, include_snapshots);

    const questions = [
        {
            type: "select",
            name: "new_version",
            message: "Which version do you want to upgrade to?",
            choices: possible_versions,
        },
    ];

    let answers = await prompt(questions);

    const new_version = answers["new_version"];

    backup();

    await download(`https://dynamic.z3orc.com/${flavour}/${new_version}`, "./bin/server.jar");
}

async function get_possible_versions(version: String, flavour: String, snapshots: boolean): Promise<String[]> {
    var possible_versions = [];

    if (flavour == "vanilla") {
        console.log(flavour + " " + version);

        var response = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json");
        var json = await response.json();
        var versions = json["versions"];

        var index = 0;

        for (let obj of versions) {
            if (obj["id"] == version) {
                break;
            }
            index++;
        }

        versions.length = index;

        versions.forEach((element: String) => {
            if (snapshots == true) {
                possible_versions.push(element["id"]);
            } else if (snapshots == false && element["type"] != "snapshot") {
                possible_versions.push(element["id"]);
            }
        });
    } else {
        console.log(flavour + " " + version);
        var url = "";

        if (flavour == "paper") {
            url = "https://papermc.io/api/v2/projects/paper";
        } else if (flavour == "purpur") {
            url = "https://api.purpurmc.org/v2/purpur";
        }

        var response = await fetch(url);
        var json = await response.json();
        var versions = json["versions"].reverse();

        var index = 0;

        for (let obj of versions) {
            index++;
            if (obj == version) {
                break;
            }
        }

        versions.length = index;

        versions.forEach((element: String) => {
            possible_versions.push(element);
        });
    }

    return possible_versions;
}
