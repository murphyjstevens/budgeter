using Api.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace Api.Repositories;

public interface IBudgetRepository
{
  Task<IEnumerable<Budget>> Get(DateTime date);
  Task<double> GetReadyToBudget();
  Task<Budget> Save(Budget budget);
  Task Delete(int id);
}
public class BudgetRepository : CoreRepository, IBudgetRepository
{
  private const string RETURN_OBJECT = "id, assigned, date, category_id as CategoryId";

  public BudgetRepository(IConfiguration configuration) : base(configuration) { }

  public async Task<IEnumerable<Budget>> Get(DateTime date)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      return await connection.QueryAsync<Budget>(
        $@"SELECT b.id, b.assigned, b.date, b.category_id as CategoryId FROM budget b
LEFT JOIN category c ON c.id = b.category_id
WHERE EXTRACT(MONTH FROM b.date) = EXTRACT(MONTH FROM @Date) AND EXTRACT(YEAR FROM b.date) = EXTRACT(YEAR FROM @Date)", new { Date = date });
    }
  }

  public async Task<double> GetReadyToBudget() {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      return await connection.QuerySingleAsync<double>(
        $@"SELECT SUM(amount) AS ReadyToBudget
FROM
(
SELECT SUM(cost) AS amount FROM transaction WHERE category_id IS null

UNION ALL

SELECT (SUM(assigned) * -1) AS amount FROM budget
) AS derived"
      );
    }
  }

  public async Task<Budget> Save(Budget budget)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string findIdSql = $@"SELECT id FROM budget
        WHERE category_id = @CategoryId AND EXTRACT(MONTH FROM @Date) = EXTRACT(MONTH FROM date) AND EXTRACT(YEAR FROM @Date) = EXTRACT(YEAR FROM date)";
      int? budgetId = await connection.QueryFirstOrDefaultAsync<int>(findIdSql, budget);
      
      string sql;
      if (budgetId == null || budgetId == 0)
      {
        sql = $@"INSERT INTO budget (assigned, date, category_id) 
          VALUES (@Assigned, @Date, @CategoryId)
          RETURNING {RETURN_OBJECT}";
      }
      else
      {
        budget.Id = budgetId.Value;
        sql = $@"UPDATE budget
          SET assigned = @Assigned
          WHERE id = @Id
          RETURNING {RETURN_OBJECT}";
      }
      return await connection.QueryFirstOrDefaultAsync<Budget>(sql, budget);
    }
  }

  public async Task Delete(int id)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = @"DELETE FROM budget WHERE id = @Id";
      await connection.ExecuteAsync(sql, new { Id = id });
    }
  }
}
