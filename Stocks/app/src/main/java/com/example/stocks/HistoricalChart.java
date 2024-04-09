package com.example.stocks;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

import java.util.Objects;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link HistoricalChart#newInstance} factory method to
 * create an instance of this fragment.
 */
public class HistoricalChart extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    TextView textView;
    public HistoricalChart() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment HistoricalChart.
     */
    // TODO: Rename and change types and number of parameters
    public static HistoricalChart newInstance(String param1, String param2) {
        HistoricalChart fragment = new HistoricalChart();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
//        return inflater.inflate(R.layout.fragment_historical_chart, container, false);

        // Initialize view
        View view =inflater.inflate(R.layout.fragment_historical_chart, container, false);

        // Assign variable
//        textView=view.findViewById(R.id.text_view);

        // Get Title
        String sTitle=getArguments().getString("title");

        WebView webView = view.findViewById(R.id.historicalChart);

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
                String symbol = "AAPL";
                symbol = getArguments().getString("symbol");
                webView.evaluateJavascript("createChart('" + symbol + "');", null);
            }
        });
        if(Objects.equals(getArguments().getString("title"), "Historical")){
            webView.loadUrl("file:///android_asset/ohcl.html");
        }
        else{
            webView.loadUrl("file:///android_asset/hourly.html");
        }

        // Set title on text view
//        textView.setText(sTitle);

        // return view
        return view;
    }

//    @Override
//    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
//        super.onViewCreated(view, savedInstanceState);
//        WebView webView = view.findViewById(R.id.historicalChart);
//
//        // Enable JavaScript (optional, depends on your requirements)
//        WebSettings webSettings = webView.getSettings();
//        webSettings.setJavaScriptEnabled(true);
//
//        // Load a web page
//        webView.setWebViewClient(new WebViewClient() {
//            @Override
//            public void onPageFinished(WebView view, String url) {
//                super.onPageFinished(view, url);
//
//                // Call JavaScript function after page has finished loading
////                String symbol = "your_symbol_here"; // Replace "your_symbol_here" with your actual symbol
//                String symbol = "AAPL";
//                symbol = getArguments().getString("symbol");
//                webView.evaluateJavascript("createChart('" + symbol + "');", null);
//            }
//        });
//        if(getArguments().getString("title")=="Historical"){
//            webView.loadUrl("file:///android_asset/ohcl.html");
//        }
//        else{
//            webView.loadUrl("file:///android_asset/hourly.html");
//        }
//
//    }
}