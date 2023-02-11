#include <algorithm>
#include <iostream>
#include <vector>
#include <cmath>

#include "AdvisorBot.h"
#include "OrderBookEntry.h"
#include "CSVReader.h"

AdvisorBot::AdvisorBot()
{

}

// Initialisation Function
void AdvisorBot::init()
{
    // Initialising the Current Time, and User Input string
    std::string input;
    currentTime = orderBook.getEarliestTime();

    // Adding 10 BTC to the Wallet 
    wallet.insertCurrency("BTC", 10);
    // Welcome Message
    std::cout << "Greetings, Trader! Welcome to AdvisorBot - the #1 rated money making assistant" << std::endl;
    
    // Loop created to constantly process the user input to prevent "dead-end code".
    while(true)
    {
        printMenu();
        input = getUserOption();
        processUserOption(input);
    }
}

// Menu message
void AdvisorBot::printMenu()
{
    std::cout << "Please enter a command, or 'help' for a list of commands: " << std::endl;
}

// Help Menu
void AdvisorBot::printHelp()
{
    // The menu that the program prints when the user enters "help"
    std::cout << "Commands list: " << std::endl;
    std::cout << "help: Displays a list of all possible commands." << std::endl;
    std::cout << "help cmd: Requests help for a specific command. Valid for min, max, avg and predict." << std::endl;
    std::cout << "prod: Lists all available products." << std::endl;
    std::cout << "min: Finds the minimum bid/ask for product in current time step." << std::endl;
    std::cout << "max: Finds maximum bid or ask for product in current time step." << std::endl;
    std::cout << "avg: Computes average ask or bid for the sent product over the sent number of time steps." << std::endl;
    std::cout << "predict: Predict max or min ask or bid for the sent product for the next time step." << std::endl;
    std::cout << "time: States the current time in dataset i.e. which timeframe we are looking at." << std::endl;
    std::cout << "step: Moves to next step." << std::endl;
    std::cout << "reset: resets timeframe to the initial time on the datasheet." << std::endl;
    std::cout << "bid: creates a bid order." << std::endl;
    std::cout << "ask: creates an ask order." << std::endl;
    std::cout << "wallet: displays wallet contents." << std::endl;
}

// Function that creates an Ask order
void AdvisorBot::enterAsk()
{
    // User input example
    std::cout << "Make an ask - enter the amount: product,price,amount -> ETH/BTC,200,0.5" << std::endl;
    std::string input;
    std::getline(std::cin, input);

    // Tokenise user input
    std::vector<std::string> tokens = CSVReader::tokenise(input, ',');

    // Ensure correct amount of tokens
    if (tokens.size() != 3)
    {
        std::cout << "AdvisorBot::enterAsk Bad input! " << input << std::endl;
    }
    else {
        // Try to create OrderBookEntry
        try {
            OrderBookEntry obe = CSVReader::stringsToOBE(
                tokens[1],
                tokens[2], 
                currentTime, 
                tokens[0], 
                OrderBookType::ask 
            );
            obe.username = "simuser";
            // Check feasibility of order
            if (wallet.canFulfillOrder(obe))
            {
                std::cout << "Wallet looks good. " << std::endl;
                orderBook.insertOrder(obe);
            }
            else {
                std::cout << "Wallet has insufficient funds . " << std::endl;
            }
        }catch (const std::exception& e)
        {
            std::cout << " AdvisorBot::enterAsk Bad input " << std::endl;
        }   
    }
}

// Function that creates a Bid order
void AdvisorBot::enterBid()
{
    // User input entry and example
    std::cout << "Make an bid - enter the amount: product,price,amount -> ETH/BTC,200,0.5" << std::endl;
    std::string input;
    std::getline(std::cin, input);

    // Tokenise input
    std::vector<std::string> tokens = CSVReader::tokenise(input, ',');

    // Check for correct number of tokens
    if (tokens.size() != 3)
    {
        std::cout << "AdvisorBot::enterBid Bad input! " << input << std::endl;
    }
    else {
        try {
            // Try to create OrderBookEntry
            OrderBookEntry obe = CSVReader::stringsToOBE(
                tokens[1],
                tokens[2], 
                currentTime, 
                tokens[0], 
                OrderBookType::bid 
            );
            obe.username = "simuser";

            // Check feasibility of order
            if (wallet.canFulfillOrder(obe))
            {
                std::cout << "Wallet looks good. " << std::endl;
                orderBook.insertOrder(obe);
            }
            else {
                std::cout << "Wallet has insufficient funds . " << std::endl;
            }
        }catch (const std::exception& e)
        {
            std::cout << " AdvisorBot::enterBid Bad input " << std::endl;
        }   
    }
}

// Display content of wallet
void AdvisorBot::printWallet()
{
    std::cout << wallet.toString() << std::endl;
}

// Proceeds to the following Timeframe as well as Processes orders
void AdvisorBot::gotoNextTimeframe()
{
    // Check that there is another timeframe to go to
    if (orderBook.getNextTime(currentTime) == "")
    {
        std::cout << "End of data reached" << std::endl;
    }
    else 
    {
        std::cout << "Going to next timeframe.." << std::endl;
        // Parsing over all known products to match asks and bids
        for (std::string p : orderBook.getKnownProducts())
        {
            std::cout << "matching " << p << std::endl;
            std::vector<OrderBookEntry> sales =  orderBook.matchAsksToBids(p, currentTime);
            std::cout << "Sales: " << sales.size() << std::endl;
            for (OrderBookEntry& sale : sales)
            {
                std::cout << "Sale price: " << sale.price << " amount " << sale.amount << std::endl; 
                if (sale.username == "simuser")
                {
                    // Update the wallet
                    wallet.processSale(sale);
                }
            }
        }
        // Going to next timeframe
        currentTime = orderBook.getNextTime(currentTime);
        std::cout << "Current Timeframe is: " << currentTime << std::endl;
    }
    //Going to next timeframe
    currentTime = orderBook.getNextTime(currentTime);
}
 
// Getting user input
std::string AdvisorBot::getUserOption()
{
    std::string input;
    std::getline(std::cin, input);
    std::cout << "You chose: " << input << std::endl;
    return input;
}

// Processing User Input
void AdvisorBot::processUserOption(std::string input)
{
    // Initialising all needed variables
    std::vector<std::string> tokens;
    std::string currPair;
    OrderBookType orderType;

    // List of all known products
    std::vector<std::string> prodVec = orderBook.getKnownProducts();

    int timesteps;

    double min;
    double max;
    double avg;
    double movingAverage;
    std::string level;

    //Setting tokenising character (space)
    tokens = CSVReader::tokenise(input, ' ');

    // If there is one token...
    if (tokens.size() == 1)
    {
        // If statement to navigate all single token options
        if (tokens[0] == "help" || tokens[0] == "Help")
        {
            printHelp();
        }
        else if (tokens[0] == "prod" || tokens[0] == "Prod")
        {
            std::string prodList = "";
            // Creating a list of all know products
            for (std::string const& p : orderBook.getKnownProducts())
            {
                prodList += p + " ";
            }
            std::cout << "Below is a list of all the available currency pairs: " << std::endl;
            std::cout << prodList << std::endl;
        }
        else if (tokens[0] == "time" || tokens[0] == "Time")
        {
            // Display current time
            std::cout << "Current Timeframe is: " << currentTime << std::endl;
        }
        else if (tokens[0] == "step" || tokens[0] == "Step")
        {
            // Going to next timeframe
            AdvisorBot::gotoNextTimeframe();
        }
        else if (tokens[0] == "reset" || tokens[0] == "Reset")
        {
            // Resetting current timeframe
            std::cout << "Resetting the timeframe." << std::endl;
            AdvisorBot::resetOrderBook();
        }
        else if (tokens[0] == "bid")
        {
            // Calling bid function
            AdvisorBot::enterBid();
        }
        else if (tokens[0] == "ask")
        {
            // Calling ask function
            AdvisorBot::enterAsk();
        }
        else if (tokens[0] == "wallet")
        {
            // Calling wallet function
            AdvisorBot::printWallet();
        }
        // If invalid input, print error
        else
        {
            std::cout << "Invalid input" << std::endl;
        }
    }
    // If there are two tokens...
    else if (tokens.size() == 2)
    {
        // If the user requests help with any specific command, we display an example of the command
        if (tokens[0] == "help")
        {
            if (tokens[1] == "min" || tokens[1] == "Min")
            {
                std::cout << "Example: min ETH/BTC ask  -> The min ask for ETH/BTC is 1.0" << std::endl;
            }
            else if (tokens[1] == "max" || tokens[1] == "Max")
            {
                std::cout << "Example: max ETH/BTC ask  -> The max ask for ETH/BTC is 1.0" << std::endl;
            }
            else if (tokens[1] == "avg" || tokens[1] == "Avg")
            {
                std::cout << "Example: avg ETH/BTC ask 10  -> The average ETH/BTC ask price over the last 10 timesteps was 1.0" << std::endl;
            }
            else if (tokens[1] == "predict" || tokens[1] == "Predict")
            {
                std::cout << "Example: predict max ETH/BTC bid  -> The average ETH/BTC ask price over the last 10 timesteps was 1.0" << std::endl;
            }
            else if (tokens[1] == "bid" || tokens[1] == "Bid")
            {
                std::cout << "Example: bid BTC/ETH 1 10." << std::endl;
            }
            else if (tokens[1] == "ask" || tokens[1] == "Ask")
            {
                std::cout << "Example: ask ETH/BTC 10 1." << std::endl;
            }
            else {
                std::cout << "Invalid input " << std::endl;
            }  
        }
        else {
            std::cout << "Invalid input " << std::endl;
        }
    }
    // If there are three tokens...
    else if (tokens.size() == 3)
    {
        if (tokens[0] == "min" || tokens[0] == "Min")
        {
            // Checking that all tokens are valid inputs
            if (std::find(prodVec.begin(), prodVec.end(), tokens[1]) != prodVec.end() && OrderBookEntry::stringToOrderBookType(tokens[2]) != OrderBookType::unknown)
            {
                currPair = tokens[1];
                // Creating orderbook type
                orderType = OrderBookEntry::stringToOrderBookType(tokens[2]);
                // Getting minimum price for given currency pair in current timeframe
                double min = AdvisorBot::getMinPrice(currPair, orderType, currentTime);
                std::cout << "The Min price for pair: " << currPair << " in timeframe: " << currentTime << " is: " << min << std::endl;
            }
            // If inputs are not valid
            else {
                std::cout << "Invalid Currency Pair or Order Type. Example: min ETH/BTC ask" << std::endl;
            }
        }
        else if (tokens[0] == "max" || tokens[0] == "Max")
        {
            // Checking that all inputs are valid
            if (std::find(prodVec.begin(), prodVec.end(), tokens[1]) != prodVec.end() && OrderBookEntry::stringToOrderBookType(tokens[2]) != OrderBookType::unknown)
            {
                currPair = tokens[1];
                // Creating orderbook type
                orderType = OrderBookEntry::stringToOrderBookType(tokens[2]);
                // Getting maximum price for given currency pair in current timeframe
                double max = AdvisorBot::getMaxPrice(currPair, orderType, currentTime);
                std::cout << "The Max price for pair: " << currPair << " in timeframe: " << currentTime << " is: " << max << std::endl;
            }
            // If inputs are not valid
            else {
                std::cout << "Invalid Currency Pair or Order Type. Example: max ETH/BTC bid" << std::endl;
            }
        }
        // If inputs don't match 3 tokens inputs
        else {
            std::cout << "Invalid Entry" << std::endl;
        }

    }
    // If there are 4 tokens...
    else if (tokens.size() == 4)
    {
        if (tokens[0] == "avg" || tokens[0] == "Avg")
        {
            // Checking that all inputs are valid
            if (std::find(prodVec.begin(), prodVec.end(), tokens[1]) != prodVec.end() && OrderBookEntry::stringToOrderBookType(tokens[2]) != OrderBookType::unknown)
            {
                currPair = tokens[1];
                // Creating orderbook type
                orderType = OrderBookEntry::stringToOrderBookType(tokens[2]);
                // Getting amount of timesteps to take
                timesteps = std::stoi(tokens[3]);
                // Calculating average over given timesteps
                avg = AdvisorBot::getAvgPrice(currPair, orderType, currentTime, timesteps);
                std::cout << "The average price " << currPair << " for the last " << timesteps << " timesteps is " << avg << std::endl;

            }
            else {
                std::cout << "Invalid Currency Pair or Order Type. Example: avg ETH/BTC ask 10" << std::endl;
            }
        }
        else if (tokens[0] == "predict" || tokens[0] == "Predict")
        {
            // Checking what type of prediction
            if (tokens[1] == "min" || tokens[1] == "Min" || tokens[1] == "max" || tokens[1] == "Max" || tokens[1] == "avg" || tokens[1] == "Avg")
            {
                // Checking that all inputs are valid
                if (std::find(prodVec.begin(), prodVec.end(), tokens[2]) != prodVec.end() && OrderBookEntry::stringToOrderBookType(tokens[3]) != OrderBookType::unknown)
                {
                    level = tokens[1];
                    currPair = tokens[2];
                    // Creating orderbook type
                    orderType = OrderBookEntry::stringToOrderBookType(tokens[3]);
                    // Calculating moving average
                    movingAverage = AdvisorBot::getMovingAverage(currPair, orderType, currentTime, level);
                    std::cout << "The predicted " << tokens[1] << " for " << currPair << " is " << movingAverage << std::endl;
                }
                else {
                    std::cout << "Invalid Curreny Pair or Order Type. Example: predict max ETH/BTC bid" << std::endl;
                }
            }
            else {
                std::cout << "Invalid Prediciton Degree (Min, Max or Avg). Example: predict max ETH/BTC bid" << std::endl;
            }
        }
    }
    else {
        std::cout << "Please check input and try again.." << std::endl;
    }
}

// Function to calculate minimum price
double AdvisorBot::getMinPrice(std::string productPair, OrderBookType orderType, std::string currentTime)
{
    // Getting specified list of orders
    std::vector<OrderBookEntry> entries = orderBook.getOrders(orderType, productPair, currentTime);
    // Setting initial minimum
    double min = entries[0].price;
    // Iterating over entries to find smallest
    for (OrderBookEntry& e : entries)
    {
        if (e.price < min)
        {
            min = e.price;
        }
    }
    return min;
}

// Function to calculate maximum price
double AdvisorBot::getMaxPrice(std::string productPair, OrderBookType orderType, std::string currentTime)
{
    // Getting specified group of orders
    std::vector<OrderBookEntry> entries = orderBook.getOrders(orderType, productPair, currentTime);
    // Setting initial maximum order
    double max = entries[0].price;
    // Iterating over entries to find biggest
    for (OrderBookEntry& e : entries)
    {
        if (e.price > max)
        {
            max = e.price;
        }
    }
    return max;
}

// Function to calculate average price
double AdvisorBot::getAvgPrice(std::string productPair, OrderBookType orderType, std::string currentTime, int timeSteps)
{
    std::vector<double> avgPrices;
    double avgPrice = 0;
    double sumPrices = 0;
    double counter = 0;
    std::string initialTime = currentTime;

    // Iterating over necessary timesteps
    for (int i = 0; i < timeSteps; i++)
    {
        // Creating specified group of orders
        std::vector<OrderBookEntry> entries = orderBook.getOrders(orderType, productPair, initialTime);
        // Calculating list of prices for sum total
        for (OrderBookEntry& e : entries)
        {
            avgPrices.push_back(e.price);
            counter += 1;
        }
        initialTime = orderBook.getNextTime(initialTime);
    }
    // Calculating sum total
    for (int i = 0; i < avgPrices.size(); i++)
    {
        sumPrices += avgPrices[i];
    }
    // Calculating average
    avgPrice = sumPrices/counter;
    return avgPrice;
}

// Function to calculate moving average
double AdvisorBot::getMovingAverage(std::string productPair, OrderBookType orderType, std::string currentTime, std::string level)
{
    std::string nextTime = orderBook.getNextTime(currentTime);
    std::string initialTime = orderBook.getEarliestTime();
    std::vector<double> avgPrices;

    double min = 0;
    double max = 0;
    double sumPrices = 0;
    double counter = 0;
    double movingAverage;

    // Checking that we havent completed iteration over timeframes
    while (initialTime != nextTime)
    {
        // Getting group of orders
        std::vector<OrderBookEntry> entries = orderBook.getOrders(orderType, productPair, initialTime);
        // Checking type of moving average (min, max or avg)
        if (level == "avg" || level == "Avg")
        {
            // Collecting avg prices
            for (OrderBookEntry& e : entries)
            {
                avgPrices.push_back(e.price);
                counter += 1;
            }
            // Next timeframe
            initialTime = orderBook.getNextTime(initialTime);
        }
        else if (level == "min" || level == "Min")
        {
            // Calculating min price
            double min = AdvisorBot::getMinPrice(productPair, orderType, initialTime);
            // Adding it to the list
            avgPrices.push_back(min);
            // Next timeframe
            initialTime = orderBook.getNextTime(initialTime);
            counter += 1;
        }
        else if (level == "max" || level == "Max")
        {
            // Calculating max price
            double max = AdvisorBot::getMaxPrice(productPair, orderType, initialTime);
            // Adding it to the list
            avgPrices.push_back(max);
            // next timeframe
            initialTime = orderBook.getNextTime(initialTime);
            counter += 1;
        }
    }
    for (int i = 0; i < avgPrices.size(); i++)
    {
        // Calculating sum price
        sumPrices += avgPrices[i];
    }
    // Calculating moving average
    movingAverage = sumPrices/counter;
    return movingAverage;
}

// Function to reset orderbook
void AdvisorBot::resetOrderBook()
{
    // Getting earliest time
    std::string firstTime = orderBook.getEarliestTime();
    // Setting the time
    currentTime = firstTime;
    // Displaying the time
    std::cout << "Current time is:  " << currentTime << std::endl;
}