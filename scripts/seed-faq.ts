import { config } from "dotenv";
import { Pool } from "pg";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!url) {
  console.log("Skipping - DATABASE_URL not configured");
  process.exit(0);
}

const pool = new Pool({ connectionString: url });

const FAQ_DATA: { topic: string; items: { question: string; answer: string }[] }[] = [
  {
    topic: "Academics & GPA",
    items: [
      {
        question: "What are the graduation requirements?",
        answer:
          "You need to complete 240 total credits (48 semester classes), taking 6 courses per semester. Required subjects include: 8 semesters of English, 6 of Math, 6 of Social Science, 7 of Religious Studies, 4 of Language (same language), 4 of Science, 2 of Fine Arts, 1 semester of Wellness (freshman year), and 9 electives.",
      },
      {
        question: "How is GPA calculated?",
        answer:
          "SI uses a 4.0 scale. Honors/AP courses add +1.0 to the unweighted grade (e.g., an A in an AP class = 5.0). Quarter grades appear in PowerSchool but are NOT recorded on your transcript. Only semester grades are permanent.",
      },
      {
        question: "What is the Honor Roll cutoff?",
        answer:
          "A semester GPA of 3.50 or above earns Principal's Honor Roll. To graduate with honors, you need 4+ upper-division Honors/AP courses and a 3.5 cumulative unweighted GPA over 7 semesters. For high honors, it's 6+ Honors/AP courses and a 3.75 GPA.",
      },
      {
        question: "What happens if I get an F?",
        answer:
          "You must repeat the course in summer school and pass it before you can re-enroll the following year. Getting two or more Fs in a single semester may result in being asked to withdraw.",
      },
      {
        question: "What if my GPA drops below 2.0?",
        answer:
          "You're automatically placed in the Academic Recovery Program (academic probation). You must attend at least 2 CATS study hall sessions per week and may lose eligibility for co-curricular activities. A second semester below 2.0 while on probation can result in dismissal.",
      },
      {
        question: "Can I take more than 2 Honors/AP classes?",
        answer:
          "You need your counselor's approval to take more than two Honors/AP courses in any semester.",
      },
      {
        question: "When can I change my schedule?",
        answer:
          "The deadline is the second day of the fall semester. You cannot request a specific teacher, specific semester, or period (other than 0 or 8th). Adding Honors/AP classes or changing Math/Language placements also requires a counselor or department chair signature.",
      },
      {
        question: "How do I order a transcript?",
        answer:
          "Order online through the school website. It costs $5.00 per copy. Courses completed at SI cannot be removed from your transcript.",
      },
    ],
  },
  {
    topic: "AI & Academic Integrity",
    items: [
      {
        question: "Can I use AI for assignments?",
        answer:
          "No. Using AI to generate ideas, evidence, or language is an academic integrity violation unless the teacher explicitly grants permission. Consequences start with a failing grade on the assignment; repeated offenses can lead to suspension or dismissal.",
      },
      {
        question: "What counts as cheating?",
        answer:
          "Plagiarism, copying homework, cheating on exams, copying from the internet without citation, and knowingly letting someone else copy your work all count. The school keeps records of all cheating offenses.",
      },
    ],
  },
  {
    topic: "Attendance",
    items: [
      {
        question: "How many absences can I have?",
        answer:
          "You lose credit for a class if you miss 7 or more sessions in a semester. School-sponsored activities (retreats, athletics, fine arts performances, assemblies) do NOT count toward the 7. Parents are notified at 5 absences.",
      },
      {
        question: "What do I do if I'm absent?",
        answer:
          "A parent/guardian must call the Deans Office at (415) 731-8571 before 10:00 AM. The office does not accept emails for absences or tardies.",
      },
      {
        question: "What happens if I'm tardy?",
        answer:
          "Report to the Deans Office via the Main Academic Building entrance. Being tardy without a parent note or prior phone call may result in detention. If you're significantly late to a class, it counts as an absence.",
      },
      {
        question: "Can I leave campus during the day?",
        answer:
          "Students must stay on campus from their first class until at least lunch. To leave for any reason, you must get a pass from the Deans Office. Leaving without permission results in disciplinary action; cutting a full day can mean suspension.",
      },
    ],
  },
  {
    topic: "Cell Phones & Technology",
    items: [
      {
        question: "Is my phone allowed at school?",
        answer:
          "SI is a cell phone-free campus during the school day (9:00 AM onward, including unstructured time). Phones must be in your backpack, either off or on Do Not Disturb. Violations result in confiscation; repeated violations can lead to a parent pickup and suspension.",
      },
      {
        question: "Can the Deans search my phone?",
        answer:
          "Yes. The Deans can check the contents of your phone, iPad, tablet, or computer without parental consent. Refusing to provide passwords results in serious consequences.",
      },
      {
        question: "What about smartwatches and laptops?",
        answer:
          "All electronic devices must only be used to enhance classroom instruction within the parameters set by your teacher.",
      },
    ],
  },
  {
    topic: "Dress Code",
    items: [
      {
        question: "What are the basics of the dress code?",
        answer:
          "Tops: Collared shirt (short or long sleeve) or sweater/sweatshirt covering both shoulders; no plunging necklines; must fall to waistband. Bottoms: Clean, neat, properly fitting; knee-length or longer; no blue denim, leggings, athletic pants, sweatpants, or pajamas on regular days. Outerwear: Any sweatshirt/sweater allowed; hooded outerwear requires a collared shirt underneath. Shoes: Must be worn at all times.",
      },
      {
        question: "What about hair and hats?",
        answer:
          "Unnatural hair coloring that is distracting is not allowed. Hats, caps, hoods, visors, and scarves cannot be worn inside school buildings at any time. Violations may result in the item being confiscated.",
      },
      {
        question: "When can I wear jeans or sweats?",
        answer:
          "Only on SI Pride days or designated spirit days. On those days, blue denim and loose-fitting sweats are allowed, and T-shirts are acceptable.",
      },
    ],
  },
  {
    topic: "Athletics & Eligibility",
    items: [
      {
        question: "What GPA do I need to play a sport?",
        answer:
          "You need a 2.0 GPA on a 4.0 scale from the previous grading period, currently enrolled in 20 semester periods, and making progress toward graduation. This applies at every quarter grading period, not just semesters.",
      },
      {
        question: "What if my GPA falls below 2.0 during a season?",
        answer:
          "You may appeal to the Principal by completing an Athletic Eligibility Contract and presenting it personally. The signed contract goes to the Athletic Office.",
      },
      {
        question: "Do I need to be on campus to participate in after-school activities?",
        answer:
          "Yes. You must be on campus by 11:00 AM to participate in any after-school co-curricular activity that day.",
      },
    ],
  },
  {
    topic: "Community Engagement (Service Hours)",
    items: [
      {
        question: "How many service hours do I need to graduate?",
        answer:
          "75 hours total, completed between freshman year and the summer after junior year. Within those 75 hours, a Core Engagement Experience of 40 hours with one nonprofit organization is required. All activities must be pre-approved by the Arrupe Center for Social Justice.",
      },
      {
        question: "What happens if I don't finish by senior year?",
        answer:
          "You'll be placed on a probationary contract. The extended deadline is the end of the first quarter of senior year. Failure to complete may limit your participation in clubs, sports, and school activities.",
      },
    ],
  },
  {
    topic: "Campus Rules & Daily Life",
    items: [
      {
        question: "Where can I store my instrument?",
        answer:
          "Instrument storage is in the ground floor of the Choral Building, across from the Choral Room. It's open 8:00-9:00 AM and reopens after 3:00 PM.",
      },
      {
        question: "What if my teacher doesn't show up to class?",
        answer:
          "Wait quietly inside or outside the classroom. After the second bell, one student should go to Room 101 to alert the Academic Coordinator or Assistant Principal for Academics. Do not leave unless directed to.",
      },
      {
        question: "When do buildings close?",
        answer: "The Academic Building must be vacated by 4:00 PM; the Student Center by 5:00 PM.",
      },
      {
        question: "Can I use the gym during free periods?",
        answer:
          "Only if you've filled out and submitted a Gym Use Waiver to the Deans Office. Gym use is available before or after the regular school day.",
      },
      {
        question: "What are the locker rules?",
        answer:
          "Lockers remain school property and can be opened at any time by administration. Only locks purchased at school are allowed. Instrument storage has its own separate room.",
      },
    ],
  },
  {
    topic: "Parking & Transportation",
    items: [
      {
        question: "Where can I park?",
        answer:
          "Students cannot park on 37th Avenue between Pacheco and Quintara during class hours (faculty/staff only). The West Sunset lot at Quintara and 40th Ave is also off-limits (SFMTA ticketing/towing applies).",
      },
      {
        question: "Where do I get dropped off?",
        answer:
          "Two drop-off zones are on 37th Avenue. The north zone (between Pacheco and Quintara) blocks through traffic 8:45-9:00 AM. The south zone (between Quintara and Rivera, in front of the gym) is available all day.",
      },
    ],
  },
  {
    topic: "Discipline Essentials",
    items: [
      {
        question: "What is JUG?",
        answer:
          "JUG stands for Justice Under God — it's a more serious form of detention issued by the Deans. Students report early on a school day or assigned Saturday to assist with campus work like clean-up or event setup.",
      },
      {
        question: "What triggers automatic dismissal review?",
        answer:
          "Drug/alcohol sales, gang affiliation, extortion, weapons possession, and repeated/serious misconduct all trigger a Discipline Board review for possible expulsion. Two suspensions in one year also puts you at risk for dismissal.",
      },
      {
        question: "What is the alcohol/drug policy?",
        answer:
          "Any use, possession, or being under the influence — on or off campus — results in disciplinary action up to expulsion. Selling or distributing any controlled substance goes immediately to the Discipline Board for expulsion review. SI can conduct breathalyzer and drug tests at any school event without prior notice.",
      },
    ],
  },
  {
    topic: "Tuition",
    items: [
      {
        question: "How much is tuition for 2025-2026?",
        answer:
          "Tuition is $34,600 for the year. Payment is managed through FACTS Tuition Management and can be paid monthly, bi-annually (July 1 and December 1), or in full (July 1).",
      },
      {
        question: "Is the enrollment deposit refundable?",
        answer:
          "No. The $1,500 deposit is non-refundable. No tuition refunds are made if a student is dismissed, asked to withdraw, or voluntarily withdraws.",
      },
    ],
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("DELETE FROM faq_items");
    await client.query("DELETE FROM faq_topics");

    for (let i = 0; i < FAQ_DATA.length; i++) {
      const { topic, items } = FAQ_DATA[i];
      const topicResult = await client.query(
        `INSERT INTO faq_topics (title, sort_order) VALUES ($1, $2) RETURNING id`,
        [topic, i]
      );
      const topicId = topicResult.rows[0].id;

      for (let j = 0; j < items.length; j++) {
        await client.query(
          `INSERT INTO faq_items (topic_id, question, answer, sort_order) VALUES ($1, $2, $3, $4)`,
          [topicId, items[j].question, items[j].answer, j]
        );
      }
    }

    const totalItems = FAQ_DATA.reduce((sum, t) => sum + t.items.length, 0);
    console.log(`Seeded ${FAQ_DATA.length} FAQ topics with ${totalItems} items`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
