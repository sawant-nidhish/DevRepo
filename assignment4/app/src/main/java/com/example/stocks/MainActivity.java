package com.example.stocks;

import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.ReferenceQueue;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MainActivity extends AppCompatActivity {
//    private RecyclerView portfolio;
    private RecyclerView portfolioRecyclerView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d("On Create","The value is create");
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        //This section will set the current date to the android app
        Date currDate = new Date();
        SimpleDateFormat dateFormatter = new SimpleDateFormat("dd MMMM yyyy");
        String currDate_formatted = dateFormatter.format(currDate);


        //This section will set the Cash balance values in the portfolio section
        ((TextView) findViewById(R.id.date_homebar)).setText(currDate_formatted);
//        portfolio=findViewById(R.id.portfolio);
        RequestQueue requestQueue;
        requestQueue= Volley.newRequestQueue(this);

        JsonObjectRequest wallet_cashBalance = new  JsonObjectRequest
                (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/wallet", null, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            Log.d("wallet",response.getString("money"));
                            TextView netWorth = findViewById(R.id.networth);
                            netWorth.setText("$"+response.getString("money"));
                            TextView cashBalance = findViewById(R.id.cashBalance);
                            cashBalance.setText("$"+response.getString("money"));
                        }
                        catch (JSONException e){
                            e.printStackTrace();
                        }

                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("wallet","Something went wrong");
                    }
                });

        requestQueue.add(wallet_cashBalance);

        // This section will be responsible for loading the portfolio recycler view
        portfolioRecyclerView = findViewById(R.id.portfolioRecyclerView);

    }
}