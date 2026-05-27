import {
  Header,
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "react-aria-components";

function groupByJurisdiction(pdfs) {
  const groups = {};
  for (const pdf of pdfs) {
    const key = pdf.jurisdiction || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(pdf);
  }
  return groups;
}

export function PdfList({ pdfs, selectedId, onSelect }) {
  const grouped = groupByJurisdiction(pdfs);

  return (
    <ListBox
      aria-label="PDF library"
      className="pdf-list"
      selectionMode="single"
      selectionBehavior="replace"
      selectedKeys={selectedId ? new Set([selectedId]) : new Set()}
      onSelectionChange={(keys) => {
        const id = [...keys][0];
        if (id) onSelect(id);
      }}
    >
      {Object.entries(grouped).map(([jurisdiction, items]) => (
        <ListBoxSection key={jurisdiction} className="pdf-list-section">
          <Header className="pdf-list-header">{jurisdiction}</Header>
          {items.map((pdf) => (
            <ListBoxItem
              key={pdf.id}
              id={pdf.id}
              textValue={pdf.title}
              className="pdf-list-item"
            >
              <span className="pdf-item-title">{pdf.title}</span>
              {pdf.code && <span className="pdf-item-code">{pdf.code}</span>}
            </ListBoxItem>
          ))}
        </ListBoxSection>
      ))}
    </ListBox>
  );
}
