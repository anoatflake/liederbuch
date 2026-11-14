// @vitest-environment node

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { Session } from "next-auth";
import superjson from "superjson";
import type { Context } from "../../server/trpc/context";
import { appRouter, type AppRouter } from "../../server/trpc/router/_app";

// Keep the router, middleware, validation and HTTP serialization real; isolate
// these tests from the external database and OAuth provider.
const database = {
  repertoire: {
    findUnique: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
};

let session: Session | null;

const transport = vi.fn((url: RequestInfo | URL, options?: RequestInit) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: new Request(url, options),
    router: appRouter,
    createContext: async (): Promise<Context> => ({
      session,
      prisma: database as unknown as Context["prisma"],
    }),
  }),
);

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost/api/trpc",
      transformer: superjson,
      fetch: transport,
    }),
  ],
});

describe("tRPC HTTP integration", () => {
  beforeEach(() => {
    database.repertoire.findUnique.mockReset();
    database.repertoire.update.mockReset();
    database.repertoire.upsert.mockReset();
    database.user.findUnique.mockReset();
    transport.mockClear();
    session = null;
  });

  it("batches public queries and returns the current session", async () => {
    database.repertoire.findUnique.mockResolvedValue({
      userId: "player-1",
      inviteCode: "invite-1",
      currentSong: "A_Song",
    });

    const [currentSession, repertoire] = await Promise.all([
      client.auth.getSession.query(),
      client.repertoire.getRepertoireViaInviteCode.query("invite-1"),
    ]);

    expect(currentSession).toBeNull();
    expect(repertoire?.currentSong).toBe("A_Song");
    expect(database.repertoire.findUnique).toHaveBeenCalledWith({
      where: { inviteCode: "invite-1" },
    });
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it("rejects anonymous mutations before accessing the database", async () => {
    await expect(
      client.repertoire.setCurrentSong.mutate("A_Song"),
    ).rejects.toMatchObject({ data: { code: "UNAUTHORIZED" } });

    expect(database.repertoire.update).not.toHaveBeenCalled();
  });

  it("validates HTTP input with Zod before accessing the database", async () => {
    await expect(
      // @ts-expect-error Exercise invalid input from an untyped HTTP caller.
      client.repertoire.getRepertoireViaInviteCode.query(42),
    ).rejects.toMatchObject({ data: { code: "BAD_REQUEST" } });

    expect(database.repertoire.findUnique).not.toHaveBeenCalled();
  });

  it("scopes authenticated mutations to the session user", async () => {
    session = {
      user: { id: "player-1" },
      expires: "2099-01-01T00:00:00.000Z",
    };
    database.repertoire.update.mockResolvedValue({
      userId: "player-1",
      currentSong: "A_Song",
    });

    const result = await client.repertoire.setCurrentSong.mutate("A_Song");

    expect(database.repertoire.update).toHaveBeenCalledWith({
      where: { userId: "player-1" },
      data: { currentSong: "A_Song" },
    });
    expect(result.current.currentSong).toBe("A_Song");
  });

  it("preserves Prisma Date values through SuperJSON", async () => {
    session = {
      user: { id: "player-1" },
      expires: "2099-01-01T00:00:00.000Z",
    };
    const emailVerified = new Date("2026-01-02T03:04:05.000Z");
    database.user.findUnique.mockResolvedValue({
      id: "player-1",
      name: "Player",
      email: "player@example.com",
      emailVerified,
      image: null,
    });

    const user = await client.users.getUser.query();

    expect(user?.emailVerified).toBeInstanceOf(Date);
    expect(user?.emailVerified).toEqual(emailVerified);
    expect(database.user.findUnique).toHaveBeenCalledWith({
      where: { id: "player-1" },
    });
  });
});
