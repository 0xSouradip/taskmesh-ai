// Simple long-form page shell for legal and info pages.
export default function Prose({ eyebrow, title, updated, children }) {
  return (
    <article className="w-[min(760px,100%-40px)] mx-auto pt-[140px]">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h1 className="h-page">{title}</h1>
      {updated && <p className="mt-3 text-[14px] text-fg-2">Last updated {updated}</p>}
      <div className="mt-10 space-y-5 text-[16px] text-fg/85 [&_h2]:text-fg [&_h2]:text-[20px] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:pt-4 [&_a]:text-warm [&_a:hover]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1.5">
        {children}
      </div>
    </article>
  );
}
