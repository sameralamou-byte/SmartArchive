import { Icon, Input } from "../../../components";
import { useLocale } from "../../../providers/LocaleProvider";
import type { DocumentsSort, MimeFilter } from "./documentsState";

interface DocumentsToolbarProps {
  query: string;
  mimeFilter: MimeFilter;
  sort: DocumentsSort;
  onQueryChange: (value: string) => void;
  onMimeFilterChange: (value: MimeFilter) => void;
  onSortChange: (value: DocumentsSort) => void;
}

const FILTER_LABELS: Record<MimeFilter, "app.documents.filterAll" | "app.documents.filterPdf" | "app.documents.filterImage" | "app.documents.filterOther"> = {
  all: "app.documents.filterAll",
  pdf: "app.documents.filterPdf",
  image: "app.documents.filterImage",
  other: "app.documents.filterOther",
};

const SORT_LABELS: Record<DocumentsSort, "app.documents.sortNewest" | "app.documents.sortOldest" | "app.documents.sortName"> = {
  newest: "app.documents.sortNewest",
  oldest: "app.documents.sortOldest",
  name: "app.documents.sortName",
};

export default function DocumentsToolbar({
  query,
  mimeFilter,
  sort,
  onQueryChange,
  onMimeFilterChange,
  onSortChange,
}: DocumentsToolbarProps) {
  const { t } = useLocale();

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
      <div>
        <label htmlFor="documents-search" className="mb-2 block text-caption font-bold uppercase tracking-wide text-text-muted">
          {t("app.documents.searchLabel")}
        </label>
        <Input
          id="documents-search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t("app.documents.searchPlaceholder")}
          startAdornment={<Icon name="spark" size={16} />}
        />
      </div>
      <div>
        <label htmlFor="documents-filter" className="mb-2 block text-caption font-bold uppercase tracking-wide text-text-muted">
          {t("app.documents.filterLabel")}
        </label>
        <select
          id="documents-filter"
          value={mimeFilter}
          onChange={(event) => onMimeFilterChange(event.target.value as MimeFilter)}
          className="w-full min-w-[10rem] rounded-md border border-border bg-surface-page px-3.5 py-2.5 text-body-m text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-accent"
        >
          {(Object.keys(FILTER_LABELS) as MimeFilter[]).map((option) => (
            <option key={option} value={option}>
              {t(FILTER_LABELS[option])}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="documents-sort" className="mb-2 block text-caption font-bold uppercase tracking-wide text-text-muted">
          {t("app.documents.sortLabel")}
        </label>
        <select
          id="documents-sort"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as DocumentsSort)}
          className="w-full min-w-[10rem] rounded-md border border-border bg-surface-page px-3.5 py-2.5 text-body-m text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-accent"
        >
          {(Object.keys(SORT_LABELS) as DocumentsSort[]).map((option) => (
            <option key={option} value={option}>
              {t(SORT_LABELS[option])}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
