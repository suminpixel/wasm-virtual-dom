#include <cstdlib>
#include <cstdint> // for the uint8_t data type
#include <cstring>
#include <iostream>
#include "nlohmann/json.hpp" //json type
#include <chrono>
#include <cstring>
#include <thread>

// If this is an Emscripten (WebAssembly) build then...
#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

using namespace std;
using json = nlohmann::json;

typedef void(*OnAppendChild)(void);

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
uint8_t* create_buffer(int size_needed)
{
    return new uint8_t[size_needed];
}

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

#ifdef __cplusplus
}
#endif
