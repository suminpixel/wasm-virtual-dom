#include <iostream>
#include "nlohmann/json.hpp"
#include <chrono>
#include <cstring>
#include <thread>

//clang++ --std=c++14 src/cpp/test.cpp
//./a.out

#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

using namespace std;
using json = nlohmann::json;

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
uint8_t* create_buffer(int size_needed)
{
  return new uint8_t[size_needed];
}

// Release the memory
#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
void free_buffer(const char* pointer)
{
  delete pointer;
}

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int diff(char* value1, char* value2){

    json parsedValue1 = json::parse(value1);
    json parsedValue2 = json::parse(value2);

    return (parsedValue1 == parsedValue2);
}

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
void long_operation()
{
    /* Simulating a long, heavy operation. */
    this_thread::sleep_for(100ms);
}


#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
double diff_time(char* value1, char* value2, int times = 0){

    // 시작 시간 기록 
    // std::chrono::high_resolution_clock = 나노세컨드 단위 시간 측정 (10억 분의 1초))
    std::chrono::high_resolution_clock::time_point duration_start = 
    std::chrono::high_resolution_clock::now();
    
    int value = 0;
    for(int i = 0; i < 10000; ++i){
        json parsedValue1 = json::parse(value1);
        json parsedValue2 = json::parse(value2);

        int isDiff = (parsedValue1 == parsedValue2);
        value = value + i;
    }
    
    long_operation();
    
    // 실행 종료 시간  
    std::chrono::high_resolution_clock::time_point duration_end = 
    std::chrono::high_resolution_clock::now();

    // 총 수행 시간  (밀리 초)
    std::chrono::duration<double, std::milli> duration =  (duration_end - duration_start);
    //const char * time = duration.count();
    //std::strcpy(time_pointer, time);

    return duration.count();
}

#ifdef __cplusplus
}
#endif
