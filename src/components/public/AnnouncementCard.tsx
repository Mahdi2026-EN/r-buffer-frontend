import { Calendar, Megaphone } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import type { Announcement } from "../../types";

export function AnnouncementCard({ announcement, compact }: { announcement: Announcement; compact?: boolean }) {
  const { t, locale } = useI18n();
  return (
    <article className="rounded-xl border border-ink-200 bg-white p-5">
      <div className="flex items-center gap-2 text-xs text-ink-500">
        <Megaphone className="h-3.5 w-3.5" />
        <span>{t("announcements.publishedOn")}</span>
        <span>·</span>
        <Calendar className="h-3.5 w-3.5" />
        <time>{announcement.createdAt}</time>
      </div>
      <h3 className="mt-3 text-base font-semibold text-ink-900">{announcement.title[locale]}</h3>
      {!compact && (
        <p className="mt-2 text-sm leading-relaxed text-ink-500 line-clamp-3">{announcement.body[locale]}</p>
      )}
    </article>
  );
}