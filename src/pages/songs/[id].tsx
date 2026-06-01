import type {
  GetStaticPaths,
  GetStaticProps,
  NextPage,
  GetStaticPropsContext,
} from "next";
import { getAllSongPaths, getSongData, type SongData } from "../../utils/song";
import Head from "next/head";
import SongMenu from "../../components/songMenu";
import { cleanUpTitle } from "../../utils/songtitle";

interface SongPageProps {
  songData: SongData;
}

const Song: NextPage<SongPageProps> = ({ songData }) => {
  return (
    <>
      <Head>
        <title>{cleanUpTitle(songData.id)}</title>
        <meta
          name="description"
          content="Songtext for the song {songData.id}"
        ></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <SongMenu id={songData.id} />
        <div
          className="pt-14 md:pt-4 md:pl-2"
          dangerouslySetInnerHTML={{ __html: songData.contentHtml }}
        />
      </main>
    </>
  );
};

export default Song;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllSongPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext) => {
  const songData = await getSongData(params?.id);
  return {
    props: {
      songData,
    },
  };
};
