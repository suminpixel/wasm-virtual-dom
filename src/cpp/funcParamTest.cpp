#include <cstdlib>
#include <cstdint> // for the uint8_t data type
#include <cstring>

#ifdef __EMSCRIPTEN__
  #include <emscripten.h>
#endif

#ifdef __cplusplus
extern "C" { // So that the C++ compiler does not rename our function names
#endif
 
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
void act_js_func(OnActiveJsFunc ActiveJsFunc)
{
    ActiveJsFunc();
}

#ifdef __cplusplus
}
#endif