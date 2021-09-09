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
int diff_dom(const char* old_dom, const char* new_dom){
    json old_dom_json = json::parse(old_dom);
    json new_dom_json = json::parse(new_dom);

    std::cout << old_dom;
    return 0;
//     if(old_dom_json == new_dom_json){
//         return 1;
//     }
//     return 0;
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
