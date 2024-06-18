import { useState } from "react"
import { useSortable, SortableContext } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Column } from "../types"
import { useBoard } from "./BoardProvider"
import { Plus, Trash } from "./icons"
import TaskCard from "./TaskCard"

export default function ColumnContainer({ column }: { column: Column}) {
  const [editMode, setEditMode] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  })

  const { deleteColumn, editColumnTitle, createTask, tasks } = useBoard()

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const filteredTasks = tasks.filter((task) => task.columnId === column.id)

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="bg-column-background w-[350px] max-h-[500px] h-[500px] flex flex-col opacity-50 border-2 border-indigo-500 rounded-md"
      />
    )
  }

  return (
    <div
      className="bg-column-background w-[350px] max-h-[500px] h-[500px] flex flex-col rounded-md"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <header className="bg-background text-lg cursor-grab rounded-t-md p-3 font-semibold  flex items-center gap-2">
        <p className="px-2 py-1 text-sm bg-column-background rounded-full">
          {filteredTasks.length}
        </p>
        {editMode ? (
          <input
            defaultValue={column.title}
            className="bg-column-background focus:outline-none ring-2 ring-transparent focus:ring-indigo-500 flex-grow px-2 py-1 rounded-md"
            autoFocus
            onKeyDown={(e) => {
              if (e.key !== "Enter" || e.currentTarget.value === "") return
              editColumnTitle(column.id, e.currentTarget.value)
              setEditMode(false)
            }}
            onBlur={() => setEditMode(false)}
          />
        ) : (
          <p onClick={() => setEditMode(true)} className="flex-grow px-2 py-1">
            {column.title}
          </p>
        )}
        <button
          className="ml-auto rounded-md px-2 py-1 hover:bg-column-background text-gray-500 hover:text-red-500 transition-colors"
          onClick={() => deleteColumn(column.id)}
        >
          <Trash />
        </button>
      </header>
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-y-auto task overflow-x-hidden">
        <SortableContext items={filteredTasks.map((task) => task.id)}>
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
      <button
        onClick={() => createTask(column.id)}
        className="rounded-md bg-column-background py-2 px-4 font-medium ring-indigo-500 hover:ring-2 transition-all hover:bg-column-background/80 flex items-center gap-2 group"
      >
        <Plus />
        Add Task
      </button>
    </div>
  )
}
