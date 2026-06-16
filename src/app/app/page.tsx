import WorkspaceClient from "@/components/dashboard/WorkspaceClient";
import prisma from "../../../lib/prisma";
import { auth } from "../../../lib/auth";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    return <div>Unauthorized tr</div>;
  }
  console.log(session)

  // ----------------------------------------------------
  // 1. Try find existing workspace
  // ----------------------------------------------------
  let workspace = await prisma.workspace.findFirst({
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

  console.log(workspace);

  // ----------------------------------------------------
  // 2. If none exists → create full default structure
  // ----------------------------------------------------
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: `${session.user.name}'s Workspace`,
        slug: `ws-${session.user.id}`,
        createdById: session.user.id,

        spaces: {
          create: [
            {
              name: "Operations",
              folders: {
                create: [
                  {
                    name: "General",
                    pages: {
                      create: [
                        { name: "Getting Started" },
                        { name: "Roadmap" },
                      ],
                    },
                  },
                ],
              },
            },
          ],
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
    });
  }

  return <WorkspaceClient workspace={workspace} />;
}
