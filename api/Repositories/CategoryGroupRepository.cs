using Dapper;
using Npgsql;
using System.Collections.Generic;
using BudgeterApi.Models;

namespace BudgeterApi.Repositories
{
  public interface ICategoryGroupRepository
  {
    IEnumerable<CategoryGroup> Get();
    CategoryGroup Create(CategoryGroup categoryGroup);
    CategoryGroup Update(CategoryGroup categoryGroup);
    void Delete(int id);
    
  }
  public class CategoryGroupRepository : CoreRepository, ICategoryGroupRepository
  {
    private const string RETURN_OBJECT = "id, name";

    public IEnumerable<CategoryGroup> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        return connection.Query<CategoryGroup>("SELECT * FROM category_groups");
      }
    }

    public CategoryGroup Create(CategoryGroup categoryGroup)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = $@"INSERT INTO category_groups (name) 
        VALUES (@Name)
        RETURNING {RETURN_OBJECT}";
        return connection.QueryFirstOrDefault<CategoryGroup>(sql, categoryGroup);
      }
    }

    public CategoryGroup Update(CategoryGroup categoryGroup)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = $@"UPDATE category_groups
        SET name = @Name
        WHERE id = @Id
        RETURNING {RETURN_OBJECT}";
        return connection.QueryFirstOrDefault<CategoryGroup>(sql, categoryGroup);
      }
    }

    public void Delete(int id)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = @"DELETE FROM category_groups WHERE id = @Id";
        connection.Execute(sql, new { Id = id });
      }
    }
  }
}