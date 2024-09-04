import os
from langchain.chat_models import ChatOpenAI
import requests
import json

# os.environ["OPENAI_API_KEY"] = "fastgpt-vwoTAmn8Kp3kpzncZgVQGNw1Z6iPgU5zlku3CBdsFnmpklt0ec9llKCtOb5A"



def post_chat_completions(chat_id, user_id, user_name, message_content, stream=False, detail=True):
    url = 'http://47.121.203.28:3000/api/v1/chat/completions'
    # url = 'http://localhost:3000/api/v1/chat/completions' # local
    headers = {
        'Authorization': 'Bearer fastgpt-xDSIDFJxK4PQ8RWiXZ2CKssy1e4xGjtyLA8nF25YeVyda7VvOShO3eRBNK',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "chatId": chat_id,
        "stream": stream,
        "detail": detail,
        "variables": {
            # 类别超参数，值按照你的文档进行指定
            "category": 'undergraduateCatalog'
        },
        "messages": [
            {
                "content": message_content,
                "role": "user"
            }
        ]
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    return response.json()

# 使用函数示例
chat_id = None
user_id = 'asdfadsfasfd2323'
user_name = '张三'
message_content = '文科生有什么必修课'

response_data = post_chat_completions(chat_id, user_id, user_name, message_content)
print(response_data)