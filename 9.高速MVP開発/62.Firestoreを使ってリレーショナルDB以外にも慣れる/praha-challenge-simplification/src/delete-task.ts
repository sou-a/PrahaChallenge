import repository from "./repository";

const deleteTask = async () => {
  const targetTask = process.argv[2];
  await repository.deleteTask(targetTask);
};

deleteTask();
