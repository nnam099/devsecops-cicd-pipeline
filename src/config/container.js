/**
 * Minimal, explicit dependency-injection wiring (manual composition
 * root — no DI framework/magic). Every use-case receives concrete
 * infrastructure adapters here, and ONLY here. This is the single
 * place that knows both "ports" and "adapters" exist; everywhere
 * else in the codebase depends only on the ports.
 *
 * Why manual DI instead of a framework (e.g., InversifyJS)?
 * Trade-off: a DI framework adds an extra dependency (SCA surface)
 * and reflection/decorator metadata "magic" that is harder to audit
 * and trace during a security review. For a project of this size,
 * explicit composition is more auditable and has zero extra runtime
 * dependencies — a deliberate simplicity choice, not an oversight.
 */
const { PgUserRepository } = require('../infrastructure/database/repositories/PgUserRepository');
const { PgTaskRepository } = require('../infrastructure/database/repositories/PgTaskRepository');
const { PostgresHealthCheck } = require('../infrastructure/database/PostgresHealthCheck');
const { BcryptPasswordHasher } = require('../infrastructure/auth/BcryptPasswordHasher');
const { JwtTokenService } = require('../infrastructure/auth/JwtTokenService');

const { RegisterUser } = require('../application/use-cases/auth/RegisterUser');
const { LoginUser } = require('../application/use-cases/auth/LoginUser');
const { CreateTask } = require('../application/use-cases/tasks/CreateTask');
const { ListTasks } = require('../application/use-cases/tasks/ListTasks');
const { GetTask } = require('../application/use-cases/tasks/GetTask');
const { UpdateTask } = require('../application/use-cases/tasks/UpdateTask');
const { DeleteTask } = require('../application/use-cases/tasks/DeleteTask');

function buildContainer() {
  const userRepository = new PgUserRepository();
  const taskRepository = new PgTaskRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();
  const healthCheck = new PostgresHealthCheck();

  return {
    healthCheck,
    tokenService,
    useCases: {
      registerUser: new RegisterUser({ userRepository, passwordHasher }),
      loginUser: new LoginUser({ userRepository, passwordHasher, tokenService }),
      createTask: new CreateTask({ taskRepository }),
      listTasks: new ListTasks({ taskRepository }),
      getTask: new GetTask({ taskRepository }),
      updateTask: new UpdateTask({ taskRepository }),
      deleteTask: new DeleteTask({ taskRepository }),
    },
  };
}

module.exports = { buildContainer };
