import { useState } from "react";

type ColumnTitle = "Backlog" | "To Do" | "In Progress" | "Done";

interface Column {
  id: number;
  title: ColumnTitle;
}

interface Task {
  id: number;
  name: string;
  column: ColumnTitle;
}

const initialTasks: Task[] = [
  { id: 0, name: "Some task 1", column: "Backlog" },
  { id: 1, name: "Some task 2", column: "Backlog" },
];

const columns: Column[] = [
  { id: 0, title: "Backlog" },
  { id: 1, title: "To Do" },
  { id: 2, title: "In Progress" },
  { id: 3, title: "Done" },
];

const kanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [input, setInput] = useState<string>("");

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

  const columnOrder: ColumnTitle[] = [
    "Backlog",
    "To Do",
    "In Progress",
    "Done",
  ];

  // create task
  const createTask = () => {
    const newTask: Task = {
      id: Date.now(),
      name: input.trim(),
      column: "Backlog"
    }
    setTasks((prev) => [...prev, newTask]);
  };

  // delete task
  const deleteTask = (taskId: number) => {
    setTasks((prev) => {
      return prev.filter((task) => task.id !== taskId);
    })
  };

  // moveTask
  const moveTask = (taskId: number, direction: "forward" | "backward") => {
    setTasks((prev) =>
     prev.map((task) => {
      if (task.id !== taskId) return task;
      const currentIndex = columnOrder.indexOf(task.column);
      const newIndex = direction === "forward" ? Math.min(currentIndex + 1, columnOrder.length -1) : Math.max(currentIndex -1, 0);
      return { ...task, column: columnOrder[newIndex] };
     })
    )
  };

  return (
    <main>
      <header>Kanban Board</header>
      <div className="flex w-full h-[500px] justify-center">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              placeholder="create a new task"
            />
            <button
              onClick={createTask}
              className="bg-green-500 h-[50px] w-[200px] rounded"
            >
              Create
            </button>
          </div>
          <div className="flex flex-row h-full">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex flex-col border rounded m-4 w-[250px] h-full p-2"
              >
                <div className="border-b h-[50px] w-full flex justify-center p-3">
                  <h2>{column.title}</h2>
                </div>
                {/* task item */}
                <div className="flex flex-col pt-2">
                  {tasksByColumn[column.title].map((task) => (
                    <div
                      key={task.id}
                      className="border rounded min-h-[150px] min-2-[100px] m-2 p-4"
                    >
                      <p>{task.name}</p>
                      <div className="flex flex-row space-x-2 mt-2">
                        <button onClick={() => moveTask(task.id, "backward")} className="rounded min-w-[50px] cursor-pointer bg-green-600">
                          Back
                        </button>
                        <button onClick={() => moveTask(task.id, "forward")} className="rounded min-w-[50px] cursor-pointer bg-green-600">
                          Next
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="rounded min-w-[50px] cursor-pointer bg-red-600"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default kanbanBoard;
