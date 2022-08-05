"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = void 0;
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const ora_1 = __importDefault(require("ora"));
function download(url, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const proto = !url.charAt(4).localeCompare("s") ? https_1.default : http_1.default;
        const spinner = (0, ora_1.default)(`Downloading server.jar`);
        return new Promise((resolve, reject) => {
            const file = fs_1.default.createWriteStream(filePath);
            let fileInfo = null;
            const request = proto.get(url, (response) => {
                if (response.statusCode !== 200) {
                    if ([301, 302].indexOf(response.statusCode) > -1) {
                        download(response.headers.location, filePath);
                        return;
                    }
                    fs_1.default.unlink(filePath, () => {
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
                fs_1.default.unlink(filePath, () => {
                    spinner.fail("Could not download server.jar, url not valid");
                    reject(err);
                });
            });
            file.on("error", (err) => {
                fs_1.default.unlink(filePath, () => {
                    spinner.fail("Could not download server.jar, file could not be written");
                    reject(err);
                });
            });
            request.end();
        });
    });
}
exports.download = download;
