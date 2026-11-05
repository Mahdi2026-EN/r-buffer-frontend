import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { AnnouncementCard } from "../../components/public/AnnouncementCard";
import { EmptyState, LoadingState } from "../../components/ui/States";
import { contentService } from "../../services/api";
import type { Announcement } from "../../types";

export function AnnouncementsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentService.getAnnouncements().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{t("announcements.title")}</h1>
        <p className="mt-3 text-base text-ink-500">{t("announcements.subtitle")}</p>
      </div>

      <div className="mt-10">
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title={t("announcements.noAnnouncements")} />
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}