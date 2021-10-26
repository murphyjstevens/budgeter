namespace BudgeterApi.Repositories
{
  public abstract class CoreRepository
  {
    public string ConnectionString { get; } = Config.ConnectionString;
  }
}