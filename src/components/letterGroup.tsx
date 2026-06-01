import { getSongsByLetter } from "../utils/songtitle";
import { cleanUpTitle } from "../utils/songtitle";
import SongListElement from "./songListElement";

const LetterGroup: React.FC<{
  letter: string;
  hidden: boolean;
  selected?: boolean;
  searchQuery?: string;
}> = ({ letter, hidden, selected = false, searchQuery = "" }) => {
  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const songs = getSongsByLetter(letter).filter((song) =>
    cleanUpTitle(song).toLocaleLowerCase().includes(normalizedSearch),
  );
  const shouldHide = hidden || (normalizedSearch.length > 0 && songs.length === 0);

  return shouldHide ? (
    <></>
  ) : (
    <section
      aria-label={`Songs ${letter}`}
      className={
        selected
          ? "max-h-fit rounded-sm border-l-4 border-teal-500 bg-teal-500/10 p-3"
          : "max-h-fit rounded-sm p-3"
      }
    >
      <h2 className="font-serif text-3xl text-teal-500/70">{letter}</h2>
      <ul>
        {songs.length === 0 ? (
          <li className="flex flex-row items-start pl-4 text-sm text-gray-500">
            Kein Lied vorhanden
          </li>
        ) : (
          songs.map((song: string, index: number) => (
            <li
              key={index}
              className="container flex flex-row items-start px-4 underline-offset-4 hover:underline"
            >
              <SongListElement id={song} />
            </li>
          ))
        )}
      </ul>
    </section>
  );
};
export default LetterGroup;
