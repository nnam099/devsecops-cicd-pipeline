class TaskController {
  constructor({
    createTask, listTasks, getTask, updateTask, deleteTask,
  }) {
    this.createTask = createTask;
    this.listTasks = listTasks;
    this.getTask = getTask;
    this.updateTask = updateTask;
    this.deleteTask = deleteTask;
  }

  create = async (req, res, next) => {
    try {
      const { title, description } = req.body;
      // ownerId comes from the verified JWT (req.userId), NEVER from
      // the request body — prevents a client from creating tasks on
      // another user's behalf.
      const task = await this.createTask.execute({ title, description, ownerId: req.userId });
      res.status(201).json({ data: task });
    } catch (err) {
      next(err);
    }
  };

  list = async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const tasks = await this.listTasks.execute({ ownerId: req.userId, limit, offset });
      res.status(200).json({ data: tasks });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const task = await this.getTask.execute({ taskId: req.params.id, requesterId: req.userId });
      res.status(200).json({ data: task });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { title, description, status } = req.body;
      const task = await this.updateTask.execute({
        taskId: req.params.id,
        requesterId: req.userId,
        title,
        description,
        status,
      });
      res.status(200).json({ data: task });
    } catch (err) {
      next(err);
    }
  };

  remove = async (req, res, next) => {
    try {
      await this.deleteTask.execute({ taskId: req.params.id, requesterId: req.userId });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { TaskController };
