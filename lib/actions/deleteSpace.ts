"use server";

import prisma from "../prisma";

export async function deleteSpace(spaceId: string) {
  await prisma.space.delete({
    where: {
      id: spaceId,
    },
  });
}
