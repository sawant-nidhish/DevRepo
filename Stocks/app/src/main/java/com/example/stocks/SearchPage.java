package com.example.stocks;

import static kotlinx.coroutines.DelayKt.delay;

import android.graphics.Paint;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Handler;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextWatcher;
import android.text.method.LinkMovementMethod;
import android.text.style.ImageSpan;
import android.text.util.Linkify;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.cardview.widget.CardView;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewpager.widget.ViewPager;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.bumptech.glide.Glide;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.google.android.material.tabs.TabLayout;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import java.util.Objects;

public class SearchPage extends AppCompatActivity {

    private LinearLayout content;
    private ProgressBar spinner;
    private RequestQueue requestQueue;
    private String symbol;
    private String company_name;
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
        fetchWatchList();
        fetchPortfolio();
        fetchStats();
        getAbout();
        getSocialSentiments();
        getRecTrends();
        getEpsSurprises();
        getNews();


    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) // Press Back Icon
        {
            finish();
        }

        return super.onOptionsItemSelected(item);
    }



    public void fetchCompanyDetails(){
        JsonObjectRequest companyLatestPrice = new  JsonObjectRequest
                (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/company_description?symbol="+symbol, null, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        try {
//                            Log.d("Log",response.getString("c"));
                            company_name=response.getString("name");
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
                            double current_price = response.getDouble("c");
                            double change_price=response.getDouble("d");
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
                            new Handler().postDelayed(new Runnable() {
                                @Override
                                public void run() {
                                    spinner.setVisibility(View.GONE);
                                    content.setVisibility(View.VISIBLE);
                                }
                            },3000);

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

        int[] imageList={R.drawable.chart_hour, R.drawable.chart_historical};

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
            SpannableString spannableString=new SpannableString(" ");

            // Initialize image span
            ImageSpan imageSpan=new ImageSpan(drawable,ImageSpan.ALIGN_BOTTOM);

            // Set span
            spannableString.setSpan(imageSpan,0,1, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

            // return spannable string
            return spannableString;
        }
    }

    public void fetchWatchList(){
        final boolean[] isPresent = {false};
        JsonObjectRequest favorites = new  JsonObjectRequest
                (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/watchlist?symbol="+symbol, null, new Response.Listener<JSONObject>() {

                    @Override
                    public void onResponse(JSONObject response) {
                        try {
//                            Log.d("Log",response.getString("c"));
                            if(response==null){
                                ImageButton watchListBtn = findViewById(R.id.favorites_btn);
                                watchListBtn.setBackground(ContextCompat.getDrawable(SearchPage.this,R.drawable.star_outline));
                            }
                            else{
                                ImageButton watchListBtn = findViewById(R.id.favorites_btn);
                                watchListBtn.setBackground(ContextCompat.getDrawable(SearchPage.this,R.drawable.star));
                                isPresent[0] =true;
                            }
                            company_name=response.getString("name");
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

        requestQueue.add(favorites);
        ImageButton watchListBtn = findViewById(R.id.favorites_btn);
        watchListBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.d("watchlist","Button clicked");
                if(isPresent[0]){
                    isPresent[0]=false;
                    watchListBtn.setBackground(ContextCompat.getDrawable(SearchPage.this,R.drawable.star_outline));
                    Toast.makeText(SearchPage.this, String.format("%s removed from favorites",symbol),
                            Toast.LENGTH_LONG).show();
                    //delete
                    JsonObjectRequest favoritesDelete = new  JsonObjectRequest
                            (Request.Method.DELETE, "https://assignment3-418809.wl.r.appspot.com/api/watchlist?symbol="+symbol, null, new Response.Listener<JSONObject>() {

                                @Override
                                public void onResponse(JSONObject response) {
//                                    watchListBtn.setBackground(ContextCompat.getDrawable(SearchPage.this,R.drawable.star_outline));
//                                    Toast.makeText(SearchPage.this, String.format("%s removed from favorites",symbol),
//                                            Toast.LENGTH_LONG).show();
                                }
                            }, new Response.ErrorListener() {

                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    // TODO: Handle error
                                    Log.d("wallet",error.getMessage());
                                }
                            });

                    requestQueue.add(favoritesDelete);
                }
                else{
                    //add
                    isPresent[0]=true;
                    watchListBtn.setBackground(ContextCompat.getDrawable(SearchPage.this,R.drawable.star));
                    Toast.makeText(SearchPage.this, String.format("%s is added to favorites",symbol),
                            Toast.LENGTH_LONG).show();
                    JSONObject watchList = new JSONObject();
                    try {
                        watchList.put("name", symbol);
                        watchList.put("companyName", company_name);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    JsonObjectRequest favoritesAdd = new  JsonObjectRequest
                            (Request.Method.POST, "https://assignment3-418809.wl.r.appspot.com/api/watchlist?symbol="+symbol, watchList, new Response.Listener<JSONObject>() {

                                @Override
                                public void onResponse(JSONObject response) {

                                }
                            }, new Response.ErrorListener() {

                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    // TODO: Handle error
                                    Log.d("wallet",error.getMessage());
                                }
                            });

                    requestQueue.add(favoritesAdd);
                }
            }
        });
    }
    public void fetchPortfolio() {
        ((TextView) findViewById(R.id.shares_owned)).setText(String.format("%.2f", 0.00));
        ((TextView) findViewById(R.id.avg_cost)).setText(String.format("$%.2f", 0.00));
        ((TextView) findViewById(R.id.total_cost)).setText(String.format("$%.2f", 0.00));
        ((TextView) findViewById(R.id.change)).setText(String.format("$%.2f", 0.00));
        ((TextView) findViewById(R.id.market_value)).setText(String.format("$%.2f", 0.00));
        final int[] stockIndex = new int[1];
        stockIndex[0]=-1;
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
                                            stockIndex[0] =i;
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
                                                                Log.d("Current Price 12", String.format("%f", response.getDouble("c")));

                                                                double market_value = response.getDouble("c") * stock.getDouble("qty");
//                                                                ImageView imageView2 = findViewById(R.id.imageView2);
//                                                                ImageView imageView3 = findViewById(R.id.imageView3);
                                                                double current_price = response.getDouble("c");
                                                                double change_price = response.getDouble("d");
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

                                ((Button) findViewById(R.id.trade_button)).setOnClickListener(new View.OnClickListener() {
                                    @Override
                                    public void onClick(View v) {

                                        View dialogView = LayoutInflater.from(SearchPage.this).inflate(R.layout.trade_dialogue, null);
                                        AlertDialog tradeDialogue=new MaterialAlertDialogBuilder(SearchPage.this).setView(dialogView)
                                                .show();

                                        JsonObjectRequest companyLatestPrice = new JsonObjectRequest
                                                (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/company_latest_price?symbol=" + symbol, null, new Response.Listener<JSONObject>() {

                                                    @Override
                                                    public void onResponse(JSONObject response1) {
                                                            JsonObjectRequest wallet_cashBalance = new  JsonObjectRequest
                                                                    (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/wallet", null, new Response.Listener<JSONObject>() {

                                                                        @Override
                                                                        public void onResponse(JSONObject response2) {
                                                                            EditText inputShares = dialogView.findViewById(R.id.input_shares);
                                                                            long shares = 0;
                                                                            double purchaseValue= 0;
                                                                            try {
                                                                                purchaseValue = shares*response1.getDouble("c");
                                                                                double moneyInWallet=response2.getDouble("money");
                                                                                ((TextView) dialogView.findViewById(R.id.calculation)).setText(shares+"*$"+String.format("%.2f", response1.getDouble("c"))+"/share = "+String.format("%.2f", purchaseValue));
                                                                                ((TextView) dialogView.findViewById(R.id.money_left)).setText(String.format("$%.2f to buy %s",moneyInWallet,symbol));
                                                                            } catch (
                                                                                    JSONException e) {
                                                                                throw new RuntimeException(e);

                                                                            }

                                                                            inputShares.addTextChangedListener(new TextWatcher() {
                                                                                @Override
                                                                                public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                                                                                }

                                                                                @Override
                                                                                public void onTextChanged(CharSequence s, int start, int before, int count) {

                                                                                }

                                                                                @Override
                                                                                public void afterTextChanged(Editable s) {
                                                                                    long shares = 0;
                                                                                    try{
                                                                                        if(!inputShares.getText().toString().isEmpty()){
                                                                                            shares=Long.parseLong(inputShares.getText().toString());
                                                                                        }

                                                                                    } catch (NumberFormatException e){
                                                                                        Toast.makeText(dialogView.getContext(), "Please enter a valid amount",
                                                                                                Toast.LENGTH_LONG).show();
                                                                                    }
                                                                                    ((TextView) dialogView.findViewById(R.id.trade_heading)).setText("Trade "+symbol+" Inc shares");
                                                                                    try {
                                                                                        double purchaseValue=shares*response1.getDouble("c");
                                                                                        double moneyInWallet=response2.getDouble("money");
                                                                                        ((TextView) dialogView.findViewById(R.id.calculation)).setText(shares+"*$"+String.format("%.2f", response1.getDouble("c"))+"/share = "+String.format("%.2f", purchaseValue));

                                                                                    } catch (
                                                                                            JSONException e) {
                                                                                        throw new RuntimeException(e);
                                                                                    }


//                                                                                        Log.d("wallet",response2.getString("money"));

                                                                                }
                                                                            });

                                                                            Button buyBtn = (Button) dialogView.findViewById(R.id.buy);
                                                                            buyBtn.setOnClickListener(new View.OnClickListener() {
                                                                                @Override
                                                                                public void onClick(View v) {
                                                                                    long shares=0;
                                                                                    try{
                                                                                        if(!inputShares.getText().toString().isEmpty()){
                                                                                            shares=Long.parseLong(inputShares.getText().toString());
                                                                                        }

                                                                                    } catch (NumberFormatException e){
                                                                                        Toast.makeText(dialogView.getContext(), "Please enter a valid amount",
                                                                                                Toast.LENGTH_LONG).show();
                                                                                    }


                                                                                    try {
                                                                                        double purchaseValue=shares*response1.getDouble("c");
                                                                                        double moneyInWallet=response2.getDouble("money");

                                                                                        if(purchaseValue>moneyInWallet){
                                                                                            Toast.makeText(dialogView.getContext(), "Not enough money to buy",
                                                                                                    Toast.LENGTH_LONG).show();

                                                                                        }
                                                                                        else if(purchaseValue<=0){
                                                                                            Toast.makeText(dialogView.getContext(), "Cannot buy non-positive shares",
                                                                                                    Toast.LENGTH_LONG).show();
                                                                                        }
                                                                                        else{
                                                                                            tradeDialogue.dismiss();

                                                                                            JSONObject jsonParams = new JSONObject();
                                                                                            JSONObject walletJson = new JSONObject();
//                                                                                            let stock={
//                                                                                                    name:,
//                                                                                                    companyName:this.companyName,
//                                                                                                    qty:this.quantity,
//                                                                                                    totalCost:this.quantity*this.currentPrice,
//                                                                                                    avgCost:this.total/this.quantity}
                                                                                            try {
                                                                                                jsonParams.put("name", symbol);
                                                                                                walletJson.put("name","wallet");
                                                                                                walletJson.put("money",response2.getDouble("money")-shares*response1.getDouble("c"));
                                                                                                jsonParams.put("companyName", company_name);
                                                                                                jsonParams.put("qty", shares);
                                                                                                jsonParams.put("totalCost", shares*response1.getDouble("c"));
                                                                                                jsonParams.put("avgCost", shares*response1.getDouble("c")/shares);
                                                                                            } catch (JSONException e) {
                                                                                                e.printStackTrace();
                                                                                            }
//                                                                                            Log.d("Json",jsonParams.toString());
                                                                                              //Do a post request to update money in wallet
//                                                                                            let updateMoney={
//                                                                                                    name:'wallet',
//                                                                                                    money:this.money-(this.quantity*this.currentPrice)
//    }
//                                                                                            JsonObjectRequest updateMoney = new JsonObjectRequest(Request.Method.POST, "https://assignment3-418809.wl.r.appspot.com/api/wallet", walletJson,
//                                                                                                    new Response.Listener<JSONObject>() {
//                                                                                                        @Override
//                                                                                                        public void onResponse(JSONObject response) {
//                                                                                                            Log.d("wallet_response",response.toString());
//                                                                                                            // Handle the response from the server
//
//                                                                                                        }
//                                                                                                    }, new Response.ErrorListener() {
//                                                                                                @Override
//                                                                                                public void onErrorResponse(VolleyError error) {
//                                                                                                    // Handle errors
//                                                                                                }
//                                                                                            });
                                                                                            JsonObjectRequest updateMoney = new  JsonObjectRequest
                                                                                                    (Request.Method.POST, "https://assignment3-418809.wl.r.appspot.com/api/wallet", walletJson, new Response.Listener<JSONObject>() {

                                                                                                        @Override
                                                                                                        public void onResponse(JSONObject response) {
                                                                                                            try {
//                            Log.d("Log",response.getString("c"));
                                                                                                                Log.d("wallet_response",response.toString());
                                                                                                            }
                                                                                                            catch (Exception e){
                                                                                                                Log.d("wallet_response",e.toString());
                                                                                                            }

                                                                                                        }
                                                                                                    }, new Response.ErrorListener() {

                                                                                                        @Override
                                                                                                        public void onErrorResponse(VolleyError error) {
                                                                                                            // TODO: Handle error
                                                                                                            Log.d("wallet",error.getMessage());
                                                                                                        }
                                                                                                    });

                                                                                            JsonObjectRequest buyStock = new JsonObjectRequest(Request.Method.POST, "https://assignment3-418809.wl.r.appspot.com/api/portfolio?buy=true", jsonParams,
                                                                                                    new Response.Listener<JSONObject>() {
                                                                                                        @Override
                                                                                                        public void onResponse(JSONObject buyResponse) {
                                                                                                            // Handle the response from the server
                                                                                                            Log.d("buystock","Calling portfolio again");

                                                                                                        }
                                                                                                    }, new Response.ErrorListener() {
                                                                                                @Override
                                                                                                public void onErrorResponse(VolleyError error) {
                                                                                                    // Handle errors
                                                                                                }
                                                                                            });
                                                                                            requestQueue.add(buyStock);
                                                                                            Log.d("buystock","Calling portfolio again outside");
                                                                                            requestQueue.add(updateMoney);

                                                                                            View successDialogView = LayoutInflater.from(SearchPage.this).inflate(R.layout.transaction_confirmation, null);
                                                                                            ((TextView) successDialogView.findViewById(R.id.success_msg)).setText(String.format("You have successfully bought %d shares of %s",shares,symbol));
                                                                                            AlertDialog successVDialog =new MaterialAlertDialogBuilder(SearchPage.this)
                                                                                                    .setView(successDialogView)
                                                                                                    .show();
                                                                                            ((Button) successDialogView.findViewById(R.id.done)).setOnClickListener(new View.OnClickListener() {
                                                                                                @Override
                                                                                                public void onClick(View v) {
                                                                                                    fetchPortfolio();
                                                                                                    successVDialog.dismiss();
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    } catch (
                                                                                            JSONException e) {
                                                                                        throw new RuntimeException(e);
                                                                                    }

                                                                                }
                                                                            });

                                                                            Button sellBtn = (Button) dialogView.findViewById(R.id.sell);
                                                                            sellBtn.setOnClickListener(new View.OnClickListener() {
                                                                                @Override
                                                                                public void onClick(View v) {
                                                                                    long shares=0;
                                                                                    try{
                                                                                        if(!inputShares.getText().toString().isEmpty()){
                                                                                            shares = Long.parseLong(inputShares.getText().toString());
                                                                                        }

                                                                                    } catch (NumberFormatException e){
                                                                                        Toast.makeText(dialogView.getContext(), "Please enter a valid amount",
                                                                                                Toast.LENGTH_LONG).show();
                                                                                    }
                                                                                    try {
                                                                                        double purchaseValue=shares*response1.getDouble("c");
                                                                                        double moneyInWallet=response2.getDouble("money");

                                                                                        double currStocks;
                                                                                        if(stockIndex[0]==-1){
                                                                                            currStocks=0;
                                                                                        }
                                                                                        else{
                                                                                            currStocks=response.getJSONObject(stockIndex[0]).getDouble("qty");
                                                                                        }
                                                                                        Log.d("SellBtn", String.format("%f",currStocks));
                                                                                        if(shares>currStocks){

                                                                                            Toast.makeText(dialogView.getContext(), "Not enough shares to sell",
                                                                                                    Toast.LENGTH_LONG).show();

                                                                                        } else if (shares<=0) {
                                                                                            Toast.makeText(dialogView.getContext(), "Cannot sell non-positive shares",
                                                                                                    Toast.LENGTH_LONG).show();
                                                                                        }
                                                                                        else{
                                                                                            tradeDialogue.dismiss();

                                                                                            JSONObject jsonParams = new JSONObject();
                                                                                            JSONObject walletJson = new JSONObject();
//                                                                                            let stock={
//                                                                                                    name:,
//                                                                                                    companyName:this.companyName,
//                                                                                                    qty:this.quantity,
//                                                                                                    totalCost:this.quantity*this.currentPrice,
//                                                                                                    avgCost:this.total/this.quantity}
                                                                                            try {
                                                                                                jsonParams.put("name", symbol);
                                                                                                walletJson.put("name","wallet");
                                                                                                walletJson.put("money",response2.getDouble("money")+shares*response1.getDouble("c"));
                                                                                                jsonParams.put("companyName", company_name);
                                                                                                jsonParams.put("qty", shares);
                                                                                                jsonParams.put("totalCost", 0);

                                                                                            } catch (JSONException e) {
                                                                                                e.printStackTrace();
                                                                                            }
//
                                                                                            JsonObjectRequest updateMoney = new  JsonObjectRequest
                                                                                                    (Request.Method.POST, "https://assignment3-418809.wl.r.appspot.com/api/wallet", walletJson, new Response.Listener<JSONObject>() {

                                                                                                        @Override
                                                                                                        public void onResponse(JSONObject response) {
                                                                                                            try {
//                            Log.d("Log",response.getString("c"));
                                                                                                                Log.d("wallet_response",response.toString());
                                                                                                            }
                                                                                                            catch (Exception e){
                                                                                                                Log.d("wallet_response",e.toString());
                                                                                                            }

                                                                                                        }
                                                                                                    }, new Response.ErrorListener() {

                                                                                                        @Override
                                                                                                        public void onErrorResponse(VolleyError error) {
                                                                                                            // TODO: Handle error
                                                                                                            Log.d("wallet",error.getMessage());
                                                                                                        }
                                                                                                    });
                                                                                            if(currStocks==shares){
                                                                                                JsonObjectRequest deleteStock = new JsonObjectRequest(Request.Method.DELETE, "https://assignment3-418809.wl.r.appspot.com/api/portfolio?symbol="+symbol, null,
                                                                                                        new Response.Listener<JSONObject>() {
                                                                                                            @Override
                                                                                                            public void onResponse(JSONObject buyResponse) {
                                                                                                                // Handle the response from the server
                                                                                                                Log.d("buystock", "Calling portfolio again");

                                                                                                            }
                                                                                                        }, new Response.ErrorListener() {
                                                                                                    @Override
                                                                                                    public void onErrorResponse(VolleyError error) {
                                                                                                        // Handle errors
                                                                                                    }
                                                                                                });
                                                                                                requestQueue.add(deleteStock);
                                                                                            }
                                                                                            else {


                                                                                                JsonObjectRequest buyStock = new JsonObjectRequest(Request.Method.POST, "https://assignment3-418809.wl.r.appspot.com/api/portfolio?buy=sell", jsonParams,
                                                                                                        new Response.Listener<JSONObject>() {
                                                                                                            @Override
                                                                                                            public void onResponse(JSONObject buyResponse) {
                                                                                                                // Handle the response from the server
                                                                                                                Log.d("buystock", "Calling portfolio again");

                                                                                                            }
                                                                                                        }, new Response.ErrorListener() {
                                                                                                    @Override
                                                                                                    public void onErrorResponse(VolleyError error) {
                                                                                                        // Handle errors
                                                                                                    }
                                                                                                });
                                                                                                requestQueue.add(buyStock);
                                                                                            }
                                                                                            Log.d("buystock","Calling portfolio again outside");
                                                                                            requestQueue.add(updateMoney);

                                                                                            View successDialogView = LayoutInflater.from(SearchPage.this).inflate(R.layout.transaction_confirmation, null);
                                                                                            ((TextView) successDialogView.findViewById(R.id.success_msg)).setText(String.format("You have successfully sold %d shares of %s",shares,symbol));
                                                                                            AlertDialog successVDialog =new MaterialAlertDialogBuilder(SearchPage.this)
                                                                                                    .setView(successDialogView)
                                                                                                    .show();
                                                                                            ((Button) successDialogView.findViewById(R.id.done)).setOnClickListener(new View.OnClickListener() {
                                                                                                @Override
                                                                                                public void onClick(View v) {
                                                                                                    fetchPortfolio();
                                                                                                    successVDialog.dismiss();
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    } catch (
                                                                                            JSONException e) {
                                                                                        throw new RuntimeException(e);
                                                                                    }

                                                                                }
                                                                            });

//                                                                                TextView netWorth = findViewById(R.id.networth);
//                                                                                netWorth.setText("$"+response.getString("money"));
//                                                                                TextView cashBalance = findViewById(R.id.cashBalance);
//                                                                                cashBalance.setText("$"+response.getString("money"));

                                                                        }
                                                                    }, new Response.ErrorListener() {

                                                                        @Override
                                                                        public void onErrorResponse(VolleyError error) {
                                                                            // TODO: Handle error
                                                                            Log.d("wallet",error.getMessage());
                                                                        }
                                                                    });
                                                            requestQueue.add(wallet_cashBalance);



                                                    }
                                                }, new Response.ErrorListener() {

                                                    @Override
                                                    public void onErrorResponse(VolleyError error) {
                                                        // TODO: Handle error
                                                        Log.d("wallet", Objects.requireNonNull(error.getMessage()));
                                                    }
                                                });
                                        requestQueue.add(companyLatestPrice);
                            //
                                    }
                                });




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
                                                                    LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                                                                            LinearLayout.LayoutParams.WRAP_CONTENT,
                                                                            LinearLayout.LayoutParams.WRAP_CONTENT
                                                                    );
                                                                    for (int i=0; i<response2.length(); i++){
                                                                        TextView textView=new TextView(SearchPage.this);
                                                                        textView.setText(response2.get(i).toString()+",");
                                                                        textView.setPadding(0,0,40,0);
                                                                        layoutParams.setMargins(5, 0, 5, 0);
                                                                        textView.setPaintFlags(textView.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
                                                                        textView.setTextColor(getResources().getColor(R.color.blue));

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

    public void getSocialSentiments(){
        JsonObjectRequest sentiments = new JsonObjectRequest
                (Request.Method.GET,
                        "https://assignment3-418809.wl.r.appspot.com/api/company_insider_sentiments?symbol="+symbol,
                        null,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject response) {

                                Log.d("portfolio", "Going inside the loop");
                                JSONArray sentimentsArray;
                                try {
                                    sentimentsArray=response.getJSONArray("data");
                                } catch (JSONException e) {
                                    throw new RuntimeException(e);
                                }
                                double totalMSPR = 0;
                                double posMSPR=0;
                                double negMSPR=0;
                                double totalChange=0;
                                double posChange=0;
                                double negChange=0;
                                for(int i=0; i<sentimentsArray.length(); i++){
                                    // console.log(data[i].mspr)
                                    JSONObject sentimentObject;
                                    try {
                                        sentimentObject = sentimentsArray.getJSONObject(i);
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }
                                    double mspr;
                                    try {
                                        mspr=sentimentObject.getDouble("mspr");
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }
                                    totalMSPR+=mspr;
                                    if(mspr>=0){
                                        posMSPR+=mspr;
                                    }
                                    else if(mspr<0){
                                        negMSPR+=mspr;
                                    }

                                    double change;
                                    try {
                                        change=sentimentObject.getDouble("change");
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }
                                    totalChange+=change;
                                    if(change>=0){
                                        posChange+=change;
                                    }
                                    else if(change<0){
                                        negChange+=change;
                                    }

                                }
                                ((TextView)findViewById(R.id.company_name)).setText(symbol.toUpperCase()+" Inc");
                                ((TextView)findViewById(R.id.total_msrp)).setText(String.format("%.2f",totalMSPR));
                                ((TextView)findViewById(R.id.positive_msrp)).setText(String.format("%.2f",posMSPR));
                                ((TextView)findViewById(R.id.negative_msrp)).setText(String.format("%.2f",negMSPR));

                                ((TextView)findViewById(R.id.total_change)).setText(String.format("%.2f",totalChange));
                                ((TextView)findViewById(R.id.positive_change)).setText(String.format("%.2f",posChange));
                                ((TextView)findViewById(R.id.negative_change)).setText(String.format("%.2f",negChange));
                            }
                        }
                        , new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("wallet",error.getMessage());
                    }
                });
        requestQueue.add(sentiments);
    }
    public void getRecTrends(){
        WebView webView = findViewById(R.id.recTrends);

        // Enable JavaScript (optional, depends on your requirements)
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        // Load a web page
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                // Call JavaScript function after page has finished loading
//                String symbol = "your_symbol_here"; // Replace "your_symbol_here" with your actual symbol

                webView.evaluateJavascript("createChart('" + symbol + "');", null);
            }
        });

            webView.loadUrl("file:///android_asset/recTrends.html");
    }

    public void getEpsSurprises(){
        WebView webView = findViewById(R.id.epsSurprises);

        // Enable JavaScript (optional, depends on your requirements)
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        // Load a web page
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                // Call JavaScript function after page has finished loading
//                String symbol = "your_symbol_here"; // Replace "your_symbol_here" with your actual symbol

                webView.evaluateJavascript("createChart('" + symbol + "');", null);
            }
        });

        webView.loadUrl("file:///android_asset/eps.html");
    }

    public void getNews(){
        RecyclerView newsRecyclerView = findViewById(R.id.newRecyclerView);

        JsonArrayRequest newsRequest = new JsonArrayRequest
                (Request.Method.GET,
                        "https://assignment3-418809.wl.r.appspot.com/api/company_news?symbol="+symbol,
                        null,
                        new Response.Listener<JSONArray>() {
                            @Override
                            public void onResponse(JSONArray response) {
                                ArrayList<NewsModel> news = new ArrayList<>();
                                int cnt=0;
                                for(int i=0; i<response.length(); i++){
                                    JSONObject newsObject;
                                    try {
                                        newsObject = response.getJSONObject(i);
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }
//                                    +newsObject.getString("headline")
//                                    Log.d("news", "onResponse:");

                                    try {
                                        newsObject = response.getJSONObject(i);
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }

                                    String imgurl;
                                    try {
                                        imgurl=newsObject.getString("image");
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }

                                    if(!imgurl.isEmpty()){
                                        if(cnt==0){
                                            try {
                                                ((TextView)findViewById(R.id.news_heading)).setText(newsObject.getString("headline"));
                                                ((TextView)findViewById(R.id.source)).setText(newsObject.getString("source"));
                                                ((TextView)findViewById(R.id.timeElapsed)).setText(timeElapsed(newsObject.getLong("datetime")));
                                                Glide.with(SearchPage.this)
                                                        .load(newsObject.getString("image"))
                                                        .into(((ImageView)findViewById(R.id.news_image)));
                                            } catch (JSONException e) {
                                                throw new RuntimeException(e);
                                            }
                                            cnt++;

                                            JSONObject finalNewsObject = newsObject;
                                            ((CardView) findViewById(R.id.news_card)).setOnClickListener(new View.OnClickListener() {
                                                @Override
                                                public void onClick(View v) {
                                                    View dialogView = LayoutInflater.from(SearchPage.this).inflate(R.layout.news_dialogue, null);

                                                    try {
                                                        ((TextView) dialogView.findViewById(R.id.news_source)).setText(finalNewsObject.getString("source"));
                                                        ((TextView) dialogView.findViewById(R.id.news_time)).setText(simpleDateFormatter(finalNewsObject.getLong("datetime")));
                                                        ((TextView) dialogView.findViewById(R.id.news_heading)).setText(finalNewsObject.getString("headline"));
                                                        ((TextView) dialogView.findViewById(R.id.news_summary)).setText(finalNewsObject.getString("summary"));
                                                    } catch (JSONException e) {
                                                        throw new RuntimeException(e);
                                                    }

                                                    new MaterialAlertDialogBuilder(SearchPage.this)
                                                            .setView(dialogView)
                                                            .show();

                                                    dialogView.findViewById(R.id.chrome).setOnClickListener(new View.OnClickListener() {
                                                        @Override
                                                        public void onClick(View v) {
                                                            Uri uri = null; // missing 'http://' will cause crashed
                                                            try {
                                                                uri = Uri.parse(finalNewsObject.getString("url"));
                                                            } catch (JSONException e) {
                                                                throw new RuntimeException(e);
                                                            }
                                                            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                                                            SearchPage.this.startActivity(intent);

                                                        }
                                                    });

                                                    dialogView.findViewById(R.id.twitter).setOnClickListener(new View.OnClickListener() {
                                                        @Override
                                                        public void onClick(View v) {
                                                            Uri uri = null; // missing 'http://' will cause crashed
                                                            try {
                                                                uri = Uri.parse("https://twitter.com/intent/tweet?text=Check out this Link:&"+"url="+ finalNewsObject.getString("url"));
                                                            } catch (JSONException e) {
                                                                throw new RuntimeException(e);
                                                            }
                                                            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                                                            SearchPage.this.startActivity(intent);

                                                        }
                                                    });


                                                    dialogView.findViewById(R.id.facebook).setOnClickListener(new View.OnClickListener() {
                                                        @Override
                                                        public void onClick(View v) {
                                                            Uri uri = null; // missing 'http://' will cause crashed
                                                            try {
                                                                uri = Uri.parse("https://www.facebook.com/sharer/sharer.php?u="+finalNewsObject.getString("url")+"&amp;src=sdkpreparse");
                                                            } catch (JSONException e) {
                                                                throw new RuntimeException(e);
                                                            }
                                                            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                                                            SearchPage.this.startActivity(intent);

                                                        }
                                                    });


                                                }
                                            });
                                        }
                                        else{
                                            try {
                                                long datetime = newsObject.getLong("datetime");

                                                news.add(new NewsModel(newsObject.getString("headline"),newsObject.getString("source"),timeElapsed(datetime),newsObject.getString("image"),newsObject.getString("summary"),newsObject.getString("url"),simpleDateFormatter(datetime)));
                                            } catch (JSONException e) {
                                                throw new RuntimeException(e);
                                            }
                                        }
//                                        try {
//                                            Log.d("news", newsObject.getString("headline"));
//                                        } catch (JSONException e) {
//                                            throw new RuntimeException(e);
//                                        }

                                    }

                                }
                                newsAdapter adapter= new newsAdapter();
                                adapter.setNews(news);

                                newsRecyclerView.setAdapter(adapter);
                                newsRecyclerView.setLayoutManager(new LinearLayoutManager(SearchPage.this));

                            }
                        }
                        , new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("wallet",error.getMessage());
                    }
                });
        requestQueue.add(newsRequest);



    }

    public String timeElapsed(long unixTime) {
        long currentTime = Instant.now().getEpochSecond();
        long timeDifference = currentTime - unixTime;

        if (timeDifference >= 3600) { // If more than an hour has passed
            long hours = timeDifference / 3600;
            return hours + (hours == 1 ? " hour ago" : " hours ago");
        } else if (timeDifference >= 60) { // If more than a minute has passed
            long minutes = timeDifference / 60;
            return minutes + (minutes == 1 ? " minute ago" : " minutes ago");
        } else { // If less than a minute has passed
            return timeDifference + (timeDifference == 1 ? " second ago" : " seconds ago");
        }
    }

    public String simpleDateFormatter(long unixTime) {

        // Create a Date object from the Unix timestamp
        Date date = new Date(unixTime * 1000L); // Unix timestamps are in seconds, so we multiply by 1000 to convert to milliseconds

        // Define the date format
        SimpleDateFormat sdf = new SimpleDateFormat("dd MMMM, yyyy", Locale.getDefault());

        // Format the date and print it
        String formattedDate = sdf.format(date);
        return formattedDate;
    }

}