// import { useEffect, useState } from "react";
import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  // const [loadedMeetups, setLoadedMeetups] = useState([]);

  // useEffect(() => {
  //   // send a http request and fetch data
  //   setLoadedMeetups(DUMMY_MEETUPS);
  // }, []);  // getStaticProps()의 사용으로 useState, useEffect가 필요 없어짐

  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a tiny list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </>
  );
}

/* getServerSideProps() */
// 매초 여러번 바뀌는 데이터를 다룰 때 적합
// 서버 측에서 실행됨
// export async function getServerSideProps(context) {
//   const req = context.req; // 요청
//   const res = context.res; // 응답

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//     // getServerSideProps()는 요청이 들어올 때마다 실행되기 때문에 revalidate를 필요로 하지 않는다.
//   };
// }

/* getStaticProps(): 사전 렌더링으로 데이터 가져오기 */
// 페이지 컴포넌트에 데이터를 가져와서 추가해야 될 경우, 페이지 컴포넌트에서 특수 함수 'getStaticProps'를 내보내야 한다. (오직 페이지 컴포넌트에서만 가능, NextJS 전용.)
// 컴포넌트 함수를 호출하기 전에 getStaticProps를 먼저 호출해서 미리 필요한 데이터가 포함된 props를 받아놓음 ==> 데이터를 여기서 미리 받아놓으므로 useEffect, useState가 필요없어짐
// 이렇게 하면 useEffect, useState를 사용해서 데이터를 받아올 때와 달리, 페이지 소스를 봤을 때 데이터 리스트가 비어있지 않고 모두 포함되어있다. => SEO에 더 유리
// getServerSideProps와 달리, 데이터가 바뀌는 경우가 별로 없을 때 사용.
// + 이 함수는 클라이언트 측에서 실행되지 않음. 빌드 타임에 돌아가기 때문에, 여기서 콘솔로그를 실행해도 브라우저 콘솔에는 보이지 않는다. (개발자 서버 터미널에서만 볼 수 있음)
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://publee226:pjbixMCCVJJXyqoN@cluster0.edr8wyf.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, // 점진적 정적 생성, 설정한 숫자만큼 이 페이지를 다시 생성할 때까지 NextJS가 대기함 (초 단위) => 10초마다 페이지를 서버에서 재생성. => 페이지 정보가 10초마다 업데이트됨
  }; // getStaticProps는 항상 '객체'를 반환해야 함
}

export default HomePage;
