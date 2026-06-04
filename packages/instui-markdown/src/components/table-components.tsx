import { Table } from "@instructure/ui-table/v11_7";
import { View } from "@instructure/ui-view";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { compareTableCellValues, textFromNode } from "../helpers.tsx";

export type TableSortDirection = "ascending" | "descending" | "none";

interface TableSort {
  registerHeader: (headerId: string) => number;
  sortBy: number | null;
  sortDirection: TableSortDirection;
  requestSort: (index: number) => void;
}

export const TableSortContext = createContext<TableSort | null>(null);

interface TableComponentOptions {
  tableLayout: "auto" | "fixed" | "stacked";
  tableHover: boolean;
  tableSortable: boolean;
}

export function createTableComponent(options: TableComponentOptions) {
  return ({ children }: { children?: ReactNode }) => {
    const [sortBy, setSortBy] = useState<number | null>(options.tableSortable ? 0 : null);
    const [sortDirection, setSortDirection] = useState<TableSortDirection>("ascending");
    const headerIndexByIdRef = useRef(new Map<string, number>());
    const nextHeaderIndexRef = useRef(0);

    const registerHeader = useCallback((headerId: string) => {
      const existing = headerIndexByIdRef.current.get(headerId);
      if (existing !== undefined) {
        return existing;
      }
      const index = nextHeaderIndexRef.current;
      nextHeaderIndexRef.current += 1;
      headerIndexByIdRef.current.set(headerId, index);
      return index;
    }, []);

    const requestSort = useCallback(
      (index: number) => {
        if (sortBy === index) {
          setSortDirection(sortDirection === "ascending" ? "descending" : "ascending");
          return;
        }
        setSortBy(index);
        setSortDirection("ascending");
      },
      [sortBy, sortDirection],
    );

    return (
      <TableSortContext.Provider value={{ registerHeader, sortBy, sortDirection, requestSort }}>
        <View as="div" overflowX="auto">
          <Table
            caption=""
            margin="small 0"
            layout={
              (options.tableLayout === "stacked" ? "auto" : options.tableLayout) as "auto" | "fixed"
            }
            hover={options.tableHover}
          >
            {children}
          </Table>
        </View>
      </TableSortContext.Provider>
    );
  };
}

export function createTheadComponent() {
  return ({ children }: { children?: ReactNode }) => {
    const rows = Children.toArray(children).filter((child): child is ReactElement =>
      isValidElement(child),
    );
    return <Table.Head>{rows as never}</Table.Head>;
  };
}

export function createTbodyComponent(options: { tableSortable: boolean }) {
  return ({ children }: { children?: ReactNode }) => {
    const tableSort = useContext(TableSortContext);
    const rows = Children.toArray(children).filter((child): child is ReactElement =>
      isValidElement(child),
    );
    if (!options.tableSortable || !tableSort || tableSort.sortBy === null) {
      return <Table.Body>{rows as never}</Table.Body>;
    }

    const sortIndex = tableSort.sortBy;
    const sortedRows = [...rows].toSorted((leftRow, rightRow) => {
      const leftCells = Children.toArray((leftRow.props as { children?: ReactNode }).children);
      const rightCells = Children.toArray((rightRow.props as { children?: ReactNode }).children);
      const leftValue = textFromNode(leftCells[sortIndex] ?? "");
      const rightValue = textFromNode(rightCells[sortIndex] ?? "");
      const result = compareTableCellValues(leftValue, rightValue);
      return tableSort.sortDirection === "ascending" ? result : -result;
    });

    return <Table.Body>{sortedRows as never}</Table.Body>;
  };
}

export function createTrComponent() {
  return ({ children }: { children?: ReactNode }) => {
    const cells = Children.toArray(children).filter((child): child is ReactElement =>
      isValidElement(child),
    );
    return <Table.Row>{cells as never}</Table.Row>;
  };
}

export function createThComponent(options: { tableSortable: boolean }) {
  return ({ children }: { children?: ReactNode }) => {
    const tableSort = useContext(TableSortContext);
    const headerId = useId();
    const sortIndex = tableSort?.registerHeader(headerId) ?? -1;
    const isActive = tableSort?.sortBy === sortIndex;
    const sortDirection = isActive ? tableSort.sortDirection : "none";
    return (
      <Table.ColHeader
        id={headerId}
        sortDirection={options.tableSortable ? sortDirection : undefined}
        onRequestSort={
          options.tableSortable && tableSort
            ? () => {
                tableSort.requestSort(sortIndex);
              }
            : undefined
        }
      >
        {children}
      </Table.ColHeader>
    );
  };
}

export function createTdComponent() {
  return ({ children }: { children?: ReactNode }) => <Table.Cell>{children}</Table.Cell>;
}
