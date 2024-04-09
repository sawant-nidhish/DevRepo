package com.example.stocks;



import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;

import java.util.ArrayList;
import java.util.Arrays;

//import androidx.
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

public class portfolioAdapter extends RecyclerView.Adapter<portfolioAdapter.PortfolioItemViewHolder>{

    private ArrayList<PortfolioModel> portfolioList= new ArrayList<>();
    public portfolioAdapter() {
    }

    @NonNull
    @Override
    public PortfolioItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.portfolio_list_item, parent, false);
        PortfolioItemViewHolder holder = new PortfolioItemViewHolder(view);
        return holder;
    }

    @Override
    public void onBindViewHolder(@NonNull PortfolioItemViewHolder holder, int position) {
        Log.d("Set Token",portfolioList.get(position).getTokenName());
        holder.tokenName.setText(portfolioList.get(position).getTokenName());
        holder.numShares.setText(Integer.toString(portfolioList.get(position).getNumShares()));

        holder.totalCost.setText("$"+Integer.toString(portfolioList.get(position).getTotalCost()));
        float changePrice = (portfolioList.get(position).getLatestPrice()-portfolioList.get(position).getAvgPrice())*portfolioList.get(position).getNumShares();
        float changePercent = (changePrice/portfolioList.get(position).getTotalCost())*100;
        if(changePrice<0){
            Drawable drawable = ContextCompat.getDrawable(holder.itemView.getContext(), R.drawable.trending_down);
// Set the desired color
            assert drawable != null;
            drawable.setTint(ContextCompat.getColor(holder.itemView.getContext(), R.color.red));

            holder.imageView.setImageDrawable(drawable);

//            holder.imageView.setImageResource(R.drawable.trending_down);
//            holder.imageView.setColorFilter(R.color.red);
            holder.changePrice.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.red));
            holder.changePricePercent.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.red));
        }
        else if(changePrice>0){
            Drawable drawable = ContextCompat.getDrawable(holder.itemView.getContext(), R.drawable.trending_up);
// Set the desired color
            assert drawable != null;
            drawable.setTint(ContextCompat.getColor(holder.itemView.getContext(), R.color.green));

            holder.imageView.setImageDrawable(drawable);
            holder.changePrice.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.green));
            holder.changePricePercent.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.green));
        }
        holder.changePrice.setText(String.format("$%.2f",changePrice));
        holder.changePricePercent.setText(String.format("(%.2f%%)",changePercent));

    }

    @Override
    public int getItemCount() {
        return portfolioList.size();
    }

    public void setPortfolioList(ArrayList<PortfolioModel> portfolioList) {
        this.portfolioList = portfolioList;
        notifyDataSetChanged();
    }
    //    private ArrayList<String> items = new ArrayList<>(Arrays.asList("First", "Second", "Third"));

    public class PortfolioItemViewHolder extends RecyclerView.ViewHolder {

        private TextView tokenName;
        private TextView numShares;
        private  TextView totalCost;
        private  TextView changePrice;
        private  TextView changePricePercent;

        private ImageView imageView;
        public PortfolioItemViewHolder(@NonNull View itemView) {
            super(itemView);
            tokenName=itemView.findViewById(R.id.portfolio_token_name);
            numShares=itemView.findViewById(R.id.portfolio_numShares);
            totalCost=itemView.findViewById(R.id.portfolio_total_cost);
            changePrice=itemView.findViewById(R.id.portfolio_change_price);
            changePricePercent=itemView.findViewById(R.id.portfolio_change_price_percent);
            imageView = itemView.findViewById(R.id.imageView);

        }
    }
}
