#include "Heap.hpp"
#include <iostream>
#include <cmath>

int main()
{
    // std::vector<int> testArray = {3, 54, 67, 25, 65, 24};
    Heap heap2(true);
    heap2.showHeap();

    heap2.sort();
    heap2.showHeap();

    return 0;
}