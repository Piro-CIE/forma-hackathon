using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using NativeWebSocket;
using PiroCIE.Utils;

public class WebSocketConnection : MonoBehaviour
{
    public GameObject root;
    public Material defaultMaterial;

    WebSocket websocket;

    //byte[] geometryData;

    // Start is called before the first frame update
    async void Start()
    {
        websocket = new WebSocket("ws://192.168.128.98:3006");
        //websocket = new WebSocket("ws://192.168.128.142:3006");

        websocket.OnOpen += () =>
        {
            Debug.Log("Connection open!");
        };

        websocket.OnError += (e) =>
        {
            Debug.Log("Error! " + e);
        };

        websocket.OnClose += (e) =>
        {
            Debug.Log("Connection closed!");
        };

        websocket.OnMessage += (bytes) =>
        {
            //Debug.Log("Received geometry!");
            //Debug.Log(bytes);

            // getting the message as a string
            //var message = System.Text.Encoding.UTF8.GetString(bytes);
            //Debug.Log("OnMessage! " + message);
            //geometryData = bytes;

            ProcessGeometryData(bytes);

        };

        // waiting for messages
        await websocket.Connect();

    }

    // Update is called once per frame
    void Update()
    {
        #if !UNITY_WEBGL || UNITY_EDITOR
                websocket.DispatchMessageQueue();
        #endif

    }

    private async void OnApplicationQuit()
    {
        await websocket.Close();
    }

    private void ProcessGeometryData(byte[] geometryData)
    {
        var bufferStream = new InputStream(geometryData);

        int nbPositions = bufferStream.length / 4;
        float[] geometryPositions = new float[nbPositions];


        for(int i=0; i< nbPositions; i++)
        {
      
            geometryPositions[i] = bufferStream.getFloat32();
        }

        Vector3[] vertices = new Vector3[geometryPositions.Length / 3];
        int[] triangles = new int[vertices.Length]; // ??
        for (int j = 0; j < vertices.Length; j++)
        {
            vertices[j] = new Vector3(geometryPositions[j * 3],
                                    geometryPositions[(j * 3) + 1],
                                    geometryPositions[(j * 3) + 2]);

            triangles[j] = j;
        }


        Mesh mesh = new Mesh();
        mesh.vertices = vertices;
        mesh.triangles = triangles;

        mesh.RecalculateNormals();
        mesh.RecalculateBounds();

        GameObject newObj = new GameObject();
        MeshFilter meshFilter = newObj.AddComponent<MeshFilter>();
        meshFilter.mesh = mesh;

        MeshRenderer meshRenderer = newObj.AddComponent<MeshRenderer>();
        meshRenderer.material = defaultMaterial;

        newObj.transform.SetParent(root.transform, false);


    }
}
