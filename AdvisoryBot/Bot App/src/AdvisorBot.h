#pragma once

#include <vector>

#include "OrderBookEntry.h"
#include "OrderBook.h"
#include "Wallet.h"


class AdvisorBot
{
    public:
        AdvisorBot();
        /** Call this to start the sim */
        void init();

        std::string currentTime;
    private: 
        void printMenu();
        void printHelp();
        void enterAsk();
        void enterBid();
        void printWallet();
        void gotoNextTimeframe();
        std::string getUserOption();
        void processUserOption(std::string input);
        double getMinPrice(std::string productPair, OrderBookType orderType, std::string currentTime);
        double getMaxPrice(std::string productPair, OrderBookType orderType, std::string currentTime);
        double getAvgPrice(std::string productPair, OrderBookType orderType, std::string currentTime, int timeSteps);
        double getMovingAverage(std::string productPair, OrderBookType orderType, std::string currentTime, std::string level);
        void resetOrderBook();

    //OrderBook orderBook{"20200317.csv"};
	OrderBook orderBook{"20200601.csv"};
    // OrderBook orderBook{"testData.csv"};
    Wallet wallet;
};
