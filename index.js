const axios = require('axios');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv').config();
const NAVER_ID = process.env.NAVER_ID; //env = 환경 변수
const NAVER_SECRET_ID = process.env.NAVER_SECRET_ID;

app.set('port', process.env.PORT || 8099);
const port = app.get('port');
app.use(morgan('dev'));
app.use(cors());

//포스트로 받을때는 요 두줄을 무조건 써야한다 (로그인 아이디 패스워드의 경우 무조건 포스트로 쓴다)
//포스트로 넘긴 데이터는 무조건 바디로 받는다
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log(port);
app.get('/', (req, res) => {
  res.send('hello express');
});
app.post('/papago', (req, res) => {
  //클라이언트에서 포스트를 받을때는 포스트로 넘겨줘야함
  console.log(req.body.txt); //포스트로 보낸거는 req.body 로 받아야함
  const txt = req.body.txt;
  const language = req.body.language;
  axios({
    url: 'https://openapi.naver.com/v1/papago/n2mt',
    method: 'POST', //페치 딜리트 풋 포스트 .. 디폴트는 겟
    params: {
      source: 'ko',
      target: language,
      text: txt, //post로 보낸 데이터는 바디의 텍스트로 넘겨준다.
    },
    headers: {
      'X-Naver-Client-Id': NAVER_ID,
      'X-Naver-Client-Secret': NAVER_SECRET_ID,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  })
    .then((response) => {
      console.log(response.data);
      res.json({ result: response.data.message.result.translatedText });
    })
    .catch((error) => {
      //console.log(error); //테스트용 이런식으로 쓰는건 보안상 위험하다
      //bad req  [ ]
      console.log(error);
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`${port}에서 서버 대기중`);
});
