"use server";

import prisma from "../prisma";


export async function createFolder(spaceId: string, name: string) {
  return prisma.folder.create({
    data: {
      name,
      spaceId,
    },
    include: {
      pages: true,
    },
  });
}
