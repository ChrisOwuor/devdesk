"use server";

import prisma from "../prisma";

export async function createPage(folderId: string, name: string) {
  return prisma.page.create({
    data: {
      name,
      folderId,
    },
  });
}
