import { config } from "dotenv";
import { Pool } from "pg";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!url) {
  console.log("Skipping - DATABASE_URL not configured");
  process.exit(0);
}

const pool = new Pool({ connectionString: url });

const SEED_DATA: { course_title: string; label: string; href: string; resource_type: string; sort_order: number }[] = [
  { course_title: "AP Biology", label: "OpenStax Biology for AP Courses", href: "https://openstax.org/books/biology-ap-courses/pages/preface", resource_type: "textbook", sort_order: 1 },
  { course_title: "AP Biology", label: "AP Central Biology", href: "https://apcentral.collegeboard.org/courses/ap-biology/classroom-resources", resource_type: "reference", sort_order: 2 },
  { course_title: "AP Biology", label: "APstudy.net practice tests", href: "https://www.apstudy.net/ap/biology/", resource_type: "practice", sort_order: 3 },
  { course_title: "AP Biology", label: "Bozeman Science AP Biology", href: "https://www.bozemanscience.com/ap-biology", resource_type: "video", sort_order: 4 },
  { course_title: "AP Calculus AB", label: "Khan Academy AP Calculus AB", href: "https://www.khanacademy.org/math/ap-calculus-ab", resource_type: "practice", sort_order: 1 },
  { course_title: "AP Calculus AB", label: "OpenStax Calculus Vol 1", href: "https://openstax.org/books/calculus-volume-1/pages/1-introduction", resource_type: "textbook", sort_order: 2 },
  { course_title: "AP Calculus AB", label: "3Blue1Brown Essence of Calculus", href: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", resource_type: "video", sort_order: 3 },
  { course_title: "AP Calculus AB", label: "AP Central Calculus AB", href: "https://apcentral.collegeboard.org/courses/ap-calculus-ab", resource_type: "reference", sort_order: 4 },
  { course_title: "AP Calculus BC", label: "Khan Academy AP Calculus BC", href: "https://www.khanacademy.org/math/ap-calculus-bc", resource_type: "practice", sort_order: 1 },
  { course_title: "AP Calculus BC", label: "OpenStax Calculus Vol 1", href: "https://openstax.org/books/calculus-volume-1/pages/1-introduction", resource_type: "textbook", sort_order: 2 },
  { course_title: "AP Calculus BC", label: "OpenStax Calculus Vol 2 (BC topics)", href: "https://openstax.org/books/calculus-volume-2/pages/1-introduction", resource_type: "textbook", sort_order: 3 },
  { course_title: "AP Calculus BC", label: "3Blue1Brown Essence of Calculus", href: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", resource_type: "video", sort_order: 4 },
  { course_title: "AP Calculus BC", label: "AP Central Calculus BC", href: "https://apcentral.collegeboard.org/courses/ap-calculus-bc", resource_type: "reference", sort_order: 5 },
  { course_title: "AP Chemistry", label: "OpenStax Chemistry 2e", href: "https://openstax.org/books/chemistry-2e/pages/1-introduction", resource_type: "textbook", sort_order: 1 },
  { course_title: "AP Chemistry", label: "AP Central Chemistry", href: "https://apcentral.collegeboard.org/courses/ap-chemistry/classroom-resources", resource_type: "reference", sort_order: 2 },
  { course_title: "AP Chemistry", label: "Tyler DeWitt AP Chemistry (YouTube)", href: "https://www.youtube.com/@TylerDeWitt", resource_type: "video", sort_order: 3 },
  { course_title: "AP Chemistry", label: "APstudy.org unit notes", href: "https://resources.apstudy.org/ap-chem", resource_type: "reference", sort_order: 4 },
  { course_title: "AP Chemistry", label: "APPracticeExams AP Chemistry", href: "https://www.appracticeexams.com/ap-chemistry/", resource_type: "practice", sort_order: 5 },
  { course_title: "AP Computer Science A – Java", label: "CSAwesome (College Board endorsed)", href: "https://runestone.academy/ns/books/published/csawesome/index.html", resource_type: "textbook", sort_order: 1 },
  { course_title: "AP Computer Science A – Java", label: "CodeHS AP CSA", href: "https://codehs.com/curriculum/ap-csa", resource_type: "practice", sort_order: 2 },
  { course_title: "AP Computer Science A – Java", label: "CS++ FRQ solutions", href: "https://csplusplus.com/apcsa/", resource_type: "practice", sort_order: 3 },
  { course_title: "AP Computer Science A – Java", label: "AP Central CSA", href: "https://apcentral.collegeboard.org/courses/ap-computer-science-a", resource_type: "reference", sort_order: 4 },
  { course_title: "AP Computer Science Principles (AP CSP)", label: "Code.org AP CSP (endorsed)", href: "https://code.org/curriculum/csp", resource_type: "practice", sort_order: 1 },
  { course_title: "AP Computer Science Principles (AP CSP)", label: "Runestone CS Principles", href: "https://runestone.academy/ns/books/published/StudentCSP/index.html", resource_type: "textbook", sort_order: 2 },
  { course_title: "AP Computer Science Principles (AP CSP)", label: "AP Central CSP", href: "https://apcentral.collegeboard.org/courses/ap-computer-science-principles/classroom-resources", resource_type: "reference", sort_order: 3 },
  { course_title: "AP English Literature and Composition", label: "AP Central past FRQs & scoring", href: "https://apcentral.collegeboard.org/courses/ap-english-literature-and-composition/exam/past-exam-questions", resource_type: "reference", sort_order: 1 },
  { course_title: "AP English Literature and Composition", label: "APPracticeExams AP Lit", href: "https://www.appracticeexams.com/ap-english-literature/", resource_type: "practice", sort_order: 2 },
  { course_title: "AP English Literature and Composition", label: "Crash Course Literature", href: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtO65LeD2p5_Sb5bXYT1FDQK", resource_type: "video", sort_order: 3 },
  { course_title: "AP English Literature and Composition", label: "AP Central English Lit", href: "https://apcentral.collegeboard.org/courses/ap-english-literature-and-composition/classroom-resources", resource_type: "reference", sort_order: 4 },
  { course_title: "AP Latin", label: "Wheelock's Latin (free materials)", href: "https://www.wheelockslatin.com/", resource_type: "reference", sort_order: 1 },
  { course_title: "AP Latin", label: "AP Latin videos (johnpiazza.net)", href: "https://johnpiazza.net/ap-latin-videos/", resource_type: "video", sort_order: 2 },
  { course_title: "AP Latin", label: "LatinTutorial (Aeneid)", href: "https://www.youtube.com/user/latintutorial", resource_type: "video", sort_order: 3 },
  { course_title: "AP Latin", label: "AP Central Latin", href: "https://apcentral.collegeboard.org/courses/ap-latin/classroom-resources", resource_type: "reference", sort_order: 4 },
  { course_title: "AP Mandarin Language and Culture", label: "Mr. Kang's AP Chinese (free units 0-9)", href: "https://learnchinese.chinesewebcenter.net/mandarin_web/ap/ap_progress.htm", resource_type: "practice", sort_order: 1 },
  { course_title: "AP Mandarin Language and Culture", label: "AP Central Chinese", href: "https://apcentral.collegeboard.org/courses/ap-chinese-language-and-culture/classroom-resources", resource_type: "reference", sort_order: 2 },
  { course_title: "AP Mandarin Language and Culture", label: "Chinese Grammar Wiki", href: "https://resources.allsetlearning.com/chinese/grammar/", resource_type: "reference", sort_order: 3 },
  { course_title: "AP Mandarin Language and Culture", label: "Yoyo Chinese (YouTube)", href: "https://www.youtube.com/user/yoyochinese", resource_type: "video", sort_order: 4 },
  { course_title: "AP Music Theory", label: "Open Music Theory", href: "https://viva.pressbooks.pub/openmusictheory/", resource_type: "textbook", sort_order: 1 },
  { course_title: "AP Music Theory", label: "Ear Training Appendix", href: "https://viva.pressbooks.pub/openmusictheory/part/ear-training/", resource_type: "practice", sort_order: 2 },
  { course_title: "AP Music Theory", label: "Khan Academy Music", href: "https://www.khanacademy.org/humanities/music", resource_type: "practice", sort_order: 3 },
  { course_title: "AP Music Theory", label: "AP Central Music Theory", href: "https://apcentral.collegeboard.org/courses/ap-music-theory", resource_type: "reference", sort_order: 4 },
  { course_title: "AP Physics C: Mechanics", label: "NJCTL AP Physics C (full course)", href: "https://njctl.org/materials/courses/ap-physics-c-mechanics/", resource_type: "textbook", sort_order: 1 },
  { course_title: "AP Physics C: Mechanics", label: "OpenStax College Physics for AP", href: "https://openstax.org/details/books/college-physics-ap-courses-2e", resource_type: "textbook", sort_order: 2 },
  { course_title: "AP Physics C: Mechanics", label: "Flipping Physics AP Physics C", href: "https://www.flippingphysics.com/ap-physics-c-previous.html", resource_type: "video", sort_order: 3 },
  { course_title: "AP Physics C: Mechanics", label: "AP Central Physics C", href: "https://apcentral.collegeboard.org/courses/ap-physics-c-mechanics/classroom-resources", resource_type: "reference", sort_order: 4 },
  { course_title: "AP Spanish Language & Culture", label: "AP Central Spanish", href: "https://apcentral.collegeboard.org/courses/ap-spanish-language-and-culture/classroom-resources", resource_type: "reference", sort_order: 1 },
  { course_title: "AP Spanish Language & Culture", label: "AP FRQs by year", href: "https://apstudents.collegeboard.org/courses/ap-spanish-language-and-culture/free-response-questions-by-year", resource_type: "practice", sort_order: 2 },
  { course_title: "AP Spanish Language & Culture", label: "Knowt AP Spanish", href: "https://knowt.com/exams/AP/AP-Spanish-Language-and-Culture", resource_type: "practice", sort_order: 3 },
  { course_title: "AP Spanish Language & Culture", label: "Señor Jordan Spanish grammar", href: "https://www.youtube.com/@srajordan", resource_type: "video", sort_order: 4 },
  { course_title: "AP Statistics", label: "OpenIntro Advanced High School Statistics", href: "https://www.openintro.org/book/ahss/", resource_type: "textbook", sort_order: 1 },
  { course_title: "AP Statistics", label: "AP Central past exams & scoring", href: "https://apcentral.collegeboard.org/courses/ap-statistics/exam/past-exam-questions", resource_type: "reference", sort_order: 2 },
  { course_title: "AP Statistics", label: "Stat Trek AP practice test", href: "https://stattrek.com/ap-statistics/practice-test", resource_type: "practice", sort_order: 3 },
  { course_title: "AP Statistics", label: "Knowt AP Statistics FRQ", href: "https://knowt.com/exams/AP/AP-Statistics/frq-room", resource_type: "practice", sort_order: 4 },
  { course_title: "AP Statistics", label: "APPracticeExams AP Statistics", href: "https://www.appracticeexams.com/ap-statistics/", resource_type: "practice", sort_order: 5 },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM course_learning_resources");
    for (const row of SEED_DATA) {
      await client.query(
        `INSERT INTO course_learning_resources (course_title, label, href, resource_type, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [row.course_title, row.label, row.href, row.resource_type, row.sort_order]
      );
    }
    console.log(`Seeded ${SEED_DATA.length} course learning resources`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
