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
  { title: "Clubs and Sports", links: [
    { label: "SI Wildcats", href: "https://siwildcats.com/" },
    { label: "Field & Pool Practice Schedule", href: "https://docs.google.com/spreadsheets/d/1ySCzEWHzFKHjlh5kaffrY8-Hp2bAklA1pWu1BG82pxU/edit?gid=230153569#gid=230153569" },
    { label: "Club Hub", href: "https://clubhub.co/" },
    { label: "Athletics Photos (SlickPic)", href: "https://siprep.slickpic.com/albums/SI-Athletics-2023-2024/?wallpaper" },
    { label: "GoFan Tickets", href: "https://gofan.co/app/school/CA23040" },
  ]},
  { title: "Social Media", links: [
    { label: "Instagram (Life at SI)", href: "https://www.instagram.com/lifeatsi/" },
    { label: "Instagram (Admissions)", href: "https://www.instagram.com/siadmissions/" },
    { label: "Instagram (Athletics)", href: "https://www.instagram.com/siwildcatsathletics/" },
    { label: "Instagram (Magis)", href: "https://www.instagram.com/stignatiusmagis/" },
    { label: "Instagram (Alumni)", href: "https://www.instagram.com/alumnicats/" },
    { label: "YouTube (SI Television)", href: "https://www.youtube.com/user/SIprepTV" },
    { label: "YouTube (SI Sports Network)", href: "https://www.youtube.com/@SISportsNetwork" },
    { label: "YouTube (Alumni)", href: "https://www.youtube.com/channel/UC2nYaQ3U1A6IJspiGr943EQ" },
    { label: "Vimeo (Alumni)", href: "https://vimeo.com/wildcatalumni" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/ignatian-corporation/" },
    { label: "LinkedIn (Alumni Group)", href: "https://www.linkedin.com/groups/82842/" },
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
