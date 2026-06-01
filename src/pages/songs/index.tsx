import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { X } from "lucide-react";
import LetterGroup from "../../components/letterGroup";
import { LETTERS } from "../../data/letters";

const Songs: NextPage = () => {
  const router = useRouter();
  const { letter, q } = router.query;
  const searchQuery = typeof q === "string" ? q : "";
  const selectedLetter = typeof letter === "string" ? letter : undefined;
  const resetSearchHref = {
    pathname: "/songs",
    query: selectedLetter ? { letter: selectedLetter } : {},
  };

  const isLetterGroupHidden = (letterGroupLetter: string) => {
    if (selectedLetter) {
      return letterGroupLetter !== selectedLetter;
    } else {
      return false;
    }
  };

  return (
    <>
      <Head>
        <title>Liederbuchliste</title>
        <meta name="description" content="List of all songs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="mx-auto max-w-sm pt-16 pl-2 md:container md:pt-4 md:pl-8">
          {searchQuery ? (
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <p>
                Suche nach:{" "}
                <span className="font-semibold">{searchQuery}</span>
              </p>
              <Link
                href={resetSearchHref}
                aria-label="Reset search"
                className="inline-flex min-h-8 items-center gap-1.5 rounded-sm border border-gray-300 px-2 py-1 text-xs font-semibold tracking-widest text-gray-700 uppercase hover:border-teal-500 hover:text-teal-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Suche zurücksetzen</span>
              </Link>
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {LETTERS.map((letter: string) => (
              <LetterGroup
                letter={letter}
                hidden={isLetterGroupHidden(letter)}
                selected={router.query.letter === letter}
                searchQuery={searchQuery}
                key={letter}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};
export default Songs;
