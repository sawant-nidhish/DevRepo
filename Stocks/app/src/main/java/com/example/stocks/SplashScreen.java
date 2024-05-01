package com.example.stocks;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class SplashScreen extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_splash_screen);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        ImageView content = (ImageView)findViewById(R.id.imageView2);
        ProgressBar spinner = (ProgressBar)findViewById(R.id.progressBar1);
        spinner.setVisibility(View.GONE);
        content.setVisibility(View.VISIBLE);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                spinner.setVisibility(View.VISIBLE);
                content.setVisibility(View.GONE);

            }
        },2000);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                spinner.setVisibility(View.GONE);
                content.setVisibility(View.GONE);
                Intent intent = new Intent(SplashScreen.this,MainActivity.class);
                startActivity(intent);
                finish();
            }
        },3000);
    }
}