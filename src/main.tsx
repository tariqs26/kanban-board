import React from "react"
import ReactDOM from "react-dom/client"
import BoardProvider from "./components/BoardProvider"
import KanbanBoard from "./components/KanbanBoard"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
  <React.StrictMode>
    <BoardProvider>
      <KanbanBoard />
    </BoardProvider>
  </React.StrictMode>
)
