import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiDraggable,
} from "@remixicon/react";
import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  Button,
  type CellProps,
  Collection,
  type ColumnProps,
  type RowProps,
  type TableBodyProps,
  type TableHeaderProps,
  type TableProps,
  useTableOptions,
} from "react-aria-components";
import { Checkbox } from "../Checkbox";
import "./Table.css";
import clsx from "clsx";

export function Table({ className, ...props }: TableProps) {
  return <AriaTable className={clsx("namesake-table", className)} {...props} />;
}

export function Column(
  props: Omit<ColumnProps, "children"> & { children?: React.ReactNode },
) {
  return (
    <AriaColumn
      className={clsx("namesake-table-column", props.className)}
      {...props}
    >
      {({ allowsSorting, sortDirection }) => (
        <div className="column-header">
          {props.children}
          {allowsSorting && (
            <span aria-hidden="true" className="sort-indicator">
              {sortDirection === "ascending" ? (
                <RiArrowUpSLine />
              ) : (
                <RiArrowDownSLine />
              )}
            </span>
          )}
        </div>
      )}
    </AriaColumn>
  );
}

export function TableHeader<T extends object>({
  columns,
  children,
  className,
  ...props
}: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();

  return (
    <AriaTableHeader
      className={clsx("namesake-table-header", className)}
      {...props}
    >
      {/* Add extra columns for drag and drop and selection. */}
      {allowsDragging && <AriaColumn />}
      {selectionBehavior === "toggle" && (
        <AriaColumn width={40} minWidth={0}>
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </AriaColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  );
}

export function Row<T extends object>({
  id,
  columns,
  children,
  className,
  ...props
}: RowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <AriaRow
      id={id}
      className={clsx("namesake-table-row", className)}
      {...props}
    >
      {allowsDragging && (
        <Cell>
          <Button slot="drag">
            <RiDraggable size={16} />
          </Button>
        </Cell>
      )}
      {selectionBehavior === "toggle" && (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return <AriaTableBody {...props} />;
}

export function Cell({ className, ...props }: CellProps) {
  return (
    <AriaCell className={clsx("namesake-table-cell", className)} {...props} />
  );
}
