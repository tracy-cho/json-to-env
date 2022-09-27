# json-to-env


json 파일을 env로 변환하기 위한 툴.

json파일은 반드시 아래와 같은 형식을 따라야 한다.


```json5
{
  //공통으로 사용하는 변수
  "common": {  
    "apiVersion": "1.2.2"
  },
  //staging env
  "env": {
    "development": {
      "url": "<dev-url>"
    },
    "production": {
      "url": "<prod-url>"
    }
  }
}


```

## 사용법


```shell

$ jte 
      --importFile <fileName> : 읽어들일 json파일.
                                default는 env.json
      --staging <string>      : default는 development
                                입력받은 파일의 env 내부에서 staging값을 찾아 변환한다.
      --exportFIle <fileName> : 출력할 파일
      --prefix <string>       : env에 붙이길 원하는 prefix

```


## 예시

```shell
$ jte --importFile 'env.json' --prefix "REACT_APP_" --exportFile '.env'
```
### 결과
.env.development
```dotenv
API_VERSION=1.2.2
GENERATE_SORUCEMAP=false
REACT_APP_URL=<dev-url>
```