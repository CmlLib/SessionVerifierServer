HTTP 환경에서는 startlogin, verifysecret 과정 필요

HTTPS 환경에서는 바로 verifysession 해도 문제 없을 것으로 예상

Server 클래스의 serverId, serverKey 같은것만 직렬화 잘 해서 보관하면 완벽한 stateless 서버가 만들어질것같음