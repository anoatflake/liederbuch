import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useQuery } from "@tanstack/react-query";
// isr???
// theo link shortener --> vercel middleware

const Current: NextPage = () => {
  const { id } = useRouter().query;
  const currentSong = trpc.repertoire.getRepertoireViaInviteCode.useQuery(
    id as string,
  ).data?.currentSong;
  const { data } = useQuery<{ content?: string }>({
    queryKey: ["songData", currentSong],
    queryFn: async () =>
      fetch(`/api/song/${currentSong}`).then((res) => res.json()),
    enabled: Boolean(currentSong),
  });

  return (
    <>
      <main>
        <div
          className="pt-14 md:pt-4 md:pl-2"
          dangerouslySetInnerHTML={{ __html: data?.content ?? "" }}
        />
      </main>
    </>
  );
};

export default Current;

//TODO! better sync
export const getServerSideProps = async () => {
  return { props: {} };
};

//NEW THOUGHTS!
//FETCH DB CURRENT SONG AND THEN PUT THAT IN THE FILE LOADER API (AKA SONG[SONGID])
//checkout uswSWR and this https://vercel.com/guides/loading-static-file-nextjs-api-route

//LOADING SUSPENSE
//https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming

//Thoughts
//EventSource --> subscribes to target --> Question houy do you implement the target
//getServerSideProps --> BACKEND CODE fetch in interval??? idk fetch triggred after successful mutation????
