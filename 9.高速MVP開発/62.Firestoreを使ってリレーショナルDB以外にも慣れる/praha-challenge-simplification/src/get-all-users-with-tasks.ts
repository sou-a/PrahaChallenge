import repository from "./repository";

const getAllUsersWithTasks = async () => {
  const tasks = await repository.getTasks();
  const users = await repository.getUsers();
  const allUsersWithTasks = users.map((user) => {
    return {
      id: user.id,
      name: user.name,
      tasks: user.taskStatuses.map((taskStatus) => {
        const task = tasks.find((task) => task.id === taskStatus.id);
        return {
          id: taskStatus.id,
          title: task ? task.title : "",
          status: taskStatus.status,
        };
      }),
    };
  });
  console.dir(allUsersWithTasks, { depth: null });
};

getAllUsersWithTasks();
