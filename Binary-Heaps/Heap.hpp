#ifndef HEAP_HPP
#define HEAP_HPP

#include <vector>

unsigned int parent(unsigned int);
unsigned int left(unsigned int);
unsigned int right(unsigned int);

class Heap {
public: // for cppunit testing purposes
    std::vector<int> array; //array where the heap is stored
    unsigned int heap_size; //the size of the heap
public:
    Heap(unsigned int);
    Heap(bool = false);
    std::vector<int> getNumbers();
    void insert(int);
    int maximum();
    void maxHeapify(int);
    void buildMaxHeap();
    int extractMax();
    std::vector<int> sort();
    void showHeap();
    int getLargestChild(int);
    void selectMaxHeapify(int, int);
};

#endif
