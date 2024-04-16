package com.example.stocks;

import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class watchlistViewAdapter extends RecyclerView.Adapter<watchlistViewAdapter.ViewHolder>{
    private ArrayList<watchlist> watchlists = new ArrayList<>();

    public void setWatchlists(ArrayList<watchlist> watchlists) {
        this.watchlists = watchlists;
        notifyDataSetChanged();
    }

    public watchlistViewAdapter() {
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.watch_list_item, parent, false);
        ViewHolder holder=new ViewHolder(view);
        return holder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        holder.symbol.setText(watchlists.get(position).getSymbol());
        holder.companyName.setText(watchlists.get(position).getCompany_name());
        holder.current_price.setText(String.format("$%.2f",watchlists.get(position).getCurrent_price()));
        double changePrice = watchlists.get(position).getChange();
        double changePercent =  watchlists.get(position).getChange_percent();
        if(changePrice<0){
            Drawable drawable = ContextCompat.getDrawable(holder.itemView.getContext(), R.drawable.trending_down);
// Set the desired color
            assert drawable != null;
            drawable.setTint(ContextCompat.getColor(holder.itemView.getContext(), R.color.red));

            holder.imageView.setImageDrawable(drawable);

//            holder.imageView.setImageResource(R.drawable.trending_down);
//            holder.imageView.setColorFilter(R.color.red);
            holder.change.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.red));
            holder.changePercent.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.red));
        }
        else if(changePrice>0){
            Drawable drawable = ContextCompat.getDrawable(holder.itemView.getContext(), R.drawable.trending_up);
// Set the desired color
            assert drawable != null;
            drawable.setTint(ContextCompat.getColor(holder.itemView.getContext(), R.color.green));

            holder.imageView.setImageDrawable(drawable);
            holder.change.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.green));
            holder.changePercent.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.green));
        }
        holder.change.setText(String.format("$%.2f",changePrice));
        holder.changePercent.setText(String.format("(%.2f%%)",changePercent));

    }

    @Override
    public int getItemCount() {
        return watchlists.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        private TextView symbol;
        private TextView companyName;
        private TextView current_price;
        private TextView change;
        private TextView changePercent;
        private ImageView imageView;
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            symbol=itemView.findViewById(R.id.watchlist_token_name);
            companyName=itemView.findViewById(R.id.watchlist_companyName);
            current_price=itemView.findViewById(R.id.watchlist_current_price);
            change=itemView.findViewById(R.id.watchlist_change_price);
            changePercent=itemView.findViewById(R.id.watchlist_change_price_percent);
            imageView=itemView.findViewById(R.id.imageView);
        }
    }
}
