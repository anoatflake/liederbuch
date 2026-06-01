import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const repertoireRouter = router({
  getRepertoire: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.repertoire.findUnique({
      where: {
        userId: input,
      },
    });
  }),
  getRepertoireViaInviteCode: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.repertoire.findUnique({
        where: {
          inviteCode: input,
        },
      });
    }),

  addSongToRepertoire: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const currentRep = await ctx.prisma.repertoire.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const result = await ctx.prisma.repertoire.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        update: {
          songs: input + ", " + currentRep?.songs,
        },
        create: {
          userId: ctx.session.user.id,
          songs: input + ", ",
        },
      });
      return { added: result };
    }),
  removeSongFromRepertoire: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const currentRep = await ctx.prisma.repertoire.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });
      const updatedSongs = currentRep?.songs?.replace(input + ", ", "");
      const result = await ctx.prisma.repertoire.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          songs: updatedSongs,
        },
      });
      return { removed: result };
    }),

  setCurrentSong: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.prisma.repertoire.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          currentSong: input,
        },
      });
      return { current: result };
    }),
});
