import type {ProductListProps} from "@features/product/productTable/index.ts";
import {Input} from "@shared/ui/input.tsx";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel, type SortingState,
  useReactTable
} from "@tanstack/react-table";
import {columns} from "@features/product/productTable/index.ts";
import {useEffect, useMemo, useState} from "react";
import {useIsMobile} from "@shared/hooks/use-mobile.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@shared/ui/table.tsx";
import {isInteractiveTarget} from "@shared/utils";
import {ProductDialog} from "@features/product/productDialog";
import {cn} from "@shared/lib";
import {Button} from "@shared/ui/button.tsx";
import type {Product, DialogMode} from "@shared/types";
import {Label} from "@shared/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@shared/ui/select.tsx";
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ChevronsLeft as ChevronsLeftIcon, ChevronsRight as ChevronsRightIcon } from "lucide-react";

export function ProductTable({data, category, isProductsLoading}: ProductListProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<DialogMode>("create")
  const [initialProduct, setInitialProduct] = useState<Product | undefined>(undefined)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const isMobile = useIsMobile()
  const title = mode === "create" ? "Добавление товара" : "Изменение товара"

  const openCreate = () => {
    setMode("create")
    setInitialProduct(undefined)
    setOpen(true)
  }

  const openEdit = (product: Product) => {
    setMode("edit")
    setInitialProduct(product)
    setOpen(true)
  }

  const productTable = useReactTable({
    data,
    columns: columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: useMemo(() => ({ onEdit: openEdit }), []),
  })

  const rowsCount = productTable.getRowModel().rows.length
  const ROW_H = 30
  const HEAD_H = 30
  const MAX_ROWS = 10
  const enableScroll = rowsCount > MAX_ROWS
  const maxHeightPx = HEAD_H + ROW_H * MAX_ROWS

  useEffect(() => {
    productTable
      .getAllColumns()
      .filter(
        (column) =>
          typeof column.accessorFn !== "undefined" &&
          column.getCanHide()
      )
      .forEach((column) => {
        column.toggleVisibility(!isMobile)
      })
  }, [isMobile, productTable])

  const visibleCols = productTable.getVisibleLeafColumns().length;

  return (
    <div className={cn("w-full flex flex-wrap content-start mb-6", !isMobile && "max-w-[1440px]")}>
      <div className="w-full bg-card rounded-lg p-4 border shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {"Товары"}{category?.name && ` в категории "${category?.name}"`}
            </h3>
            <p className="text-sm text-muted-foreground">
              Управляйте товарами в выбранной категории
            </p>
          </div>
          <Button variant="default" onClick={openCreate} className="shadow-md">
            + Добавить товар
          </Button>
        </div>
        
        <Input
          placeholder="Поиск товаров..."
          value={(productTable.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            productTable.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="mb-0"
        />
      </div>
      
      <div className="flex items-center gap-2 mb-2 hidden">
        <span className="text-xl font-semibold tracking-tight text-foreground">
          {"Товары"}{category?.name && ` в категории "${category?.name}"`}
        </span>
      </div>
      <div className="w-full flex items-center mb-2 hidden">
        <Input
          placeholder="Поиск по названию"
          value={(productTable.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            productTable.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-xs mr-4"
        />
        <div className="ml-auto">
          <div className="ml-auto">
            <Button variant="outline" onClick={openCreate}>Добавить</Button>
          </div>
        </div>
      </div>
      <div className="w-full rounded-lg border overflow-hidden shadow-sm bg-card">
        <div className={cn("overflow-hidden", enableScroll && "overflow-y-auto")} style={enableScroll ? { maxHeight: maxHeightPx } : undefined}>
          <Table className="table-fixed">
            <colgroup>
              <col className="w-12"/>
              {productTable.getVisibleLeafColumns().slice(1, -1).map((col) => (
                <col key={col.id}/>
              ))}
              <col className="w-20"/>
            </colgroup>
            <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
              {productTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="sticky top-0 z-10 font-semibold">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {productTable.getRowModel().rows?.length ? (
                productTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onDoubleClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (isInteractiveTarget(target)) return;
                      const id = row.original.id;
                      if (id) {
                        setMode("edit")
                        setInitialProduct(row.original)
                        setOpen(true)
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isProductsLoading
                ?
                <TableRow>
                  <TableCell colSpan={visibleCols} className="h-32 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Загрузка товаров...</span>
                    </div>
                  </TableCell>
                </TableRow>
                : (
                  <TableRow>
                    <TableCell colSpan={visibleCols} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-4xl">🛍️</div>
                        <div className="font-medium">Пока нет товаров</div>
                        <div className="text-sm">Добавьте первый товар в эту категорию</div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 px-4">
        <div className="hidden flex-1 text-sm text-muted-foreground  mr-25 lg:flex">
          {productTable.getFilteredSelectedRowModel().rows.length} из {productTable.getFilteredRowModel().rows.length} товаров выбрано
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Количество на странице
            </Label>
            <Select
              value={`${productTable.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                productTable.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="w-20" id="rows-per-page">
                <SelectValue placeholder={productTable.getState().pagination.pageSize}/>
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Страница {productTable.getState().pagination.pageIndex + 1} из {productTable.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => productTable.setPageIndex(0)}
              disabled={!productTable.getCanPreviousPage()}
            >
              <span className="sr-only">В начало</span>
              <ChevronsLeftIcon/>
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => productTable.previousPage()}
              disabled={!productTable.getCanPreviousPage()}
            >
              <span className="sr-only">Предыдущая страница</span>
              <ChevronLeftIcon/>
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => productTable.nextPage()}
              disabled={!productTable.getCanNextPage()}
            >
              <span className="sr-only">Следующая страница</span>
              <ChevronRightIcon/>
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => productTable.setPageIndex(productTable.getPageCount() - 1)}
              disabled={!productTable.getCanNextPage()}
            >
              <span className="sr-only">Перейти в конец</span>
              <ChevronsRightIcon/>
            </Button>
          </div>
        </div>
      </div>
      <ProductDialog
        open={open}
        setOpen={setOpen}
        title={title}
        mode={mode}
        product={initialProduct}
        setProduct={setInitialProduct}
        category={category}
      />
    </div>
  )
}