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
int diff_node (json* parent, json* newNode, json* oldNode) {


    if((*oldNode) == (*newNode)){
        return 8;
    }

      if((*oldNode) != (*newNode)){
        return 7;
    }

    // 1. oldNode만 있는 경우 => remove child node
    if ((*newNode) == "undefined" && (*oldNode) != "undefined") {
        return 1;
    }

    // 2. newNode만 있는 경우 => append new child nodee
    if ((*oldNode).type() == json::value_t::null && (*newNode).type() != json::value_t::null) {
        return 2;
    }

    // 2. newNode만 있는 경우 => append new child node
      if ((*newNode) != "undefined" && (*oldNode) == "undefined") {
        return 2;
    }
    
    // 3. oldNode와 newNode 모두 text 타입일 경우
    if ((*oldNode).type() == json::value_t::string && (*newNode).type() == json::value_t::string) {
        if ((*newNode) == (*oldNode)) return 9; //동일한 값이면 udpate x
        return 3;
    }

    // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
    if ((*oldNode)["type"] != (*newNode)["type"]) {
        return 4;
    }

    return 0;
} 

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int diff_tree_node (char* parent, char* newNode, char* oldNode) {

    // 1. oldNode만 있는 경우 => remove child node
    if ((*newNode) == "undefined" && (*oldNode) != "undefined") {
        return 1;
    }

    // 2. newNode만 있는 경우 => append new child nodee
    if ((*oldNode).type() == json::value_t::null && (*newNode).type() != json::value_t::null) {
        return 2;
    }

    // 2. newNode만 있는 경우 => append new child node
      if ((*newNode) != "undefined" && (*oldNode) == "undefined") {
        return 2;
    }
    
    // 3. oldNode와 newNode 모두 text 타입일 경우
    if ((*oldNode).type() == json::value_t::string && (*newNode).type() == json::value_t::string) {
        if ((*newNode) == (*oldNode)) return 9; //동일한 값이면 udpate x
        return 3;
    }

    // 4. oldNode와 newNode의 태그 이름(type)이 다를 경우
    if ((*oldNode)["type"] != (*newNode)["type"]) {
        return 4;
    }

    return 0;
} 



#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
void update_element (json* parent, json* newNode, json* oldNode, int index = 0) {
    int type = diff_node(parent, newNode, oldNode);
    //check_and_update_dom(type, parent, newNode, oldNode, index);
}



#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int get_json_value (char* obj, char* key) {
    //json j_result = obj1.patch(j_patch);
    json j = json::parse(obj);
    return ((*obj) == *obj2);
};

#ifdef __EMSCRIPTEN__
  EMSCRIPTEN_KEEPALIVE
#endif
int diff_json (json* obj1, json* obj2) {
    return (*obj1 == *obj2);
};
//   // diff case
//   // 0 : return false
//   // 1 : remove child node
//   // 2 : append new child node
//   // 3 : text
//   // 4 : different tag
//   // 5 : same tag => attribute diff  
//   // 6 : oldNode와 newNode의 태그 이름(type)이 같을 경우
//   // default: newNode와 oldNode의 모든 자식 태그를 순회하며 반복
//   void check_and_update_dom (int type, char* parent, char* newNode, char* oldNode, int index) {
//     switch (type){
//         case 0: break;
//         case 1: OnAppendChild(parent, parent.childNode[index]); break;
//         case 2: parent.appendChild(createElement(newNode)); break;
//         case 3: parent.replaceChild(
//             createElement(newNode),
//             parent.childNodes[index]
//           ); 
//           break;
//         default: update_childs(parent, newNode, oldNode, index);
//     }
//   }

//   void update_childs (parent, newNode, oldNode, index) {
//     // 5. oldNode와 newNode의 태그 이름(type)이 같을 경우
//     updateAttributes(
//         parent.childNodes[index],
//         newNode.props || {},
//         oldNode.props || {}
//     );
    
//     // 6. newNode와 oldNode의 모든 자식 태그를 순회하며 1 ~ 5의 내용을 반복한다.
//     const maxLength = Math.max(
//         newNode.children.length,
//         oldNode.children.length,
//     );

//     for (let i = 0; i < maxLength; i++) {
//         updateElement(
//             parent.childNodes[index],
//             newNode.children[i],
//             oldNode.children[i],
//             i
//         )
//     }
//   }

#ifdef __cplusplus
}
#endif
