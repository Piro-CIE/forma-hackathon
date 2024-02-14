using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using Newtonsoft.Json;


public class FormaHelper : MonoBehaviour
{
    public string token = "";
    public string region = "EMEA";
    public string projectId = "pro_cn7w7x9pr4";
    public string proposalUrn = "urn:adsk-forma-elements:proposal:pro_cn7w7x9pr4:f068c837-08d6-40ad-8b7b-9a82b80767d5:1707829214814";

    // Start is called before the first frame update
    void Start()
    {
        StartCoroutine(GetProject());
        StartCoroutine(GetGeometry(proposalUrn));
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    IEnumerator GetProject()
    {
        UnityWebRequest www = UnityWebRequest.Get(string.Format("https://developer.api.autodesk.com/forma/project/v1alpha/projects/{0}", projectId));

        www.SetRequestHeader("Authorization", string.Format("Bearer {0}", token));
        www.SetRequestHeader("X-Ads-Region", region);

        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.Log(www.error);
        }
        else
        {
            // Show results as text
            Debug.Log(www.downloadHandler.text);

        }
    }

    IEnumerator GetGeometry(string elementUrn)
    {
        UnityWebRequest www = UnityWebRequest.Get(string.Format("https://developer.api.autodesk.com/forma/element-service/v1alpha/elements/{0}?authcontext={1}", elementUrn, projectId));

        www.SetRequestHeader("Authorization", string.Format("Bearer {0}", token));
        www.SetRequestHeader("X-Ads-Region", region);

        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.Log(www.error);
        }
        else
        {
            // Show results as text
            Debug.Log(www.downloadHandler.text);
            Element element = JsonConvert.DeserializeObject<Response>(www.downloadHandler.text).element;

            if(element.children?.Length > 0)
            {
                foreach(var child in element.children)
                {
                    StartCoroutine(GetGeometry(child.urn));
                }
            }
            //Debug.Log(response);
            

        }
    }
}

public struct Response {
    [JsonProperty("element")]
    public Element element;
}

public struct Element
{
    [JsonProperty("urn")]
    public string urn;

    [JsonProperty("children")]
    public ElementChildren[] children;
}

public struct ElementChildren {
    [JsonProperty("key")]
    public string key;

    [JsonProperty("transform")]
    public float[] transform;

    [JsonProperty("urn")]
    public string urn;
}