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


// (O) 처음으로 old dom / new dom 의 json tree obj를 stringfy 한 것을 pointer 로 받음
// (O) json으로 변환
// (O) 변환하여 전역에 보관하고 있음
// diff 수행
// root element 포인터화
// 수행 완료후 전역에 보관하는 dom 제거

json old_dom;
json new_dom;

typedef void(*OnActiveJsFunc)(void);

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
void init_dom (char* old_pointer, char* new_pointer){ 
  old_dom = json::parse(old_pointer);
  new_dom = json::parse(new_pointer);
}

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
void get_old_dom(char* return_json_string)
{
  string s = old_dom.dump();
  strncpy(return_json_string, s.c_str(), s.size());
}

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int diff_dom()
{
    // 1. oldNode만 있는 경우 => remove child node
    if (old_dom.type() != json::value_t::null && new_dom.type() == json::value_t::null) {
        return 1;
    }

    // 2. newNode만 있는 경우 => append new child node
      if (old_dom.type() == json::value_t::null && new_dom.type() != json::value_t::null) {
        return 2;
    }
    
    // 3. oldNode와 newNode 모두 text 타입일 경우
    if (old_dom.type() == json::value_t::string && new_dom.type() == json::value_t::string) {
        if (old_dom == new_dom) return 9; //동일한 값이면 udpate x
        return 3;
    }

    // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
    if (new_dom["type"] != old_dom["type"]) {
        return 4;
    }

    return 0;
}

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int diff_node(json parent, json old_node, json new_node)
{
    // 1. oldNode만 있는 경우 => remove child node
    if (old_node.type() != json::value_t::null && new_node.type() == json::value_t::null) {
        return 1;
    }

    // 2. newNode만 있는 경우 => append new child node
      if (old_node.type() == json::value_t::null && new_node.type() != json::value_t::null) {
        return 2;
    }
    
    // 3. oldNode와 newNode 모두 text 타입일 경우
    if (old_node.type() == json::value_t::string && new_node.type() == json::value_t::string) {
        if (old_node == new_node) return 9; //동일한 값이면 udpate x
        return 3;
    }

    // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
    if (old_node["type"] != new_node["type"]) {
        return 4;
    }

    return 0;
}


//For Test
#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int diff_all_dom()
{
  return (new_dom == old_dom);
}

//For Test
#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
void append_text_to_dom(OnActiveJsFunc ActiveJsFunc)
{
    ActiveJsFunc();
}


#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
void get_dom(char* return_pointer)
{
  string o = old_dom.dump();
  string n = new_dom.dump();

  strncpy(return_pointer, o.c_str(), o.size());
}


#ifdef __cplusplus
}
#endif
