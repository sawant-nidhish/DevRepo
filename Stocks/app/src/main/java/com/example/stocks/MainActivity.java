package com.example.stocks;

import android.content.Intent;
import android.graphics.Canvas;
import android.os.Bundle;
import android.util.Log;
import android.widget.SearchView;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;

import it.xabaras.android.recyclerview.swipedecorator.RecyclerViewSwipeDecorator;

public class MainActivity extends AppCompatActivity implements portFolio {
    //    private RecyclerView portfolio;
    private RecyclerView portfolioRecyclerView;
    private RecyclerView watchlistRecyclerView;
    private int latestPrice;
    private JSONArray portFolioList;

    private RequestQueue requestQueue;
    private ArrayList<PortfolioModel> portFolioListView = new ArrayList<>();
    private ArrayList<watchlist> watchListView = new ArrayList<>();
    private portfolioAdapter portfolio_apdater;
    private watchlistViewAdapter watchlist_apdater;
    private SearchView searchView;
    @Override
    public void onSuccess(JSONObject response, JSONObject object) {
            try {
                Log.d("Adding this",object.getString("name"));
                portFolioListView.add(new PortfolioModel(object.getString("name"), object.getInt("qty"), object.getInt("totalCost"), object.getInt("avgCost"),response.getInt("c")));
                portfolio_apdater.setPortfolioList(portFolioListView);

            }
            catch (JSONException error){
                Log.d("json exception",error.getMessage());
            }


    }

    //    @Override
//    protected void onResume() {
//        super.onResume();
//        // Perform reloading operations here
//        // For example, if you're fetching data from a server, you can make the network request again
//        //This section will set the current date to the android app
//        Date currDate = new Date();
//        SimpleDateFormat dateFormatter = new SimpleDateFormat("dd MMMM yyyy");
//        String currDate_formatted = dateFormatter.format(currDate);
//
//
//        //This section will set the Cash balance values in the portfolio section
//        ((TextView) findViewById(R.id.date_homebar)).setText(currDate_formatted);
////        portfolio=findViewById(R.id.portfolio);
//        portfolioRecyclerView = findViewById(R.id.portfolioRecyclerView);
//        portfolio_apdater = new portfolioAdapter();
//
//        watchlistRecyclerView = findViewById(R.id.watchlistRecyclerView);
//        watchlist_apdater = new watchlistViewAdapter();
//
//        requestQueue = Volley.newRequestQueue(this);;
//        // This section will be responsible for loading the portfolio recycler view
//
//        fetchWallet();
//        fetchPortfolio();
//        fetchWatchList();
//
//
//        portfolioRecyclerView.setAdapter(portfolio_apdater);
////        portfolio_apdater.notifyDataSetChanged();
//        portfolioRecyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
//
//        watchlistRecyclerView.setAdapter(watchlist_apdater);
////        portfolio_apdater.notifyDataSetChanged();
//        watchlistRecyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
//
//        searchViewFunc();
//    }

    @Override
    public void onError(VolleyError error) {
        Log.d("Portfolio Error",error.getMessage());
    }

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
        portfolioRecyclerView = findViewById(R.id.portfolioRecyclerView);
        portfolio_apdater = new portfolioAdapter();

        watchlistRecyclerView = findViewById(R.id.watchlistRecyclerView);
        watchlist_apdater = new watchlistViewAdapter();

        requestQueue = Volley.newRequestQueue(this);;
        // This section will be responsible for loading the portfolio recycler view

        fetchWallet();
        fetchPortfolio();
        fetchWatchList();


        portfolioRecyclerView.setAdapter(portfolio_apdater);
//        portfolio_apdater.notifyDataSetChanged();
        portfolioRecyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));

        watchlistRecyclerView.setAdapter(watchlist_apdater);
//        portfolio_apdater.notifyDataSetChanged();
        watchlistRecyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));

        searchViewFunc();

        ItemTouchHelper itemTouchHelperPortfolio = new ItemTouchHelper(reorderAndSwipePortfolio);
        itemTouchHelperPortfolio.attachToRecyclerView(portfolioRecyclerView);

        ItemTouchHelper itemTouchHelperFavorites = new ItemTouchHelper(reorderAndSwipeFavorites);
        itemTouchHelperFavorites.attachToRecyclerView(watchlistRecyclerView);
//
    }
//    @Override
//    protected void onResume() {
//        super.onResume();
//        fetchWallet();
//        fetchPortfolio();
//        fetchWatchList();
//
//    }
    ItemTouchHelper.SimpleCallback reorderAndSwipePortfolio = new ItemTouchHelper.SimpleCallback(ItemTouchHelper.UP | ItemTouchHelper.DOWN, 0) {
        @Override
        public boolean onMove(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, @NonNull RecyclerView.ViewHolder target) {

            int fromPosition = viewHolder.getAdapterPosition();
            int toPosition = target.getAdapterPosition();

            Collections.swap(portFolioListView, fromPosition, toPosition);

            recyclerView.getAdapter().notifyItemMoved(fromPosition,toPosition);
            return false;

        }

        @Override
        public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {

        }
    };

    ItemTouchHelper.SimpleCallback reorderAndSwipeFavorites = new ItemTouchHelper.SimpleCallback(ItemTouchHelper.UP | ItemTouchHelper.DOWN, ItemTouchHelper.LEFT) {
        @Override
        public boolean onMove(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, @NonNull RecyclerView.ViewHolder target) {
            int fromPosition = viewHolder.getAdapterPosition();
            int toPosition = target.getAdapterPosition();

            Collections.swap(watchListView, fromPosition, toPosition);

            recyclerView.getAdapter().notifyItemMoved(fromPosition,toPosition);
            return false;

        }

        @Override
        public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
            int position = viewHolder.getAdapterPosition();
            watchlist deleteStock = watchListView.get(position);
            watchListView.remove(position);
            watchlist_apdater.notifyItemRemoved(position);
            JsonObjectRequest delete = new  JsonObjectRequest
                    (Request.Method.DELETE, "https://assignment3-418809.wl.r.appspot.com/api/watchList?symbol="+deleteStock.getSymbol(), null, new Response.Listener<JSONObject>() {

                        @Override
                        public void onResponse(JSONObject response) {
                                Log.d("Onswiped", "onSwiped:"+deleteStock.getSymbol());

                        }
                    }, new Response.ErrorListener() {

                        @Override
                        public void onErrorResponse(VolleyError error) {
                            // TODO: Handle error
                        }
                    });
            requestQueue.add(delete);

        }

        @Override
        public void onChildDraw(@NonNull Canvas c, @NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, float dX, float dY, int actionState, boolean isCurrentlyActive) {
            new RecyclerViewSwipeDecorator.Builder(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive)
                    .addBackgroundColor(ContextCompat.getColor(MainActivity.this, R.color.red))
                    .addActionIcon(R.drawable.delete)
                    .create()
                    .decorate();

            super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);
        }
    };

    public void searchViewFunc(){
        searchView = findViewById(R.id.searchView);
        searchView.clearFocus();

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                Log.d("Search",query);
                Intent newIntent = new Intent(MainActivity.this, SearchPage.class);

                newIntent.putExtra("symbol",query);
                startActivity(newIntent);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                return false;
            }
        });
    }
    public void fetchWallet(){
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
                        Log.d("wallet",error.getMessage());
                    }
                });
        requestQueue.add(wallet_cashBalance);
    }
    public void fetchPortfolio() {
        portFolioListView.clear();
        portfolio_apdater.notifyDataSetChanged();
        JsonArrayRequest portfolio = new JsonArrayRequest
                (Request.Method.GET,
                        "https://assignment3-418809.wl.r.appspot.com/api/portfolio",
                        null,
                        new Response.Listener<JSONArray>() {

                            @Override
                            public void onResponse(JSONArray response) {

                                Log.d("portfolio","Going inside the loop");
                                portFolioList = response;
                                for (int i=0; i<portFolioList.length(); i++) {
                                    JSONObject object = null;
                                    try {
                                        object = portFolioList.getJSONObject(i);
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }
                                    fetchPrice(object,MainActivity.this);


                                }
//                                fetchPrice(portFolioList,MainActivity.this);
//                            portfolioRecyclerView = findViewById(R.id.portfolioRecyclerView);
//                            portFolioList.add(new PortfolioModel(jsonObject.getString("name"), jsonObject.getInt("qty"), jsonObject.getInt("totalCost"), latestPrice));
//                            portfolioAdapter portfolio_apdater = new portfolioAdapter();
//                            portfolio_apdater.setPortfolioList(portFolioList);
//
//                            portfolioRecyclerView.setAdapter(portfolio_apdater);
//
//                            portfolioRecyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));



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
    public void fetchWatchList() {
        watchListView.clear();
        watchlist_apdater.notifyDataSetChanged();
        JsonArrayRequest watchlist = new JsonArrayRequest
                (Request.Method.GET,
                        "https://assignment3-418809.wl.r.appspot.com/api/watchlist",
                        null,
                        new Response.Listener<JSONArray>() {

                            @Override
                            public void onResponse(JSONArray response1) {

                                Log.d("watchlist","Going inside the loop");

                                for (int i=0; i<response1.length(); i++) {

                                    JSONObject object = null;
                                    try {
                                        object = response1.getJSONObject(i);
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }
                                    String symbol;
                                    try {
                                         symbol= object.getString("name");
                                        Log.d("watchlist",symbol);
                                    } catch (JSONException e) {
                                        throw new RuntimeException(e);
                                    }
                                    JSONObject finalObject = object;
                                    JsonObjectRequest currentPrice = new JsonObjectRequest
                                            (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/company_latest_price?symbol=" + symbol, null,
                                                    new Response.Listener<JSONObject>() {

                                                        @Override
                                                        public void onResponse(JSONObject response2) {

                                                            try {
                                                                Log.d("watchlist","From the current price"+symbol);
                                                                watchListView.add(new watchlist(finalObject.getString("name"), finalObject.getString("companyName"), response2.getDouble("c"),response2.getDouble("d"),response2.getDouble("dp")));
                                                                watchlist_apdater.setWatchlists(watchListView);
                                                            } catch (JSONException e) {
                                                                throw new RuntimeException(e);
                                                            }

                                                        }
                                                    }, new Response.ErrorListener() {

                                                @Override
                                                public void onErrorResponse(VolleyError error) {
                                                    // Invoke the callback with the error

                                                }
                                            });
                                        requestQueue.add(currentPrice);



                            }


                            }
                        }, new Response.ErrorListener() {

                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO: Handle error
                        Log.d("wallet",error.getMessage());
                    }
                });
        requestQueue.add(watchlist);


    }

    public void fetchPrice(JSONObject object, final portFolio callback){
        Log.d("FetchPrice","This is the fetch Price");
            JsonObjectRequest currentPrice = null;
            try {

//                Log.d("Current Price",object.getString("c"));
                currentPrice = new JsonObjectRequest
                        (Request.Method.GET, "https://assignment3-418809.wl.r.appspot.com/api/company_latest_price?symbol=" + object.getString("name"), null,
                                new Response.Listener<JSONObject>() {

                            @Override
                            public void onResponse(JSONObject response) {
                                callback.onSuccess(response, object);

                            }
                        }, new Response.ErrorListener() {

                            @Override
                            public void onErrorResponse(VolleyError error) {
                                // Invoke the callback with the error
                                callback.onError(error);
                            }
                        });

            } catch (JSONException error) {
                Log.d("error", error.getMessage());
            }
        requestQueue.add(currentPrice);






    }
}