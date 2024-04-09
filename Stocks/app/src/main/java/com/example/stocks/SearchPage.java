package com.example.stocks;

import static kotlinx.coroutines.DelayKt.delay;

import android.graphics.drawable.Drawable;
import android.os.Handler;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.method.LinkMovementMethod;
import android.text.style.ImageSpan;
import android.text.util.Linkify;
import android.util.Log;
import android.view.View;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.tabs.TabLayout;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Objects;

public class SearchPage extends AppCompatActivity {

    private LinearLayout content;
    private ProgressBar spinner;
    private RequestQueue requestQueue;
    private String symbol;
    private TextView companyName;
    private TextView currentPrice;
    private TextView changePrice;
    private TextView changePercent;

    private float current_price;
    TabLayout tabLayout;
    ViewPager viewPager;
    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_search_page);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });



        content = (LinearLayout)findViewById(R.id.content);
        spinner = (ProgressBar)findViewById(R.id.progressBar1);

        content.setVisibility(View.GONE);
        spinner.setVisibility(View.VISIBLE);

        Intent thisIntent=getIntent();
        symbol = thisIntent.getStringExtra("symbol");
        ((TextView) findViewById(R.id.symbol)).setText(symbol);

        requestQueue = Volley.newRequestQueue(this);;

        Toolbar toolbar = findViewById(R.id.toolbar2);
        toolbar.setTitle(null);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);


        //Company Latest Price Section
        ((TextView) findViewById(R.id.tokenName)).setText(symbol);

        companyName = findViewById(R.id.companyName);
        currentPrice = findViewById(R.id.currentPrice);
        changePrice = findViewById(R.id.changePrice);
        changePercent = findViewById(R.id.changePercent);





        fetchCompanyDetails();
        fetchCompanyPrice();
        //Historical chart

        tabLayout=findViewById(R.id.tab_layout);
        viewPager=findViewById(R.id.view_pager);

        ArrayList<String> arrayList=new ArrayList<>(0);

        // Add title in array list
        arrayList.add("Hourly");
        arrayList.add("Historical");
//        arrayList.add("Pro");

        // Setup tab layout
        tabLayout.setupWithViewPager(viewPager);

        // Prepare view pager
        prepareViewPager(viewPager,arrayList);

        fetchPortfolio();
        fetchStats();
        getAbout();


    }



    public void fetchCompanyDetails(){
        JsonObjectRequest companyLatestPrice = new  JsonObjectRequest
                (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/company_description?symbol="+symbol, null, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        try {
//                            Log.d("Log",response.getString("c"));
                            companyName.setText(response.getString("name"));
                        }
                        catch (JSONException e){
                            e.printStackTrace();
                        }

                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("wallet",error.getMessage());
                    }
                });

        requestQueue.add(companyLatestPrice);
    }
    public void fetchCompanyPrice(){
        JsonObjectRequest companyLatestPrice = new  JsonObjectRequest
                (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/company_latest_price?symbol="+symbol, null, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        try {
//                            Log.d("Log",response.getString("c"));
                            ImageView imageView = findViewById(R.id.imageView);
                            current_price = response.getInt("c");
                            float change_price=response.getInt("d");
                            if(change_price<0){
                                Drawable drawable = ContextCompat.getDrawable(SearchPage.this, R.drawable.trending_down);
// Set the desired color
                                assert drawable != null;
                                drawable.setTint(ContextCompat.getColor(SearchPage.this, R.color.red));

                                imageView.setImageDrawable(drawable);

//            holder.imageView.setImageResource(R.drawable.trending_down);
//            holder.imageView.setColorFilter(R.color.red);
                                changePrice.setTextColor(ContextCompat.getColor(SearchPage.this, R.color.red));
                                changePercent.setTextColor(ContextCompat.getColor(SearchPage.this, R.color.red));
                            }
                            else if(change_price>0){
                                Drawable drawable = ContextCompat.getDrawable(SearchPage.this, R.drawable.trending_up);
// Set the desired color
                                assert drawable != null;
                                drawable.setTint(ContextCompat.getColor(SearchPage.this, R.color.green));

                                imageView.setImageDrawable(drawable);
                                changePrice.setTextColor(ContextCompat.getColor(SearchPage.this, R.color.green));
                                changePercent.setTextColor(ContextCompat.getColor(SearchPage.this, R.color.green));
                            }


                            currentPrice.setText(String.format("$%.2f",response.getDouble("c")));
                            changePrice.setText(String.format("$%.2f",response.getDouble("d")));
                            changePercent.setText(String.format("(%.2f%%)",response.getDouble("dp")));
                            final Handler handler = new Handler();
                            spinner.setVisibility(View.GONE);
                            content.setVisibility(View.VISIBLE);
//                            handler.postDelayed(new Runnable() {
//                                @Override
//                                public void run() {
//                                    // Do something after 5s = 5000ms
//                                    spinner.setVisibility(View.GONE);
//                                    content.setVisibility(View.VISIBLE);
//                                }
//                            }, 5000);

                        }
                        catch (JSONException e){
                            e.printStackTrace();
                        }

                    }
                }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("wallet",error.getMessage());
                    }
                });

        requestQueue.add(companyLatestPrice);


    }
    private void prepareViewPager(ViewPager viewPager, ArrayList<String> arrayList) {
        // Initialize main adapter
        MainAdapter adapter=new MainAdapter(getSupportFragmentManager());

        // Initialize main fragment
        HistoricalChart mainFragment=new HistoricalChart();

        // Use for loop
        for(int i=0;i<arrayList.size();i++)
        {
            // Initialize bundle
            Bundle bundle=new Bundle();

            // Put title
            bundle.putString("title",arrayList.get(i));
            bundle.putString("symbol",symbol);

            // set argument
            mainFragment.setArguments(bundle);

            // Add fragment
            adapter.addFragment(mainFragment,arrayList.get(i));
            mainFragment=new HistoricalChart();
        }
        // set adapter
        viewPager.setAdapter(adapter);
    }

    private class MainAdapter extends FragmentPagerAdapter {
        // Initialize arrayList
        ArrayList<Fragment> fragmentArrayList= new ArrayList<>();
        ArrayList<String> stringArrayList=new ArrayList<>();

        int[] imageList={R.drawable.trending_down, R.drawable.trending_up};

        // Create constructor
        public void addFragment(Fragment fragment, String s)
        {
            // Add fragment
            fragmentArrayList.add(fragment);
            // Add title
            stringArrayList.add(s);
        }

        public MainAdapter(FragmentManager supportFragmentManager) {
            super(supportFragmentManager);
        }

        @NonNull
        @Override
        public Fragment getItem(int position) {
            // return fragment position
            return fragmentArrayList.get(position);
        }

        @Override
        public int getCount() {
            // Return fragment array list size
            return fragmentArrayList.size();
        }

        @Nullable
        @Override
        public CharSequence getPageTitle(int position) {

            // Initialize drawable
            Drawable drawable= ContextCompat.getDrawable(getApplicationContext()
                    ,imageList[position]);

            // set bound
            drawable.setBounds(0,0,drawable.getIntrinsicWidth(),
                    drawable.getIntrinsicHeight());

            // Initialize spannable image
            SpannableString spannableString=new SpannableString(""+stringArrayList.get(position));

            // Initialize image span
            ImageSpan imageSpan=new ImageSpan(drawable,ImageSpan.ALIGN_BOTTOM);

            // Set span
            spannableString.setSpan(imageSpan,0,1, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

            // return spannable string
            return spannableString;
        }
    }

    public void fetchPortfolio() {
        JsonArrayRequest portfolio = new JsonArrayRequest
                (Request.Method.GET,
                        "https://assignment3-418809.wl.r.appspot.com/api/portfolio",
                        null,
                        new Response.Listener<JSONArray>() {


                            @Override
                            public void onResponse(JSONArray response) {

                                Log.d("portfolio", "Going inside the loop");
                                //                                JsonObjectRequest companyLatestPrice = null;
                                for (int i = 0; i < response.length(); i++) {
                                    try {
                                        JSONObject stock = response.getJSONObject(i);
                                        Log.d("Portfolio", stock.getString("name"));
                                        if (stock.getString("name").equals(symbol)) {
                                            Log.d("Portfolio", "Exists");
                                            JsonObjectRequest companyLatestPrice = new JsonObjectRequest
                                                    (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/company_latest_price?symbol=" + symbol, null, new Response.Listener<JSONObject>() {

                                                        @Override
                                                        public void onResponse(JSONObject response) {
                                                            try {
//                            Log.d("Log",response.getString("c"));
                                                                ((TextView) findViewById(R.id.shares_owned)).setText(String.format("%.2f", stock.getDouble("qty")));
                                                                ((TextView) findViewById(R.id.avg_cost)).setText(String.format("$%.2f", stock.getDouble("avgCost")));
                                                                ((TextView) findViewById(R.id.total_cost)).setText(String.format("$%.2f", stock.getDouble("totalCost")));
                                                                Log.d("Current Price", String.format("%f", current_price));

                                                                double market_value = response.getDouble("c") * stock.getDouble("qty");
//                                                                ImageView imageView2 = findViewById(R.id.imageView2);
//                                                                ImageView imageView3 = findViewById(R.id.imageView3);
                                                                current_price = response.getInt("c");
                                                                float change_price = response.getInt("d");
                                                                if (current_price < market_value) {
                                                                    Drawable drawable = ContextCompat.getDrawable(SearchPage.this, R.drawable.trending_down);
// Set the desired color
                                                                    assert drawable != null;
                                                                    drawable.setTint(ContextCompat.getColor(SearchPage.this, R.color.red));

//                                                                    imageView2.setImageDrawable(drawable);
//                                                                    imageView3.setImageDrawable(drawable);

//            holder.imageView.setImageResource(R.drawable.trending_down);
//            holder.imageView.setColorFilter(R.color.red);
                                                                    ((TextView) findViewById(R.id.change)).setTextColor(ContextCompat.getColor(SearchPage.this, R.color.red));
                                                                    ((TextView) findViewById(R.id.market_value)).setTextColor(ContextCompat.getColor(SearchPage.this, R.color.red));
                                                                } else if (change_price > market_value) {
                                                                    Drawable drawable = ContextCompat.getDrawable(SearchPage.this, R.drawable.trending_up);
// Set the desired color
                                                                    assert drawable != null;
                                                                    drawable.setTint(ContextCompat.getColor(SearchPage.this, R.color.green));

//                                                                    imageView2.setImageDrawable(drawable);
//                                                                    imageView3.setImageDrawable(drawable);
                                                                    ((TextView) findViewById(R.id.change)).setTextColor(ContextCompat.getColor(SearchPage.this, R.color.green));
                                                                    ((TextView) findViewById(R.id.market_value)).setTextColor(ContextCompat.getColor(SearchPage.this, R.color.green));
                                                                }

                                                                ((TextView) findViewById(R.id.change)).setText(String.format("$%.2f", response.getDouble("c")));
                                                                ((TextView) findViewById(R.id.market_value)).setText(String.format("$%.2f", market_value));

                                                            } catch (JSONException e) {
                                                                e.printStackTrace();
                                                            }

                                                        }
                                                    }, new Response.ErrorListener() {

                                                        @Override
                                                        public void onErrorResponse(VolleyError error) {
                                                            // TODO: Handle error
                                                            Log.d("wallet", Objects.requireNonNull(error.getMessage()));
                                                        }
                                                    });
                                            requestQueue.add(companyLatestPrice);
                                            break;
                                        }
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }
                                }



                            }
                        }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("wallet",error.getMessage());
                    }
                });
        requestQueue.add(portfolio);



    }

    public void fetchStats() {
        JsonObjectRequest portfolio = new JsonObjectRequest
                (Request.Method.GET,
                        "https://assignment3-418809.wl.r.appspot.com/api/company_latest_price?symbol="+symbol,
                        null,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {

                                Log.d("portfolio", "Going inside the loop");
                                try {
                                    ((TextView)findViewById(R.id.open_price_value)).setText(String.format("$%.2f", response.getDouble("o")));
                                    ((TextView)findViewById(R.id.high_price_value)).setText(String.format("$%.2f", response.getDouble("h")));
                                    ((TextView)findViewById(R.id.low_price_value)).setText(String.format("$%.2f", response.getDouble("l")));
                                    ((TextView)findViewById(R.id.prev_close_value)).setText(String.format("$%.2f", response.getDouble("pc")));
                                } catch (JSONException e) {
                                    throw new RuntimeException(e);
                                }

                            }
                        }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("wallet",error.getMessage());
                    }
                });
        requestQueue.add(portfolio);



    }

    public void getAbout(){
        JsonObjectRequest about = new JsonObjectRequest
                (Request.Method.GET,
                        "https://assignment3-418809.wl.r.appspot.com/api/company_description?symbol="+symbol,
                        null,
                        new Response.Listener<JSONObject>() {


                            @Override
                            public void onResponse(JSONObject response1) {

                                Log.d("portfolio", "Going inside the loop");

                                    try {

                                        JsonArrayRequest peers = new JsonArrayRequest
                                                (Request.Method.GET,
                                                        "https://assignment3-418809.wl.r.appspot.com/api/company_peers?symbol="+symbol,
                                                        null,
                                                        new Response.Listener<JSONArray>() {


                                                            @Override
                                                            public void onResponse(JSONArray response2) {

                                                                Log.d("portfolio", "Going inside the loop");

                                                                try {
                                                                    Log.d("portfolio", response2.get(0).toString());
                                                                    ((TextView) findViewById(R.id.ipo_start_date)).setText(response1.getString("ipo"));
                                                                    ((TextView) findViewById(R.id.industry_value)).setText(response1.getString("finnhubIndustry"));
                                                                    ((TextView) findViewById(R.id.webpage_value)).setText(response1.getString("weburl"));
                                                                    StringBuilder peerString= new StringBuilder();

                                                                    LinearLayout peerLinearLayout = findViewById(R.id.company_peers_value);
                                                                    for (int i=0; i<response2.length(); i++){
                                                                        TextView textView=new TextView(SearchPage.this);
                                                                        textView.setText(response2.get(i).toString()+", ");
//                                                                        textView.setAutoLinkMask(Linkify.addLinks());
                                                                        int finalI = i;
                                                                        textView.setOnClickListener(new View.OnClickListener() {
                                                                            @Override
                                                                            public void onClick(View v) {
                                                                                Intent newIntent = new Intent(SearchPage.this, SearchPage.class);

                                                                                try {
                                                                                    Log.d("New Intent",response2.get(finalI).toString());
                                                                                    newIntent.putExtra("symbol",response2.get(finalI).toString());
                                                                                } catch (
                                                                                        JSONException e) {
                                                                                    throw new RuntimeException(e);
                                                                                }
                                                                                startActivity(newIntent);
                                                                            }
                                                                        });
                                                                        peerLinearLayout.addView(textView);

                                                                    }


//                                                                    }



                                                                } catch (JSONException e) {
                                                                    throw new RuntimeException(e);
                                                                }
                                                            }
                                                        }
                                                        , new Response.ErrorListener() {

                                                    @Override
                                                    public void onErrorResponse(VolleyError error) {
                                                        // TODO: Handle error
                                                        Log.d("wallet",error.getMessage());
                                                    }
                                                });
                                        requestQueue.add(peers);


                                    } catch (Exception e) {
                                        throw new RuntimeException(e);
                                    }
                                }
                            }
                        , new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("wallet",error.getMessage());
                    }
                });
        requestQueue.add(about);
    }
}