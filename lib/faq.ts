import { sql } from "@/lib/db";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqTopic {
  title: string;
  items: FaqItem[];
}

export async function getFaq(): Promise<FaqTopic[]> {
  const topics = await sql`
    SELECT id, title FROM faq_topics ORDER BY sort_order, id
  `;
  const result: FaqTopic[] = [];

  for (const topic of topics as { id: number; title: string }[]) {
    const items = await sql`
      SELECT question, answer FROM faq_items
      WHERE topic_id = ${topic.id}
      ORDER BY sort_order, id
    `;
    result.push({
      title: topic.title,
      items: (items as { question: string; answer: string }[]).map((i) => ({
        question: i.question,
        answer: i.answer,
      })),
    });
  }
  return result;
}
