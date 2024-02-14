import { Forma } from "https://esm.sh/forma-embedded-view-sdk/auto";

// const element = document.createElement("div");
// element.innerHTML = `Welcome to ${Forma.getProjectId()}`;
// document.body.appendChild(element);
// window.Forma = Forma;


// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:3006");

// // Connection opened
// socket.addEventListener("open", (event) => {
//   socket.send("Hello Server!");
// });

// // Listen for messages
// socket.addEventListener("message", (event) => {
//   console.log("Message from server ", event.data);
// });


document.getElementById('geometry-btn').addEventListener('click', async ()=>{
    const buildingPaths =  await Forma.geometry.getPathsByCategory({category: "building"})
    // console.log(buildingPath)

    for(const path of buildingPaths )
    {
        const position = await Forma.geometry.getTriangles({path});
        socket.send(position);
    }
})
