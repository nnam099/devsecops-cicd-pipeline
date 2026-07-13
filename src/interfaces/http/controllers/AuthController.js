/**
 * Thin controller: parses HTTP request, delegates to use-case,
 * shapes HTTP response. Contains NO business logic — that discipline
 * is what makes the application/domain layers independently testable
 * and keeps this file trivial to review for security purposes.
 */
class AuthController {
  constructor({ registerUser, loginUser }) {
    this.registerUser = registerUser;
    this.loginUser = loginUser;
  }

  register = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.registerUser.execute({ email, password });
      res.status(201).json({ data: user });
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await this.loginUser.execute({ email, password });
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { AuthController };
