const { default: mongoose } = require("mongoose");

const reqString = {
    type: String,
    require: true,
};

const reqDate = {
    type: Date,
    require: true,
};

const AuctionsSchema = new mongoose.Schema({
    Vehicle_Id: String,
    Auction_Type: String,
    Product_Description: String,
    Currency: String,
    Auction_Opening_Price: String,
    Current_Bid: String,
    Set_Reserve_Price: String,
    Set_Incremental_Price: String,
    First_Best_Offer: String,
    Second_Best_Offer: String,
    Third_Best_Offer: String,
    Auction_Start_Date: reqDate,
    Auction_Start_Time: String,
    Total_Bidding_Duration: String,
    Allow_Auto_Bidding: String,
    Stop_Auto_Bidding_Condition: String,
    Allow_Negotiation: String,
    Negotiation_Duration: String,
    Negotiation_Mode: String,
    Allow_Auction_Sniping: String,
    Incremental_Time: String,
    Edit_After_Auction: String,
    Vehicle_Title: String,
    Bids: Array
});

const Auction = mongoose.model("auctions", AuctionsSchema);
module.exports = Auction;