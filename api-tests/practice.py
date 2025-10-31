import api_client
import json
import consts


def test_get_all_product_list():
    # GET /api/productsList
    res = api_client.send_request(method="get",
                                  uri="/api/productsList",
                                  expected_status=200)
    for text in json.loads(res.text)['products']:
        print(text)
    
    print("test_get_all_product_list passed!")

def test_post_to_all_products_list():
    # POST /api/productsList
    res = api_client.send_request(method="post",
                                  uri="/api/productsList",
                                  expected_status=200)
    # 这里，response.status_code = 200；response.text['responseCode'] = 405
    # 也就是说，它返回的还是200，只是在 text 中告诉我应该是 405
    # 这里，我就把 res 打印出来以表明吧。
    print(res.text)

def test_get_all_brands_list():
    # GET /api/brandsList
    res = api_client.send_request(method='get',
                                  uri="/api/brandsList",
                                  expected_status=200)
    
    for text in json.loads(res.text)['brands']:
        print(text)

def test_put_to_all_brands_list():
    # GET /api/brandsList
    res = api_client.send_request(method='put',
                                  uri="/api/brandsList",
                                  expected_status=200)
    
    print(res.text)

# 这2个 test case 太奇怪了，用 post 而不是 get 去 search
'''
def test_post_to_search_product():
    # POST /api/searchProduct
    param = {'category': 'Jeans'}
    res = api_client.send_request(method='post',
                                  params = param,
                                  uri="/api/searchProduct",
                                  expected_status=200)
    
    for text in json.loads(res.text)['products']:
        print(text)
    
    print("test_post_to_search_product passed!")

'''

def test_post_to_verify_login_with_valid_details():
    # POST /api/verifyLogin

    with open(consts.USER_FILE_PATH, "r", encoding="utf-8") as f:
        data_json = json.load(f) 
    
    params = {'email': data_json['userEmail'], 'password': data_json['userName']}
    
    res = api_client.send_request(method="post",
                                  uri="/api/verifyLogin",
                                  data=params,
                                  expected_status=200)
    
    print(res)