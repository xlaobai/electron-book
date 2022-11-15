export let createDialog = (url:string, config: any):Promise<Window> => {
    return new Promise((resolve, reject) => {
        let windowProxy = window.open(url, "_blank", JSON.stringify(config));
        let readyHandler = (e: { data: any; }) => {
            console.log("🚀 ~ file: Dialog.ts ~ line 15 ~ readyHandler ~ readyHandler", e);
            let msg = e.data;
            if(msg["msgName"] === `__dialogReady`) {
                window.removeEventListener("message", readyHandler);
                if(windowProxy !== null) { 
                    resolve(windowProxy);
                } else {
                    reject();
                };
            }
        }
        window.addEventListener("message", readyHandler);
    })
}

export let dialogReady = () => {
    let msg = { msgName: `__dialogReady` };
    window.opener.postMessage(msg);
};