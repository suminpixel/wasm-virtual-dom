#include <iostream>
#include "nlohmann/json.hpp"
#include <chrono>

using namespace std;
using json = nlohmann::json;

//clang++ --std=c++14 test.cpp
//./a.out
int diff_node(std::string old, std::string target){

    json old_dom = json::parse(old);
    json new_dom = json::parse(target);

    old_dom.patch(json::diff(old_dom, new_dom)) == target;
}

int main(){
 
}


//TODO
//