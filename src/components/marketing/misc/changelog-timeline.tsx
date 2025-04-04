import { Timeline } from '@/components/ui/timelime';
import { changelogEntries } from '@/utils/constants/changelog';

export default function ChangelogTimeline() {
  const data = changelogEntries.map((entry) => ({
    title: entry.title,
    content: entry.content,
    date: entry.date,
    slug: entry.slug,
  }));

  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
