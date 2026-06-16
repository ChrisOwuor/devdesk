"use server";

import prisma from "../prisma";

export async function createSpace(workspaceId: string, name: string) {
  return prisma.space.create({
    data: {
      name,
      workspaceId,
    },
    include: {
      folders: {
        include: {
          pages: true,
        },
      },
    },
  });
}