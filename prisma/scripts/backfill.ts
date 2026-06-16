import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";

import "dotenv/config";


console.log("RAW ENV:", process.env.DATABASE_URL);

console.log("TYPE:", typeof process.env.DATABASE_URL);
async function main() {
  await prisma.user.updateMany({
    data: {
    password: await bcrypt.hash("pass123", 10),
    },
  });
}

main();