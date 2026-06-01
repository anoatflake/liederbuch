import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { repertoireAsArray } from "../utils/repertoire";
import SongListElement from "../components/songListElement";
import ProfileCard from "../components/profileCard";

const Profile: NextPage = () => {
  const { data: userData } = trpc.users.getUser.useQuery();
  const { data: repData } = trpc.users.getRepertoire.useQuery();

  const songs = repertoireAsArray(repData?.songs);

  return (
    <>
      <Head>
        <title>Profil</title>
        <meta name="profile" content="Profile of the logged in user" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="px-6 pt-16 md:max-w-max md:pt-4 md:pl-4">
          <ProfileCard
            uname={userData?.name ?? "nicht verfügbar"}
            email={userData?.email ?? "nicht verfügbar"}
            image={userData?.image ?? ""}
            inviteCode={repData?.inviteCode ?? "nicht verfügbar"}
          />
        </div>
        <div className="pt-16 pl-2 md:pt-4 md:pl-4">
          <div>
            <span>Repertoire</span>
          </div>
          <div>
            <div className="mx-auto max-w-sm justify-center px-6 pt-16 md:container md:pt-4 md:pl-8">
              <ul>
                {songs
                  ?.sort((x, y) => (x > y ? 1 : x < y ? -1 : 0))
                  .map((song: string, index: number) => (
                    <li
                      key={index}
                      className="items-start pb-1 underline-offset-4 hover:underline"
                    >
                      <SongListElement id={song} />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
