using Api.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Repositories;

public interface IAccountRepository
{
  Task<IEnumerable<Account>> Get();
  Task<Account> FindByUrl(string url);
  Task<Account> Create(Account account);
}
public class AccountRepository : CoreRepository, IAccountRepository
{
  private const string RETURN_OBJECT = "id, name, url";

  public AccountRepository(IConfiguration configuration) : base(configuration) { }

  public async Task<IEnumerable<Account>> Get()
  {
    using (var connection = new NpgsqlConnection(ConnectionString)) {
      await connection.OpenAsync();
      return await connection.QueryAsync<Account>("SELECT * FROM account");
    }
  }

  public async Task<Account> FindByUrl(string url)
  {
    using (var connection = new NpgsqlConnection(ConnectionString)) {
      await connection.OpenAsync();
      return await connection.QueryFirstOrDefaultAsync<Account>("SELECT * FROM account WHERE url = @Url", new { Url = url });
    }
  }

  public async Task<Account> Create(Account account)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = $@"INSERT INTO account (name, url) 
      VALUES (@Name, @Url)
      RETURNING {RETURN_OBJECT}";
      return await connection.QueryFirstOrDefaultAsync<Account>(sql, account);
    }
  }
}
