#include "Heap.hpp"
#include <iostream>
#include <cmath>
#include <string>
#include <vector>
#include <sstream>
#include <iterator>

unsigned int parent(unsigned int i) {
    return floor(i/2);
}

unsigned int left(unsigned int i) {
    return 2*i + 1;
}

unsigned int right(unsigned int i) {
    return 2*i + 2;
}

Heap::Heap(unsigned int len) {
    array.resize(len);
    heap_size = len;
    // std::cout << "New heap created of length: " << array.size() << std::endl;
}

Heap::Heap(bool incremental) {
    // array.resize(source.size());
    std::vector<int> source = getNumbers();

    heap_size = 0;

    if (incremental) {
        for (int i = 0; i < source.size(); i++) {
            // std::cout << "Inserting: " << source[i] << std::endl;
            insert(source[i]);
            // std::cout << "Inserted: " << source[i] << std::endl;
        }
    } else {

    }
}

std::vector<int> Heap::getNumbers(){
    std::string myString;
    std::cout << "Please enter numbers to sort (e.g. '5 4 3 2 10'): " << std::endl;
    std::getline(std::cin, myString);

    std::stringstream lineStream(myString);
    std::vector<int> myVec(std::istream_iterator<int>(lineStream),{});

    return myVec;
}

void Heap::insert(int k) {
    unsigned int pos = heap_size;
    array.push_back(k);
    heap_size = heap_size + 1;
    while(pos > 0 && array[parent(pos)] < array[pos]) {
        // std::cout << "Swapping " << array[parent(pos)] << " and " << array[pos] << std::endl;
        std::swap(array[parent(pos)], array[pos]);
        pos = parent(pos);
        // std::cout << "Pos: " << array[pos] << " parent(pos): " << array[parent(pos)] << std::endl;
    }
    // std::cout << "Heap size: " << heap_size << std::endl;
}

int Heap::maximum() {
    int max = array[0];
    return max;
}

void Heap::maxHeapify(int i) {
    int largest = getLargestChild(i);
    if (largest != i) {
        std::swap(array[largest], array[i]);
        maxHeapify((int)largest);
    }

}

void Heap::buildMaxHeap() {
    for (int j = heap_size/2; j >= 0; j--) {
        maxHeapify(j);
    }
}

int Heap::extractMax() {
    int max = array[0];
    std::swap(array[0], array[heap_size-1]);
    array.pop_back();
    heap_size = heap_size - 1;
    maxHeapify(0);
    return max;
}

std::vector<int> Heap::sort() {
    buildMaxHeap();
    int size = array.size();
    for (int i = array.size() - 1; i > 0; i--) {
        std::swap(array[0], array[i]);
        size--;
        selectMaxHeapify(0, size);
    }
    return array;
}

void Heap::selectMaxHeapify(int i, int end) {
    int largest, lChild = (2*i) + 1, rChild = lChild + 1;
    if(lChild < end && array[lChild] > array[i])
        largest = lChild;
    else
        largest = i;

    if(rChild < end && array[rChild] > array[largest])
        largest = rChild;

    if(largest != i)
    {
        std::swap(array[i], array[largest]);
        selectMaxHeapify(largest, end);
    }
}

void Heap::showHeap() {

    std::cout << "Current Heap: "<< std::endl;
    for (int i = 0; i < array.size(); i++) {
        std::cout << array[i] << ' ';
    }
    std::cout << std::endl;
}

int Heap::getLargestChild(int i) {
    int largest, lChild = (2*i) + 1, rChild = lChild + 1;
    int end = array.size();
    
    if(lChild < end && array[lChild] > array[i])
        largest = lChild;
    else
        largest = i;

    if(rChild < end && array[rChild] > array[largest])
        largest = rChild;
    return largest;
}