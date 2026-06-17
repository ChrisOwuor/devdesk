import WorkspaceClient from "@/components/dashboard/WorkspaceClient";
import prisma from "../../../lib/prisma";
import { auth } from "../../../lib/auth";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  // ----------------------------------------------------
  // 1. Find existing workspace
  // ----------------------------------------------------
  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      createdById: session.user.id,
    },
    include: {
      spaces: {
        include: {
          folders: {
            include: {
              pages: true,
            },
          },
        },
      },
    },
  });

  // ----------------------------------------------------
  // 2. Create default workspace if none exists
  // ----------------------------------------------------
  const workspace =
    existingWorkspace ??
    (await prisma.workspace.create({
      data: {
        name: `${session.user.name}'s Workspace`,
        slug: `ws-${session.user.id}`,
        createdById: session.user.id,

        spaces: {
          create: {
            name: "Operations",

            folders: {
              create: {
                name: "Getting Started",

                pages: {
                  create: {
                    name: "Welcome",
                  },
                },
              },
            },
          },
        },
      },
      include: {
        spaces: {
          include: {
            folders: {
              include: {
                pages: true,
              },
            },
          },
        },
      },
    }));

  return <WorkspaceClient workspace={workspace} />;
}