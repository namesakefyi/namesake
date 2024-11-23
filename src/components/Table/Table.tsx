import { ChevronUp } from "lucide-react";
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
  ColumnResizer,
  Group,
  ResizableTableContainer,
  type RowProps,
  type TableBodyProps,
  type TableHeaderProps,
  type TableProps,
  composeRenderProps,
  useTableOptions,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Checkbox } from "../Checkbox";
import { composeTailwindRenderProps, focusRing } from "../utils";

export function Table(props: TableProps) {
  return (
    <ResizableTableContainer className="max-h-full max-w-full overflow-auto scroll-pt-[2.281rem] relative border border-gray-dim rounded-lg">
      <AriaTable {...props} className="border-separate border-spacing-0" />
    </ResizableTableContainer>
  );
}

const columnStyles = tv({
  extend: focusRing,
  base: "px-3 flex-1 flex gap-1 items-center overflow-hidden",
});

const resizerStyles = tv({
  extend: focusRing,
  base: "w-px px-[8px] translate-x-[8px] box-content py-1 h-6 bg-clip-content bg-gray-3 dark:bg-graydark-3 forced-colors:bg-[ButtonBorder] cursor-col-resize rounded resizing:bg-blue-9 forced-colors:resizing:bg-[Highlight] resizing:w-[2px] resizing:pl-[7px] -outline-offset-2",
});

export function TableColumn(props: ColumnProps) {
  return (
    <AriaColumn
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "[&:hover]:z-20 [&:focus-within]:z-20 text-start text-sm font-semibold text-gray-dim cursor-default border-b border-gray-dim",
      )}
    >
      {composeRenderProps(
        props.children,
        (children, { allowsSorting, sortDirection }) => (
          <div className="flex items-center">
            <Group role="presentation" tabIndex={-1} className={columnStyles}>
              <span className="truncate">{children}</span>
              {allowsSorting && (
                <span
                  className={`w-4 h-4 flex items-center justify-center transition ${
                    sortDirection === "descending" ? "rotate-180" : ""
                  }`}
                >
                  {sortDirection && (
                    <ChevronUp
                      aria-hidden
                      className="w-4 h-4 text-gray-dim forced-colors:text-[ButtonText]"
                    />
                  )}
                </span>
              )}
            </Group>
            {!props.width && <ColumnResizer className={resizerStyles} />}
          </div>
        ),
      )}
    </AriaColumn>
  );
}

export function TableHeader<T extends object>(props: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();

  return (
    <AriaTableHeader
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "sticky top-0 z-10 bg-gray forced-colors:bg-[Canvas] rounded-t-lg",
      )}
    >
      {/* Add extra columns for drag and drop and selection. */}
      {allowsDragging && <TableColumn />}
      {selectionBehavior === "toggle" && (
        <AriaColumn
          width={40}
          minWidth={40}
          className="text-start text-sm font-semibold cursor-default p-2"
        >
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </AriaColumn>
      )}
      <Collection items={props.columns}>{props.children}</Collection>
    </AriaTableHeader>
  );
}

const rowStyles = tv({
  extend: focusRing,
  base: "group/row relative cursor-default select-none -outline-offset-2 text-sm text-gray-normal selected:bg-purple-subtle",
});

export function TableRow<T extends object>({
  id,
  columns,
  children,
  ...otherProps
}: RowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <AriaRow id={id} {...otherProps} className={rowStyles}>
      {allowsDragging && (
        <TableCell>
          <Button slot="drag">≡</Button>
        </TableCell>
      )}
      {selectionBehavior === "toggle" && (
        <TableCell>
          <Checkbox slot="selection" />
        </TableCell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

const cellStyles = tv({
  extend: focusRing,
  base: "border-b border-gray-dim group-last/row:border-b-0 group-selected/row:border-purple-dim [:has(+[data-selected])_&]:border-purple-dim p-2 truncate -outline-offset-2",
});

export function TableCell(props: CellProps) {
  return <AriaCell {...props} className={cellStyles} />;
}

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return <AriaTableBody {...props} />;
}
