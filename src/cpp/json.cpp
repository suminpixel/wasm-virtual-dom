#include <iostream>
#include "nlohmann/json.hpp"
#include <chrono>

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

#ifdef __cplusplus
}
#endif
