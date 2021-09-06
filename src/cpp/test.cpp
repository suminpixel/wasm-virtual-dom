#include <iostream>
#include <nlohmann/json.hpp>
#include <chrono>

using namespace std;
using json = nlohmann::json;

//clang++ --std=c++14 test.cpp
//./a.out
int main(void){

    // 시작 시간 기록 
    // std::chrono::high_resolution_clock = 나노세컨드 단위 시간 측정 (10억 분의 1초))
    std::chrono::high_resolution_clock::time_point duration_start = 
    std::chrono::high_resolution_clock::now();


    std::string dom_str = "{\"type\":\"ul\",\"props\":{\"class\":\"list\"},\"children\":[{\"type\":\"li\",\"props\":{},\"children\":[\"item 1\"]},{\"type\":\"li\",\"props\":{},\"children\":[\"item 2\"]}]}";
    json dom_json = json::parse(dom_str);

    std::cout << dom_str;
    std::cout << dom_json;

    // 실행 종료 시간  
    std::chrono::high_resolution_clock::time_point duration_end = 
    std::chrono::high_resolution_clock::now();

    // 총 수행 시간  (밀리 초)
    std::chrono::duration<double, std::milli> duration =  (duration_end - duration_start);
    return 0;
};
