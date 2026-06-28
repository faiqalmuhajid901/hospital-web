import "dotenv/config";
import { db } from "@/db";
import { roles } from "@/db/section/auth";

async function main() {
  await db
    .insert(roles)
    .values([
      { name: "Super Admin", description: "CEO" },
      { name: "admin", description: "Administrator sistem" },
      { name: "dokter", description: "Tenaga medis dokter" },
      { name: "perawat", description: "Tenaga keperawatan" },
      { name: "apoteker", description: "Farmasi" },
      { name: "pasien", description: "Pasien" },
    ])
    .onConflictDoNothing({
      target: roles.name,
    });

  console.log("Seed roles selesai.");
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });