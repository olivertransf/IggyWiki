import { config } from "dotenv";
import { Pool } from "pg";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!url) {
  console.log("Skipping - DATABASE_URL not configured");
  process.exit(0);
}

const pool = new Pool({ connectionString: url });

const RESOURCES = [
  { title: "Academic", links: [
    { label: "PowerSchool", href: "https://siprep.powerschool.com/public" },
    { label: "Canvas", href: "https://canvas.siprep.org/login/ldap" },
    { label: "Final Exam Schedule", href: "https://families.siprep.org/fs/pages/3686" },
    { label: "Learning Support", href: "https://families.siprep.org/" },
    { label: "Counseling", href: "https://families.siprep.org/" },
    { label: "Wellness Resources", href: "https://families.siprep.org/" },
  ]},
  { title: "Library", links: [
    { label: "Library Resources", href: "https://families.siprep.org/academics/library/resources" },
  ]},
  { title: "College", links: [
    { label: "Transcript Request", href: "https://families.siprep.org/fs/pages/3777" },
    { label: "Standardized Testing", href: "https://families.siprep.org/" },
    { label: "SCOIR", href: "https://families.siprep.org/" },
  ]},
  { title: "Daily Life", links: [
    { label: "Calendar", href: "https://families.siprep.org/fs/pages/3772" },
    { label: "Bus Registration", href: "https://families.siprep.org/fs/pages/3696" },
    { label: "Student/Parent Handbook", href: "https://families.siprep.org/fs/pages/4021" },
    { label: "Campus Security", href: "https://families.siprep.org/fs/pages/3779" },
  ]},
  { title: "More", links: [
    { label: "SI Families Portal", href: "https://families.siprep.org/" },
    { label: "MySI", href: "https://my.siprep.org/" },
  ]},
];

async function sync() {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM resource_links");
    await client.query("DELETE FROM resource_sections");

    let sortOrder = 0;
    for (const section of RESOURCES) {
      const { rows } = await client.query(
        "INSERT INTO resource_sections (title, sort_order) VALUES ($1, $2) RETURNING id",
        [section.title, sortOrder]
      );
      const sectionId = rows[0].id;

      for (let i = 0; i < section.links.length; i++) {
        const link = section.links[i];
        await client.query(
          "INSERT INTO resource_links (section_id, label, href, sort_order) VALUES ($1, $2, $3, $4)",
          [sectionId, link.label, link.href, i]
        );
      }
      sortOrder++;
    }
    console.log(`Synced ${RESOURCES.length} resource sections to database`);
  } finally {
    client.release();
    await pool.end();
  }
}

sync().catch((e) => {
  console.error(e);
  process.exit(1);
});
