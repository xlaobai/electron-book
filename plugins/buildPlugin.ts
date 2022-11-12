import path from "path";
import fs from "fs-extra";

class BuildObj {
    buildMain() {
        require("esbuild").buildSync({
            entryPoints: ["./src/main/mainEntry.ts"],
            bundle: true,
            platform: "node",
            minify: true,
            outfile: "./dist/mainEntry.js",
            external: ["electron"],
        });
    }

    preparePackageJson() {
        let pkgJsonPath = path.join(process.cwd(), "package.json");
        let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
        let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
        localPkgJson.main = "mainEntry.js";
        delete localPkgJson.scripts;
        delete localPkgJson.devDependencies;
        localPkgJson.devDependencies = { electron: electronConfig };
        // localPkgJson.dependencies["better-sqlite3"] = "*";
        // localPkgJson.dependencies["bindings"] = "*";
        let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
        fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
        fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
    }

    async prepareSqlite() {
        let srcDir = path.join(process.cwd(), `node_modules/better-sqlite3`);
        let destDir = path.join(process.cwd(), `dist/node_modules/better-sqlite3`);
        fs.ensureDirSync(destDir);
        fs.copySync(srcDir, destDir, {
          filter: (src, dest) => {
            if (src.endsWith("better-sqlite3") || src.endsWith("build") || src.endsWith("Release") || src.endsWith("better_sqlite3.node")) return true;
            else if (src.includes("node_modules\\better-sqlite3\\lib")) return true;
            else return false;
          },
        });
    
        let pkgJson = `{"name": "better-sqlite3","main": "lib/index.js"}`;
        let pkgJsonPath = path.join(process.cwd(), `dist/node_modules/better-sqlite3/package.json`);
        fs.writeFileSync(pkgJsonPath, pkgJson);
    
        let bindingPath = path.join(process.cwd(), `dist/node_modules/bindings/index.js`);
        fs.ensureFileSync(bindingPath);
        let bindingsContent = `module.exports = () => {
      let addonPath = require("path").join(__dirname, '../better-sqlite3/build/Release/better_sqlite3.node');
      return require(addonPath);
      };`;
        fs.writeFileSync(bindingPath, bindingsContent);
    
        pkgJson = `{"name": "bindings","main": "index.js"}`;
        pkgJsonPath = path.join(process.cwd(), `dist/node_modules/bindings/package.json`);
        fs.writeFileSync(pkgJsonPath, pkgJson);
    }

    buildInstaller() {
        let options = {
            config: {
                directories: {
                    output: path.join(process.cwd(), "release"),
                    app: path.join(process.cwd(), "dist"),
                },
                files: ["**"],
                extends: null,
                productName: "electron-book",
                appId: "com.electron.book",
                asar: false,
                nsis: {
                    oneClick: true,
                    perMachine: true,
                    allowToChangeInstallationDirectory: false,
                    createDesktopShortcut: true,
                    createStartMenuShortcut: true,
                    shortcutName: "bookDesktop",
                },
                publish: [
                    {
                        provider: "generic",
                        url: "http://localhost:5500/"
                    }
                ],
            },
            project: process.cwd()
        };
        return require("electron-builder").build(options);
    }
}

export let buildPlugin = () => {
    return {
        name: "build-plugin",
        closeBundle: () => {
            // console.log("closeBundle");
            let buildObj = new BuildObj();
            buildObj.buildMain();
            buildObj.preparePackageJson();
            buildObj.prepareSqlite();
            buildObj.buildInstaller();
        }
    }
}