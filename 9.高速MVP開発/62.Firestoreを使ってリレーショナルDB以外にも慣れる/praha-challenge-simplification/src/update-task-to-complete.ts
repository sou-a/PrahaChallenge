import repository from "./repository";

const updateTaskToComplete = async () => {
  const targetUser = process.argv[2];
  const targetTask = process.argv[3];
  const users = await repository.updateTaskToComplete(targetUser, targetTask);
};

updateTaskToComplete();
