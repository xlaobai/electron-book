import { effectWatch } from "./reactivity";
import { mountElement, diff } from "./renderer";

export function createApp(rootComponent: any){
    return {
        mount(rootElementID: String) {
            const setupResult = rootComponent.setup(); 
            const APPElement = document.querySelector(`${rootElementID}`);
            let prevSubTree: any;
            let isMounted = false;

            effectWatch(() => {
                if(!isMounted) {
                    const subTree = rootComponent.render(setupResult);
                    console.log("oldSubTree", prevSubTree);
                    console.log("newSubTree", subTree);
                    prevSubTree = subTree;
                    if(APPElement === null) return;
                    APPElement.textContent = ``;
                    mountElement(subTree, APPElement);
                    isMounted = true;
                } else {
                    const subTree = rootComponent.render(setupResult);
                    console.log("oldSubTree", prevSubTree);
                    console.log("newSubTree", subTree);
                    diff(prevSubTree, subTree);
                    prevSubTree = subTree;
                }
                // APPElement?.append(element);
            });

        }
    }
}