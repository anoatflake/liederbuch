import { useSession } from "next-auth/react";
import { Radio, Star } from "lucide-react";
import AddToRepButton from "./buttons/addToRepButton";
import CurrentSongButton from "./buttons/currentSongButton";

const SongMenu: React.FC<{ id: string }> = ({ id }) => {
  const { data: sessionData } = useSession();

  return sessionData ? (
    <div className="m-4 flex flex-col gap-3 rounded-sm border-l-4 border-slate-700 bg-slate-100 p-3 text-sm font-semibold shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-slate-800/80">
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <span className="flex items-center gap-2">
          <Star aria-hidden="true" className="h-4 w-4" />
          Repertoire
        </span>
        <AddToRepButton id={id} />
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-start">
        <span className="flex items-center gap-2">
          <Radio aria-hidden="true" className="h-4 w-4" />
          Mit Sängern teilen
        </span>
        <CurrentSongButton id={id} />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default SongMenu;
