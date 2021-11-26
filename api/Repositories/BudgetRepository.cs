using BudgeterApi.Models;
using BudgeterApi.Requests;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace BudgeterApi.Repositories
{
  public interface IBudgetRepository
  {
    Task<IEnumerable<Budget>> Get(DateTime date);
    Task<Budget> Create(Budget budget);
    Task<Budget> Update(Budget budget);
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

    public async Task<Budget> Create(Budget budget)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        await connection.OpenAsync();
        string sql = $@"INSERT INTO budget (assigned, date, category_id) 
        VALUES (@Assigned, @Date, @CategoryId)
        RETURNING {RETURN_OBJECT}";
        return await connection.QueryFirstOrDefaultAsync<Budget>(sql, budget);
      }
    }

    public async Task<Budget> Update(Budget budget)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        await connection.OpenAsync();
        string sql = $@"UPDATE budget
        SET assigned = Assigned, date = @Date, category_id = @CategoryId
        WHERE id = @Id
        RETURNING {RETURN_OBJECT}";
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
}