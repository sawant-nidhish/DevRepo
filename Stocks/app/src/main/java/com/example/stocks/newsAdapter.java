package com.example.stocks;

//import static androidx.core.content.ContextCompat.startActivity;

import static androidx.core.content.ContextCompat.startActivity;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;
//import com.squareup.picasso.Picasso;

import org.w3c.dom.Text;

import java.util.ArrayList;

public class newsAdapter  extends RecyclerView.Adapter<newsAdapter.ViewHolder>{
    public void setNews(ArrayList<NewsModel> news) {
        this.news = news;
        notifyDataSetChanged();
    }

    private ArrayList<NewsModel> news = new ArrayList<>();
    public newsAdapter() {
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.news_list_item,parent,false);
        ViewHolder holder = new ViewHolder(view);
        return holder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

//        Log.d("newsAdapter",news.get(position).getHeading());

        holder.heading.setText(news.get(position).getHeading());
        holder.source.setText(news.get(position).getSource());
        holder.timeElapsed.setText(news.get(position).getTimeElpased());
        Glide.with(holder.itemView)
                .load(news.get(position).getImgUrl())
                .into(holder.imageView);
//        Picasso.get().load(news.get(position).getImgUrl()).into(holder.imageView);
        holder.newsCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                View dialogView = LayoutInflater.from(holder.itemView.getContext()).inflate(R.layout.news_dialogue, null);
                ((TextView) dialogView.findViewById(R.id.news_source)).setText(news.get(position).getSource());
                ((TextView) dialogView.findViewById(R.id.news_time)).setText(news.get(position).getSimpleTime());
                ((TextView) dialogView.findViewById(R.id.news_heading)).setText(news.get(position).getHeading());
                ((TextView) dialogView.findViewById(R.id.news_summary)).setText(news.get(position).getSummary());
                new MaterialAlertDialogBuilder(holder.itemView.getContext())
                        .setView(dialogView)
                        .show();

                dialogView.findViewById(R.id.chrome).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Uri uri = Uri.parse(news.get(position).getSrcUrl()); // missing 'http://' will cause crashed
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        holder.itemView.getContext().startActivity(intent);

                    }
                });

                dialogView.findViewById(R.id.twitter).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Uri uri = Uri.parse("https://twitter.com/intent/tweet?text=Check out this Link:&"+"url="+news.get(position).getSrcUrl()); // missing 'http://' will cause crashed
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        holder.itemView.getContext().startActivity(intent);

                    }
                });


                dialogView.findViewById(R.id.facebook).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Uri uri = Uri.parse("https://www.facebook.com/sharer/sharer.php?u="+news.get(position).getSrcUrl()+"&amp;src=sdkpreparse"); // missing 'http://' will cause crashed
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        holder.itemView.getContext().startActivity(intent);

                    }
                });


            }
        });


    }

    @Override
    public int getItemCount() {
        return news.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        CardView newsCard;
        TextView heading;
        TextView source;

        TextView timeElapsed;

        ImageView imageView;

        public ViewHolder(View itemView){
            super(itemView);
            newsCard = itemView.findViewById(R.id.news_card);
            heading = itemView.findViewById(R.id.news_heading);
            source = itemView.findViewById(R.id.source);
            timeElapsed = itemView.findViewById(R.id.timeElapsed);
            imageView = itemView.findViewById((R.id.news_image));

        }
    }
}
