import {
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import {columns} from "@features/category/categoryList/index.ts";
import type {CategoryListProps} from "@features/category/categoryList/index.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@shared/ui/table.tsx";
import {cn, useAppDispatch} from "@shared/lib";
import {setCategoryId} from "@entities/product";
import {Input} from "@shared/ui/input.tsx";
import {CategoryForm} from "@features/category/categoryForm";
import {isInteractiveTarget} from "@shared/utils";
import {useMemo, useState} from "react";
import type {Category, DialogMode} from "@shared/types";
import {Button} from "@shared/ui/button.tsx";

export function CategoryList({data, isCategoriesLoading, isNarrow}: CategoryListProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<DialogMode>("create")
  const [initialCategory, setInitialCategory] = useState<Category | null>(null)

  const openCreate = () => {
    setMode("create")
    setInitialCategory(null)
    setOpen(true)
  }

  const openEdit = (category: Category) => {
    setMode("edit")
    setInitialCategory(category)
    setOpen(true)
  }

  const title = mode === "create" ? "Добавление категории" : "Изменение категории"

  const categoryTable = useReactTable({
    data,
    columns: columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: useMemo(() => ({ onEdit: openEdit }), []),
  })

  const rowsCount = categoryTable.getRowModel().rows.length
  const ROW_H = 44      // средняя высота трока (px)
  const HEAD_H = 44     // высота заголовка (px)
  const MAX_ROWS = 5
  const enableScroll = rowsCount > MAX_ROWS
  const maxHeightPx = HEAD_H + ROW_H * MAX_ROWS

  return (
    <div className={cn(
      "w-full flex flex-wrap content-start mb-6 mr-6",
      !isNarrow && "max-w-[500px]"
    )}>
      <div className="w-full bg-card rounded-lg p-4 border shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Категории товаров
            </h3>
            <p className="text-sm text-muted-foreground">
              Организуйте товары по категориям
            </p>
          </div>
          <Button variant="default" onClick={openCreate} className="shadow-md">
            + Добавить категорию
          </Button>
        </div>
        
        <Input
          placeholder="Поиск категорий..."
          value={(categoryTable.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            categoryTable.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="mb-4"
        />
      </div>
      
      <div className="flex items-center h-8 gap-2 mb-2 hidden">
        <span className="text-xl font-semibold tracking-tight text-foreground">
          Категории
        </span>
      </div>
      <div className="w-full flex items-center mb-2 hidden">
        <Input
          placeholder="Поиск по названию"
          value={(categoryTable.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            categoryTable.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-xs mr-4"
        />
        <div className="ml-auto">
          <Button variant="outline" onClick={openCreate}>Добавить</Button>
        </div>
      </div>
      <div className="w-full rounded-lg border overflow-hidden shadow-sm bg-card">
        <div
          className={cn(enableScroll && "overflow-y-auto")}
          style={enableScroll ? { maxHeight: maxHeightPx } : undefined}
        >
          <Table className="table-fixed">
            <colgroup>
              {categoryTable.getVisibleLeafColumns().slice(0, -1).map((col) => (
                <col key={col.id} />
              ))}
              <col className="w-42" />
            </colgroup>
            <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
              {categoryTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="sticky top-0 z-10 pl-4 font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {categoryTable.getRowModel().rows?.length ? (
                categoryTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (isInteractiveTarget(target)) return;
                      const category = row.original;
                      dispatch(setCategoryId(category.id));
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="pl-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isCategoriesLoading
                ?
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Загрузка категорий...</span>
                    </div>
                  </TableCell>
                </TableRow>
                : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="text-4xl">📂</div>
                        <div className="font-medium">
                          {sorting.length ? "Категории не найдены" : "Пока нет категорий"}
                        </div>
                        <div className="text-sm">
                          {sorting.length ? "Попробуйте изменить поисковый запрос" : "Создайте первую категорию для организации товаров"}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      </div>
      <CategoryForm
        open={open}
        setOpen={setOpen}
        category={initialCategory ?? undefined}
        title={title}
        mode={mode}
      />
    </div>
  )
}