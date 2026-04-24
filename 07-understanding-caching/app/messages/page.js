import Messages from "@/components/messages";
import { getMessages } from "@/lib/messages";
import { unstable_noStore } from "next/cache";

//== pre-defined variable for revalidation after 5 sec
// export const revalidate = 5

//== pre-defined variable for avoid cache
// export const dynamic = "force-dynamic";


export default async function MessagesPage() {
  //== pre-defined next/cache function that avoid caching
  // unstable_noStore()
  const response = await fetch("http://localhost:8080/messages", {
    //== avoid caching
    // cache: "no-cache",

    //== after 5 sec the fetch request revalidate.
    // next: {
    //   revalidate: 5,
    // },
  });
  // const messages = await response.json();
  
  const messages = await getMessages();

  if (!messages || messages.length === 0) {
    return <p>No messages found</p>;
  }

  return <Messages messages={messages} />;
}
