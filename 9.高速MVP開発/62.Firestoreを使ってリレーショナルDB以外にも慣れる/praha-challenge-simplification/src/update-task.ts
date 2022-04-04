import repository from "./repository";

const updateTask = async () => {
  const targetTask = process.argv[2];
  const taskTitle = process.argv[3];
  const users = await repository.updateTask({
    id: targetTask,
    title: taskTitle,
  });
};

updateTask();
