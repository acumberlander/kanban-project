import { useState } from "react";

type ColumnTitle = "Backlog" | "To Do" | "In Progress" | "Done";

interface Task {
  id: number;
  name: string;
  column: ColumnTitle;
}

interface Column {
  id: number;
  title: ColumnTitle;
}

const initialTasks: Task[] = [
  { id: 0, name: "Do something", column: "Backlog" },
  { id: 1, name: "Do nothing", column: "Backlog" },
];

const columns: Column[] = [
  { id: 0, title: "Backlog" },
  { id: 1, title: "To Do" },
  { id: 2, title: "In Progress" },
  { id: 3, title: "Done" },
];

const columnOrder: ColumnTitle[] = ["Backlog", "To Do", "In Progress", "Done"];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskName, setNewTaskName] = useState("");

  const getTasksByColumn = (taskList: Task[]) => {
    const result: Record<ColumnTitle, Task[]> = {
      Backlog: [],
      "To Do": [],
      "In Progress": [],
      Done: [],
    };

    for (const task of taskList) {
      result[task.column].push(task);
    }

    return result;
  };

  const tasksByColumn = getTasksByColumn(tasks);

  const moveTask = (taskId: number, direction: "forward" | "backward") => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const currentIndex = columnOrder.indexOf(task.column);
        const newIndex =
          direction === "forward"
            ? Math.min(currentIndex + 1, columnOrder.length - 1)
            : Math.max(currentIndex - 1, 0);
        return { ...task, column: columnOrder[newIndex] };
      })
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const addTask = () => {
    if (!newTaskName.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      name: newTaskName.trim(),
      column: "Backlog",
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskName("");
  };

  return (
    <div>
      <main className="flex flex-col gap-8 items-center p-12">
        <header className="text-3xl font-bold">Kanban Board</header>

        <div className="flex gap-4 mb-8">
          <input
            className="border px-2 py-1 rounded w-64"
            placeholder="New task name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded"
            onClick={addTask}
          >
            Add Task
          </button>
        </div>

        <div className="w-full h-[500px] flex flex-row space-x-4 overflow-auto">
          {columns.map((column) => (
            <div key={column.id} className="w-1/4 min-w-[200px] h-full border p-4 rounded">
              <div className="border-b pb-2 mb-2">
                <h2 className="text-2xl font-bold">{column.title}</h2>
              </div>
              <div className="flex flex-col gap-2">
                {tasksByColumn[column.title].length > 0 ? (
                  tasksByColumn[column.title].map((task) => (
                    <div
                      key={task.id}
                      className="p-2 border border-gray-400 rounded bg-white shadow-sm min-w-[150px] flex justify-between items-center flex-col flex-wrap"
                    >
                      <p>{task.name}</p>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => moveTask(task.id, "backward")}
                          disabled={task.column === "Backlog"}
                          className="px-2 text-gray-500 hover:text-black disabled:opacity-30"
                          title="Move Left"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => moveTask(task.id, "forward")}
                          disabled={task.column === "Done"}
                          className="px-2 text-gray-500 hover:text-black disabled:opacity-30"
                          title="Move Right"
                        >
                          →
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="px-2 text-red-500 hover:text-red-700"
                          title="Delete Task"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
