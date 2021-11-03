using Dapper;
using Npgsql;
using System.Collections.Generic;
using BudgeterApi.Models;
using BudgeterApi.Mocks;
using Microsoft.Extensions.Configuration;

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
    private const string RETURN_OBJECT = "id, name, sort_order as SortOrder";

    public CategoryGroupRepository(IConfiguration configuration) : base(configuration) { }

    public IEnumerable<CategoryGroup> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        return connection.Query<CategoryGroup>("SELECT * FROM category_group");
      }
      // return CategoryGroupMock.CategoryGroups;
    }

    public CategoryGroup Create(CategoryGroup categoryGroup)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = $@"INSERT INTO category_group (name, sort_order) 
        VALUES (@Name, @SortOrder)
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
        SET name = @Name, sort_order = @SortOrder
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