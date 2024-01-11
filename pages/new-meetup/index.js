import Head from "next/head";
import { useRouter } from "next/router";
import NewMeetUpForm from "../../components/meetups/NewMeetupForm";

function NewMeetUpPage() {
  const router = useRouter();

  async function addMeetupHandler(enteredMeetupdata) {
    const response = await fetch("/api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredMeetupdata),
      headers: {
        "Content-Type": "application/json",
      },
    }); // api 폴더의 new-meetup.js로 요청 전달됨 -> function 'handler' trigger

    const data = await response.json();

    console.log(data);

    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Add a New Meetup</title>
        <meta
          name="description"
          content="Add your own meetups and create amazing networking opportunities!"
        />
      </Head>
      <NewMeetUpForm onAddMeetup={addMeetupHandler} />;
    </>
  );
}

export default NewMeetUpPage;
