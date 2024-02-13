import {Forma} from "https://esm.sh/forma-embedded-view-sdk/auto";

const element = document.createElement("div");
element.innerHTML = `Welcome to ${Forma.getProjectId()}`;
document.body.appendChild(element);
window.Forma = Forma;