import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { isSongInRepertoire } from "../../utils/repertoire";
import { useState } from "react";
import { Plus, X } from "lucide-react";

// TODO: move state setting to input var (loggedin? & inRep?)
const AddToRepButton: React.FC<{ id: string }> = ({ id }) => {
  const { data: sessionData } = useSession();

  const { data: songData } = trpc.users.getSongs.useQuery();
  const [isInReperoire, setIsInRepertoire] = useState(
    isSongInRepertoire(id, songData),
  );

  const addSong = trpc.repertoire.addSongToRepertoire.useMutation();
  const removeSong = trpc.repertoire.removeSongFromRepertoire.useMutation();

  return sessionData ? (
    !isInReperoire ? (
      <button
        id={id}
        className="inline-block h-7 w-7 rounded-full border-2 bg-teal-400 p-1 hover:border-teal-600 dark:border-slate-900 dark:bg-teal-900"
        onClick={() => {
          addSong.mutate(id);
          setIsInRepertoire(true);
        }}
      >
        <Plus aria-hidden="true" className="h-full w-full" />
        <span className="sr-only">Add to repertoire</span>
      </button>
    ) : (
      <button
        id={id}
        className="inline-block h-7 w-7 rounded-full border-2 bg-red-300 p-1 hover:border-red-500 dark:border-slate-900 dark:bg-red-900"
        onClick={() => {
          removeSong.mutate(id);
          setIsInRepertoire(false);
        }}
      >
        <X aria-hidden="true" className="h-full w-full" />
        <span className="sr-only">Remove from repertoire</span>
      </button>
    )
  ) : (
    <></>
  );
};

export default AddToRepButton;
