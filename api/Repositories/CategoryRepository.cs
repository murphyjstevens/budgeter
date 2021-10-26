using Dapper;
using Npgsql;
using System.Collections.Generic;
using BudgeterApi.Models;

namespace BudgeterApi.Repositories
{
  public interface ICategoryRepository
  {
    IEnumerable<Category> Get();
    IEnumerable<Category> GetSimple();
    Category Create(Category category);
    Category Update(Category category);
    void Delete(int id);
  }
  public class CategoryRepository : CoreRepository, ICategoryRepository
  {
    private const string RETURN_OBJECT = "id, name, budget, category_group_id AS CategoryGroupId";

    public IEnumerable<Category> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        return connection.Query<Category>(
          $@"SELECT c.id, c.name, c.budget, c.category_group_id as CategoryGroupId, coalesce(SUM(t.cost), 0::money) as Spent FROM categories c
LEFT JOIN transactions t ON t.category_id = c.id
GROUP BY c.id, c.name, c.budget, c.category_group_id");
      }
    }

    public IEnumerable<Category> GetSimple()
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        return connection.Query<Category>($"SELECT {RETURN_OBJECT} FROM categories");
      }
    }

    public Category Create(Category category)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = $@"INSERT INTO categories (name, budget, category_group_id) 
        VALUES (@Name, @Budget, @CategoryGroupId)
        RETURNING {RETURN_OBJECT}";
        return connection.QueryFirstOrDefault<Category>(sql, category);
      }
    }

    public Category Update(Category category)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = $@"UPDATE categories
        SET name = @Name, budget = @Budget, category_group_id = @CategoryGroupId
        WHERE id = @Id
        RETURNING {RETURN_OBJECT}";
        return connection.QueryFirstOrDefault<Category>(sql, category);
      }
    }

    public void Delete(int id)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = @"DELETE FROM categories WHERE id = @Id";
        connection.Execute(sql, new { Id = id });
      }
    }
  }
}