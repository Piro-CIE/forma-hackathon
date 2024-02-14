using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LocationUtils : MonoBehaviour
{
    const double r_earth = 6371000.0;
    const double pi = Math.PI;
    public static double GetDecalageX(double latitudeOrigin, double longitudeOrigin, double longitudeObject)
    {
        return (longitudeObject - longitudeOrigin) * Math.Cos(latitudeOrigin * pi / 180) * r_earth / (180 / pi);
    }

    public static double GetDecalageY(double latitudeOrigin, double latitudeObject)
    {
        return (latitudeObject - latitudeOrigin) * r_earth / (180 / pi);
    }
}
