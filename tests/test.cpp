#include <nlohmann/json.hpp>
#include <curl/curl.h>
#include <iostream>
#include <string>

typedef nlohmann::json json;

class callback {
public:
    json body;
    int code;
};

// Callback function to write response data into a string
size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
    size_t totalSize = size * nmemb;
    userp->append((char*)contents, totalSize);
    return totalSize;
}

callback send_post_request(const std::string& url, const std::string& post_data, const std::string& cookie_data, const std::string& method, bool with_cookie) {
    CURL* curl;
    CURLcode res;
    std::string readBuffer;

    callback result;
    int http_code = 0;

    curl_global_init(CURL_GLOBAL_ALL);
    curl = curl_easy_init();

    if (curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        if (method == "post") {
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, post_data.c_str());
        }
        if (with_cookie) {
            curl_easy_setopt(curl, CURLOPT_COOKIE, cookie_data.c_str());
        }

        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            std::cerr << "curl_easy_perform() failed: " << curl_easy_strerror(res) << "\n";
            result.code = -1;
        } else {
            curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
            result.code = http_code;

            if (http_code == 200) {
                try {
                    result.body = json::parse(readBuffer);
                } catch (json::parse_error& e) {
                    std::cerr << "JSON parse error: " << e.what() << '\n';
                    result.code = -2;
                }
            }
        }

        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }

    curl_global_cleanup();

    return result;
}

int main() {
    callback rc;

    rc = send_post_request("http://localhost:8000/api/register", "{\"username\":\"test\", \"password\":\"pass\"}", "", "post", false);

    if (rc.code == 200) {
        std::cout << "PASS\n";
        std::cout << "Response Body: " << rc.body.dump(4) << "\n";
    } else {
        std::cout << "ERR\n";
        return 0;
    }

    rc = send_post_request("http://localhost:8000/api/login", "{\"username\":\"test\", \"password\":\"pass\"}", "", "post", false);

    if (rc.code == 200) {
        std::cout << "PASS\n";
        std::cout << "Response Body: " << rc.body.dump(4) << "\n";
    } else {
        std::cout << "ERR\n";
        return 0;
    }

    std::string token = rc.body["token"];

    rc = send_post_request("http://localhost:8000/api/images", "", "token="+token, "get", true);

    if (rc.code == 200) {
        std::cout << "PASS\n";
        std::cout << "Response Body: " << rc.body.dump(4) << "\n";
    } else {
        std::cout << "ERR\n";
        return 0;
    }

    return 0;
}
