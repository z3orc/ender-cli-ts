import https from "https";
import http from "http";
import fs from "fs";
import ora from "ora";

export async function download(url, filePath) {
    const proto = !url.charAt(4).localeCompare("s") ? https : http;
    const spinner = ora(`Downloading server.jar`);

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        let fileInfo = null;

        const request = proto.get(url, (response) => {
            if (response.statusCode !== 200) {
                if ([301, 302].indexOf(response.statusCode) > -1) {
                    download(response.headers.location, filePath);
                    return;
                }

                fs.unlink(filePath, () => {
                    reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                });
                return;
            }

            spinner.start();

            fileInfo = {
                mime: response.headers["content-type"],
                size: parseInt(response.headers["content-length"], 10),
            };

            response.pipe(file);
        });

        // The destination stream is ended by the time it's called
        file.on("finish", () => {
            resolve(fileInfo);
            spinner.succeed("Downloaded server.jar");
        });

        request.on("error", (err) => {
            fs.unlink(filePath, () => {
                spinner.fail("Could not download server.jar, url not valid");
                reject(err);
            });
        });

        file.on("error", (err) => {
            fs.unlink(filePath, () => {
                spinner.fail("Could not download server.jar, file could not be written");
                reject(err);
            });
        });

        request.end();
    });
}
