import { Forma } from "https://esm.sh/forma-embedded-view-sdk/auto";


// Create WebSocket connection.
const socket = new WebSocket("ws://localhost:3006");

document.getElementById('geometry-btn').addEventListener('click', async ()=>{
    const buildingPaths =  await Forma.geometry.getPathsByCategory({category: "building"})
    // console.log(buildingPath)

    for(const path of buildingPaths )
    {
        const position = await Forma.geometry.getTriangles({path});
        await new Promise(resolve => {
            setTimeout(()=>{
                socket.send(position);
                resolve()
            }, 50)
        });
    }
})

// const element = document.createElement("div");
// element.innerHTML = `Welcome to ${Forma.getProjectId()}`;
// document.body.appendChild(element);

// const button = document.createElement("button");
// button.textContent = 'Select a building & click';
// button.addEventListener('click', onButtonClick);
// document.body.appendChild(button);

// const btnpickpoint = document.createElement("button");
// btnpickpoint.textContent = 'pick a point';
// btnpickpoint.addEventListener('click', onButtonPickClick);
// document.body.appendChild(btnpickpoint);

// const divfloor = document.createElement("div");
// const btncreatefloor = document.createElement("button");
// btncreatefloor.textContent = 'create floor';
// btncreatefloor.addEventListener('click', onButtonCreatefloor);

// divfloor.appendChild(btncreatefloor);
// document.body.appendChild(divfloor);

window.Forma = Forma;

document.getElementById("btnPickSolid").addEventListener('click',onSelectButtonClick);
document.getElementById("btnPickPoint").addEventListener('click',onButtonPickClick);
document.getElementById("btnSend").addEventListener('click',onSendButtonClick);

var sendgeometry;

async function onSelectButtonClick() {


  var selectedPaths;
  //console.log(selectedPaths);
  while (selectedPaths === undefined) {
    const selection = await Forma.selection.getSelection()
    if(selection.length > 0)
    {
      //console.log("selection active")
      selectedPaths = selection;
    }
  }
  //console.log("fin selection")

  const solid = await Forma.geometry.getTriangles({path: selectedPaths[0]});
  //console.log(solid)
  sendgeometry = solid;

    // const selectedPaths = await Forma.selection.getSelection()
    // console.log(selectedPaths)
    // const buildingPaths = await Forma.geometry.getPathsByCategory({ category: "building" })
    // const selectedBuildingPaths = selectedPaths.filter(path => buildingPaths.includes(path))
    // const numberOfSelectedBuildings = selectedBuildingPaths.length
    // console.log(`Nombre de bâtiments : ${numberOfSelectedBuildings}`)

    
    
    //socket.send(position);
    
    // const selectedbuilding = selectedBuildingPaths[0]
    // const urnBuild = selectedbuilding.split("/")[1];
    // console.log(selectedbuilding);
    // console.log(urnBuild);

    // const siteLimitFootprint = await Forma.geometry.getFootprint({ path: selectedBuildingPaths[0] })
    // console.log(siteLimitFootprint);

  }

  async function onSendButtonClick() {

    //console.log(sendgeometry);
    socket.send(sendgeometry);
    alert('Data Sent')
  }

async function onButtonPickClick() {

      const pos = await Forma.designTool.getPoint();
      console.log(pos);
      
      const canvasPos = coordinateToCanvasSpace(pos)
      console.log(canvasPos)

      const elevation = await Forma.terrain.getElevationAt(pos)
      console.log(`élévation du terrain a ce point : ${elevation}`)   
      const calculateZ = pos.z - elevation;
      console.log(`hauteur calculée: ${calculateZ}`)

      const [latitude, longitude] = await Forma.project.getGeoLocation()
      console.log(Forma.project)
      console.log(`Latitude : ${latitude}`)
      console.log(`Longitude : ${longitude}`)


      document.getElementById("latitude-val").innerText = `${latitude}`
      document.getElementById("longitude-val").innerText = `${longitude}`
      document.getElementById("elevation-val").innerText = `${calculateZ}`

      const dy = pos.y
      const dx = pos.x
      const r_earth = 6371000.0
      const pi = Math.PI

    const new_latitude  = latitude  + (dy / r_earth) * (180 / pi);
    const new_longitude = longitude + (dx / r_earth) * (180 / pi) / Math.cos(latitude * pi/180);

        console.log(`new latitude : ${new_latitude}`)
        console.log(`new longitude : ${new_longitude}`)

        //y_dist = abs(a.lat - b.lat) * 111000;
        //x_dist = abs(a.lon - b.lon) * 111000 * cos(a.lat);

        const distx = (new_longitude - longitude)*Math.cos(latitude * pi/180)*r_earth / (180 / pi)
        const disty = (new_latitude - latitude)*r_earth / (180 / pi)

        console.log(`new x : ${distx}`)
        console.log(`new y : ${disty}`)

  }
const DIMENSION = 1000;

function coordinateToCanvasSpace(pos) {
    return { x: pos.x + DIMENSION / 2, y: DIMENSION / 2 - pos.y };
  }

 
  

async function onButtonCreatefloor() {

    const { urn } = await Forma.elements.floorStack.createFromFloors({
        floors: [
         {
          polygon: [ [0, 0], [10, 0], [10, 10], [0, 10], [0, 0] ],
          height: 3,
         },
         {
          polygon: [ [0, 0], [10, 0], [10, 10], [0, 10], [0, 0] ],
          height: 2.6,
         },
         {
          polygon: [ [0, 0], [10, 0], [10, 8], [0, 8], [0, 0] ],
          height: 2.6,
         },
        ],
       })
       const point = await Forma.designTool.getPoint()
       if (!point) return
       const transform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, point.x, point.y, point.z, 1]
       await Forma.proposal.addElement({ urn, transform });
}


  
