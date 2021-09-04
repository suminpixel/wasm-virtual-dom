#include <iostream>
#include <nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;

//clang++ --std=c++14 test.cpp
//./a.out
int main(void){

    std::string dom_str = "{\"type\":\"ul\",\"props\":{\"class\":\"list\"},\"children\":[{\"type\":\"li\",\"props\":{},\"children\":[\"item 1\"]},{\"type\":\"li\",\"props\":{},\"children\":[\"item 2\"]}]}";
    json dom_json = json::parse(dom_str);

    std::cout << dom_str;
    std::cout << dom_json;
    return 0;
};
