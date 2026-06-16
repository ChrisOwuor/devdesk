import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: "admin@alcom.com",
    },
  });

  if (existingUser) {
    console.log("User already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      name: "Chris Owuor",
      email: "admin@alcom.com",
      password: hashedPassword,

      workspaces: {
        create: {
          name: `Chris Owuor's Workspace`,
          slug: `Chris-Owuor-workspace`,

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
      },
    },
  });

  console.log("Default user created");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
