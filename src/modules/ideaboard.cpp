#include "nlohmann/json.hpp" //json type
#include <cstring>
#include <chrono>
#include <cstdlib>
#include <cstdint> // for the uint8_t data type

#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
  #include <emscripten/val.h>
#endif

#ifdef __cplusplus
extern "C" {
#endif

using namespace std;
using json = nlohmann::json;


// 처음으로 old dom / new dom 의 json tree obj를 stringfy 한 것을 char 로 받음
// json으로 변환
// 변환하여 전역에 보관하고 있음
// diff 수행
// 수행 완료후 전역에 보관하는 dom 제거

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
json* old_dom;

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
json* new_dom;

char* my_dom = "{}";

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
void set_old_dom (char* json_string){
  my_dom = json_string;
  //char pointer to string
  old_dom = json::parse(json_string);
}

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
void get_old_dom(char* return_json_string)
{
  strcpy(return_json_string, my_dom);
}

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int get_number()
{
  return 8;
}


#ifdef __cplusplus
}
#endif
