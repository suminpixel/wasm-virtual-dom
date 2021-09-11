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
int diff_dom(char* old_dom, char* new_dom){
    json old_dom_json = json::parse(old_dom);
    json new_dom_json = json::parse(new_dom);

    return (old_dom_json == new_dom_json);
//     if(old_dom_json == new_dom_json){
//         return 1;
//     }
//     return 0;
}

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int diff_string(char* str, char* str2){
    return (str == str2);
}


#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int console_log(){
    return 1;

}

#ifdef __cplusplus
}
#endif
