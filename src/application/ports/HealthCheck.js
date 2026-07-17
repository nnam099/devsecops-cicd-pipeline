/**
 * Port for checking whether external dependencies required to serve traffic
 * are available. Implementations must not expose connection details.
 */
class HealthCheck {
  async check() {
    throw new Error('Not implemented');
  }
}

module.exports = { HealthCheck };
