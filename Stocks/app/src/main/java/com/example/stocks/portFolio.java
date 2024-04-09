package com.example.stocks;

import com.android.volley.VolleyError;

import org.json.JSONObject;

public interface portFolio {

    void onSuccess(JSONObject response, JSONObject object);

    void onError(VolleyError error);
}
