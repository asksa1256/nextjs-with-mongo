import Head from "next/head";
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        description={props.meetupData.description}
        address={props.meetupData.address}
      />
    </>
  );
}

/* getStaticPaths() */
// 프리 제너레이트 하지 않은 페이지인 ID로 입장하면 404 에러가 뜸
// getStaticPaths()에서 return 배열 내의 paths 배열 내에 객체로 각각 선언한 id의 페이지들은 모두 프리 제너레이트됨.
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://publee226:pjbixMCCVJJXyqoN@cluster0.edr8wyf.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); // _id: 1 => 각 개체마다 _id만 포함하고 나머지는 가져오지 않겠다.

  client.close();

  return {
    fallback: "blocking", // false: 유효하지 않은 페이지는 404 에러 띄움 / true/'blocking': 넥스트js가 따로 페이지를 만듦 (없는 페이지인데 있는 것처럼 대체됨)
    // paths: [
    //   {
    //     params: {
    //       meetupId: "m1",
    //     },
    //   },
    //   {
    //     params: {
    //       meetupId: "m2",
    //     },
    //   },
    // ],
    paths: meetups.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
  };
}

export async function getStaticProps(context) {
  // fetch data for a single meetup
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    "mongodb+srv://publee226:pjbixMCCVJJXyqoN@cluster0.edr8wyf.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
    // 그냥 _id: ObjectId(meetupId)라고 하면 new 없다고 뭐라해서 new Objectid(meetupId)로 수정함
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
      },
    },
  };
}

export default MeetupDetails;
