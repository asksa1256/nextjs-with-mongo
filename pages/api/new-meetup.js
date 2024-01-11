import { MongoClient } from "mongodb";

// /api/new-meetup
// next.js에서 제공하는 API 라우터 기능.
// 페이지 폴더 내에 'api'라는 폴더를 생성하여 사용한다.
// 서버 측에서 실행되기 때문에 클라이언트 단에서는 코드를 볼 수 없다.

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(
      "mongodb+srv://publee226:pjbixMCCVJJXyqoN@cluster0.edr8wyf.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(data); // 자동으로 생성된 ID를 가진 객체가 됨

    console.log(result);

    client.close();

    res.status(201).json({ message: "Meetup inserted" });
  }
}

export default handler;
