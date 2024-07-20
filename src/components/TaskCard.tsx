import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import type { Task } from "../types"
import { cn } from "../utils"
import { useBoard } from "./BoardProvider"
import { Trash } from "./icons"

type Props = Readonly<{
  task: Task
}>

export default function TaskCard({ task }: Props) {
  const { deleteTask, editTaskContent } = useBoard()
  const [editMode, setEditMode] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const toggleEditMode = () => {
    setEditMode((prev) => !prev)
  }

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-background p-4 rounded-md flex items-center ring-2 ring-transparent transition-all cursor-grab relative group ring-inset h-[90px] opacity-50 border-2 border-indigo-500 shrink-0"
      />
    )

  return (
    <button
      ref={setNodeRef}
      className="bg-background p-4 rounded-md flex items-center ring-2 ring-transparent transition-all cursor-grab relative group ring-inset hover:ring-indigo-500 h-[90px] text-left shrink-0 w-full"
      style={style}
      onClick={toggleEditMode}
      {...listeners}
      {...attributes}
    >
      {editMode ? (
        <textarea
          className="px-2 py-1 rounded-md outline-none ring-2 ring-transparent focus:ring-indigo-500/50 transition-all w-full bg-transparent resize-none"
          value={task.content}
          autoFocus
          onClick={(e) => {
            e.stopPropagation()
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode()
          }}
          onChange={(e) => editTaskContent(task.id, e.currentTarget.value)}
          onBlur={toggleEditMode}
          onFocus={(e) => {
            const lengthOfInput = e.target.value.length
            return e.target.setSelectionRange(lengthOfInput, lengthOfInput)
          }}
        />
      ) : (
        <p className="whitespace-pre-wrap overflow-x-auto overflow-y-auto task h-[90%] w-full">
          {task.content}
        </p>
      )}
      <button
        type="button"
        className={cn(
          "rounded-md px-2 py-1 hover:bg-column-background text-gray-500 hover:text-red-500 transition-colors absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:block",
          editMode && "group-hover:hidden"
        )}
        onClick={() => deleteTask(task.id)}
      >
        <Trash />
      </button>
    </button>
  )
}
