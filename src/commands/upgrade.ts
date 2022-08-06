import Conf from "conf";
export async function upgrade() {
    const config = new Conf();

    const flavour = await config.get("flavour");

    if (flavour == "vanilla") {
        var response = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest_v2.json");
        var json = await response.json();
        console.log(json[0].id);
    } else if (flavour == "paper") {
    } else if (flavour == "purpur") {
    }
}
