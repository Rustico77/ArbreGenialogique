import { Role } from "@prisma/client";
import prisma from "../lib/prisma";
import bcrypt from 'bcryptjs';


async function main() {
    console.log('🌱 Début du seeding...');

    const hashedPassword = await bcrypt.hash("password", 10);

    await prisma.user.upsert({
        where: { userName: "admin" },
        update: {},
        create: {
            userName: "admin",
            password: hashedPassword,
            firstName: "Admin",
            lastName: "User",
            role: Role.ADMIN,
        },
    });


    console.log('✅ Seeding terminé !');
    console.log('👤 Comptes créés :');
    console.log('   - Admin: admin / password');
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seeding :', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });