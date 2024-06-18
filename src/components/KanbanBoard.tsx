import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import { useBoard } from "./BoardProvider"
import ColumnContainer from "./ColumnContainer"
import TaskCard from "./TaskCard"
import { Plus } from "./icons"

export default function KanbanBoard() {
  // distinguish between dragging and clicking delete button by adding distance to activation constraint
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // px
      },
    })
  )
  const {
    columns,
    tasks,
    createColumn,
    setActiveColumn,
    setActiveTask,
    swap,
    activeColumn,
    activeTask,
    swapTask,
  } = useBoard()

  const items = columns.map((column) => column.id)

  function handleDragStart(e: DragStartEvent) {
    if (e.active.data.current?.type == "Column") {
      setActiveColumn(e.active.data.current.column)
      return
    }

    if (e.active.data.current?.type == "Task") 
      setActiveTask(e.active.data.current.task)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveColumn(null)
    setActiveTask(null)
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveAColumn = active.data.current?.type === "Column"
    if (!isActiveAColumn) return

    const oldIndex = items.indexOf(active.id)
    const newIndex = items.indexOf(over.id)
    swap(oldIndex, newIndex)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task"
    const isOverATask = over.data.current?.type === "Task"

    if (!isActiveATask) return

    const taskItems = tasks.map((task) => task.id)

    if (isActiveATask && isOverATask) {
      const activeIndex = taskItems.indexOf(active.id)
      const overIndex = taskItems.indexOf(over.id)

      if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
        tasks[activeIndex].columnId = tasks[overIndex].columnId
        return swapTask(activeIndex, overIndex - 1)
      }

      return swapTask(activeIndex, overIndex)
    }

    const isOverAColumn = over.data.current?.type === "Column"

    if (isActiveATask && isOverAColumn) {
      const activeIndex = taskItems.indexOf(active.id)

      tasks[activeIndex].columnId = overId

      swapTask(activeIndex, activeIndex)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="m-auto flex min-h-screen items-center overflow-x-auto overflow-y-hidden px-10">
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={items}>
              {columns.map((column) => (
                <ColumnContainer key={column.id} column={column} />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createColumn}
            className="h-14 min-w-[350px] rounded-lg bg-background border-2 border-column-background p-4 ring-indigo-500 hover:ring-2 transition-all hover:bg-column-background/80 flex items-center gap-2 justify-center group"
          >
            <Plus />
            Add Column
          </button>
        </div>
      </div>
      {createPortal(
        <DragOverlay>
          {activeColumn !== null && <ColumnContainer column={activeColumn} />}
          {activeTask !== null && <TaskCard task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  )
}
