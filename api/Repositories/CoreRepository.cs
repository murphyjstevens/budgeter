using Microsoft.Extensions.Configuration;

namespace BudgeterApi.Repositories;

public abstract class CoreRepository
{
  public string ConnectionString { get; }

  public CoreRepository(IConfiguration configuration) {
    ConnectionString = configuration.GetConnectionString("Budgeter");
  }
}
