import { arrayMove } from "@dnd-kit/sortable"
import { createContext, useContext, useMemo, useState } from "react"
import type { Column, Task, Id } from "../types"
import { generateId } from "../utils"

type ActiveColumn = Column | null
type ActiveTask = Task | null

type BoardContext = {
  columns: Column[]
  tasks: Task[]
  activeColumn: ActiveColumn
  setActiveColumn: React.Dispatch<React.SetStateAction<ActiveColumn>>
  activeTask: ActiveTask
  setActiveTask: React.Dispatch<React.SetStateAction<ActiveTask>>
  createColumn: () => void
  editColumnTitle: (id: Id, title: string) => void
  swap: (oldIndex: number, newIndex: number) => void
  swapTask: (oldIndex: number, newIndex: number) => void
  deleteColumn: (id: Id) => void
  createTask: (columnId: Id) => void
  editTaskContent: (id: Id, content: string) => void
  deleteTask: (id: Id) => void
}

const boardContext = createContext<BoardContext | null>(null)

export default function BoardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [columns, setColumns] = useState<Column[]>([])
  const [activeColumn, setActiveColumn] = useState<ActiveColumn>(null)
  const [activeTask, setActiveTask] = useState<ActiveTask>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  const values = useMemo(
    () => ({
      columns,
      activeColumn,
      tasks,
      activeTask,
      setActiveColumn,
      setActiveTask,
      createColumn() {
        const newColumn = {
          id: generateId(),
          title: `Column ${columns.length + 1}`,
        }

        setColumns([...columns, newColumn])
      },
      editColumnTitle(id: Id, title: string) {
        setColumns(
          columns.map((column) =>
            column.id !== id ? column : { ...column, title }
          )
        )
      },
      swap(oldIndex: number, newIndex: number) {
        setColumns((columns) => arrayMove(columns, oldIndex, newIndex))
      },
      deleteColumn(id: Id) {
        setColumns(columns.filter((column) => column.id !== id))
        setTasks(tasks.filter((task) => task.columnId !== id))
      },
      createTask(columnId: Id) {
        const newTask = {
          id: generateId(),
          columnId,
          content: `Task ${tasks.length + 1}`,
        }

        setTasks([...tasks, newTask])
      },
      swapTask(oldIndex: number, newIndex: number) {
        setTasks((tasks) => arrayMove(tasks, oldIndex, newIndex))
      },
      editTaskContent(id: Id, content: string) {
        setTasks(
          tasks.map((task) => (task.id !== id ? task : { ...task, content }))
        )
      },
      deleteTask(id: Id) {
        setTasks(tasks.filter((task) => task.id !== id))
      },
    }),
    [columns, activeColumn, tasks, activeTask]
  )

  return (
    <boardContext.Provider value={values}>{children}</boardContext.Provider>
  )
}

export const useBoard = () => {
  const context = useContext(boardContext)

  if (context === null) {
    throw new Error("useBoard must be used within the BoardProvider")
  }

  return context
}
