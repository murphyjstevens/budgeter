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
  public interface ICategoryRepository
  {
    Task<IEnumerable<Category>> Get();
    Task<IEnumerable<Category>> GetSimple();
    Task<Category> Create(Category category);
    Task<Category> Update(Category category);
    Task<Tuple<Category, Category>> Reorder(ReorderRequest request);
    Task Delete(int id);
  }
  public class CategoryRepository : CoreRepository, ICategoryRepository
  {
    private const string RETURN_OBJECT = "id, name, sort_order as SortOrder, category_group_id AS CategoryGroupId";

    public CategoryRepository(IConfiguration configuration) : base(configuration) { }

    public async Task<IEnumerable<Category>> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        await connection.OpenAsync();
        return await connection.QueryAsync<Category>(
          $@"SELECT c.id, c.name, c.sort_order as SortOrder, c.category_group_id as CategoryGroupId, coalesce(SUM(t.cost), 0::money) as Spent FROM category c
LEFT JOIN transaction t ON t.category_id = c.id
GROUP BY c.id, c.name, c.category_group_id");
      }
    }

    public async Task<IEnumerable<Category>> GetSimple()
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        await connection.OpenAsync();
        return await connection.QueryAsync<Category>($"SELECT {RETURN_OBJECT} FROM category");
      }
    }

    public async Task<Category> Create(Category category)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        await connection.OpenAsync();
        string sql = $@"INSERT INTO category (name, budget, sort_order, category_group_id) 
        VALUES (@Name, @Budget, @SortOrder, @CategoryGroupId)
        RETURNING {RETURN_OBJECT}";
        return await connection.QueryFirstOrDefaultAsync<Category>(sql, category);
      }
    }

    public async Task<Category> Update(Category category)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        await connection.OpenAsync();
        string sql = $@"UPDATE category
        SET name = @Name, budget = @Budget, sort_order = @SortOrder, category_group_id = @CategoryGroupId
        WHERE id = @Id
        RETURNING {RETURN_OBJECT}";
        return await connection.QueryFirstOrDefaultAsync<Category>(sql, category);
      }
    }

    public async Task<Tuple<Category, Category>> Reorder(ReorderRequest request)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        await connection.OpenAsync();
        string sql = $@"UPDATE category
            SET sort_order = @Item1SortOrder
            WHERE id = @Item1Id
            RETURNING {RETURN_OBJECT};
            
            UPDATE category
            SET sort_order = @Item2SortOrder
            WHERE id = @Item2Id
            RETURNING {RETURN_OBJECT};";

        GridReader gridReader = await connection.QueryMultipleAsync(sql, new {
            Item1Id = request.Item1.Id,
            Item1SortOrder = request.Item1.SortOrder,
            Item2Id = request.Item2.Id,
            Item2SortOrder = request.Item2.SortOrder
        });

        Category item1 = (await gridReader.ReadAsync<Category>()).First();
        Category item2 = (await gridReader.ReadAsync<Category>()).First();

        return new Tuple<Category, Category>(item1, item2);
      }
    }

    public async Task Delete(int id)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        await connection.OpenAsync();
        string sql = @"DELETE FROM category WHERE id = @Id";
        await connection.ExecuteAsync(sql, new { Id = id });
      }
    }
  }
}