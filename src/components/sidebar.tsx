import {
  BookOpen,
  Bug,
  Lightbulb,
  ListMusic,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Radio,
  Search,
  Sun,
  User,
  X,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { LETTERS } from "../data/letters";
import { useRouter } from "next/router";

const iconClassName = "h-4 w-4 shrink-0";
const issueBaseUrl = "https://github.com/anoatflake/liederbuch/issues/new";

const createIssueUrl = (params: {
  body: string;
  labels: string;
  title: string;
}) => `${issueBaseUrl}?${new URLSearchParams(params).toString()}`;

const songRequestUrl = createIssueUrl({
  labels: "NEW_SONG",
  title: "new song: ",
  body: "### Song title\n\n### Link to chords or lyrics\n\n### Notes\n",
});
const bugReportUrl = createIssueUrl({
  labels: "BUG",
  title: "bug: ",
  body: "### What happened?\n\n### What did you expect?\n\n### Browser/OS\n",
});

const getPreferredDarkMode = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = window.localStorage.getItem("theme");
  return (
    storedTheme === "dark" ||
    (!storedTheme &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches === true)
  );
};

const NavItem: React.FC<{
  href: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ href, icon, label, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex min-h-9 items-center gap-3 rounded-sm px-3 text-sm tracking-widest underline-offset-4 hover:bg-gray-300/60 hover:underline dark:hover:bg-gray-800"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const preferredDarkMode = getPreferredDarkMode();
    document.documentElement.classList.toggle("dark", preferredDarkMode);
    // Theme preference is browser-only, so sync it after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(preferredDarkMode);
  }, []);

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <button
      type="button"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={darkMode}
      onClick={toggleTheme}
      className="flex min-h-9 w-full items-center gap-3 rounded-sm px-3 text-sm tracking-widest underline-offset-4 hover:bg-gray-300/60 hover:underline dark:hover:bg-gray-800"
    >
      {darkMode ? (
        <Sun aria-hidden="true" className={iconClassName} />
      ) : (
        <Moon aria-hidden="true" className={iconClassName} />
      )}
      <span>{darkMode ? "Light mode" : "Dark mode"}</span>
    </button>
  );
};

const LetterLinks: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const router = useRouter();
  const selectedLetter =
    typeof router.query.letter === "string" ? router.query.letter : undefined;

  return (
    <div className="mt-2 grid grid-cols-6 gap-1 px-2">
      {LETTERS.map((letter: string) => {
        const selected = selectedLetter === letter;
        return (
          <Link
            key={letter}
            href={{
              pathname: "/songs",
              query: { letter },
            }}
            onClick={onNavigate}
            aria-current={selected ? "page" : undefined}
            className={
              selected
                ? "rounded-sm bg-teal-500/20 p-2 text-center font-semibold text-teal-700 underline underline-offset-4 dark:text-teal-300"
                : "rounded-sm p-2 text-center underline-offset-4 hover:bg-gray-300/60 hover:underline dark:hover:bg-gray-800"
            }
          >
            {letter}
          </Link>
        );
      })}
    </div>
  );
};

const SongSearch: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const router = useRouter();
  const initialSearch =
    typeof router.query.q === "string" ? router.query.q : "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const searchSongs = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();

    router.push({
      pathname: "/songs",
      query: query ? { q: query } : {},
    });
    onNavigate?.();
  };

  return (
    <form onSubmit={searchSongs} className="mt-8 px-3">
      <label htmlFor="song-search" className="sr-only">
        Search songs by title
      </label>
      <div className="flex items-center gap-2 rounded-sm border border-gray-400 bg-white/70 px-2 py-1.5 dark:border-gray-700 dark:bg-gray-950/40">
        <Search aria-hidden="true" className="h-4 w-4 text-gray-500" />
        <input
          id="song-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Song suchen"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
        />
        <button
          type="submit"
          aria-label="Search songs"
          className="rounded-sm px-1.5 py-1 text-xs font-semibold tracking-widest text-teal-700 uppercase hover:bg-teal-500/10 dark:text-teal-300"
        >
          Go
        </button>
      </div>
    </form>
  );
};

const NavigationContent: React.FC<{ onNavigate?: () => void }> = ({
  onNavigate,
}) => {
  const { data: sessionData } = useSession();

  return (
    <>
      <div className="space-y-2 px-5 pt-6">
        <NavItem
          href="/currentSong"
          icon={<Radio aria-hidden="true" className={iconClassName} />}
          label="Folgen (WIP)"
          onClick={onNavigate}
        />
        {sessionData ? (
          <>
            <NavItem
              href="/profile"
              icon={<User aria-hidden="true" className={iconClassName} />}
              label="Profil"
              onClick={onNavigate}
            />
            <NavItem
              href="/songbooks"
              icon={<BookOpen aria-hidden="true" className={iconClassName} />}
              label="Liederbücher (WIP)"
              onClick={onNavigate}
            />
            <NavItem
              href="/"
              icon={<BookOpen aria-hidden="true" className={iconClassName} />}
              label="Songbook erstellen (WIP)"
              onClick={onNavigate}
            />
            <button
              type="button"
              className="flex min-h-9 w-full items-center gap-3 rounded-sm px-3 text-left text-sm tracking-widest underline-offset-4 hover:bg-gray-300/60 hover:underline dark:hover:bg-gray-800"
              onClick={() => {
                onNavigate?.();
                signOut({ callbackUrl: "http://localhost:3000/" });
              }}
            >
              <LogOut aria-hidden="true" className={iconClassName} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            className="flex min-h-9 w-full items-center gap-3 rounded-sm px-3 text-left text-sm tracking-widest underline-offset-4 hover:bg-gray-300/60 hover:underline dark:hover:bg-gray-800"
            onClick={() => {
              onNavigate?.();
              signIn("discord");
            }}
          >
            <LogIn aria-hidden="true" className={iconClassName} />
            <span>Login</span>
          </button>
        )}
        <ThemeToggle />
      </div>

      <SongSearch onNavigate={onNavigate} />

      <div className="mt-6 px-5">
        <NavItem
          href="/songs"
          icon={<ListMusic aria-hidden="true" className={iconClassName} />}
          label="Liste"
          onClick={onNavigate}
        />
      </div>

      <LetterLinks onNavigate={onNavigate} />

      <div className="mt-10 space-y-2 px-8 pb-8 tracking-widest underline-offset-4">
        <a
          href={songRequestUrl}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-sm border-2 border-teal-500/30 p-2 text-xs font-bold tracking-widest hover:border-teal-600/50 dark:border-teal-800/30 dark:hover:border-teal-700/40"
        >
          <Lightbulb aria-hidden="true" className="h-4 w-4" />
          <span>SUGGEST SONG</span>
        </a>
        <a
          href={bugReportUrl}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-sm border-2 border-red-300/70 p-2 text-xs font-bold tracking-widest hover:border-red-400/50 dark:border-red-700/20 dark:hover:border-red-900/30"
        >
          <Bug aria-hidden="true" className="h-4 w-4" />
          <span>REPORT BUG</span>
        </a>
      </div>
    </>
  );
};

/**
 * The navigation sidebar
 */
const SideBar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="fixed top-0 z-30 flex w-full items-center justify-between border-b-2 border-gray-500 bg-gray-200 p-4 md:hidden dark:border-gray-700 dark:bg-gray-900">
        <Link href="/songs" className="text-sm font-semibold tracking-widest">
          Liederbuch
        </Link>
        <button
          id="nav-toggle"
          type="button"
          aria-label={expanded ? "Close navigation" : "Open navigation"}
          aria-expanded={expanded}
          onClick={() => setExpanded((expanded) => !expanded)}
          className="rounded-sm p-1 hover:bg-gray-300 dark:hover:bg-gray-800"
        >
          {expanded ? (
            <X aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Menu aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
      </div>

      {expanded ? (
        <nav className="fixed top-14 bottom-0 z-20 mt-0.5 w-full overflow-y-auto overscroll-none bg-gray-200 md:hidden dark:bg-gray-900">
          <NavigationContent onNavigate={() => setExpanded(false)} />
        </nav>
      ) : null}

      <nav className="fixed top-0 hidden h-full w-64 overflow-y-auto border-r-2 border-gray-400 bg-gray-200/40 p-4 md:block dark:border-gray-700 dark:bg-gray-900/40">
        <NavigationContent />
      </nav>
    </>
  );
};

export default SideBar;
