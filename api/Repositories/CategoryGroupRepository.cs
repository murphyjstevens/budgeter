using Dapper;
using Npgsql;
using System.Collections.Generic;
using BudgeterApi.Models;
using BudgeterApi.Mocks;
using Microsoft.Extensions.Configuration;
using System;
using BudgeterApi.Requests;
using static Dapper.SqlMapper;
using System.Linq;

namespace BudgeterApi.Repositories
{
  public interface ICategoryGroupRepository
  {
    IEnumerable<CategoryGroup> Get();
    CategoryGroup Create(CategoryGroup categoryGroup);
    CategoryGroup Update(CategoryGroup categoryGroup);
    Tuple<CategoryGroup, CategoryGroup> Reorder(ReorderRequest request);
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
        return connection.Query<CategoryGroup>($"SELECT {RETURN_OBJECT} FROM category_group");
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
        string sql = $@"UPDATE category_group
        SET name = @Name, sort_order = @SortOrder
        WHERE id = @Id
        RETURNING {RETURN_OBJECT}";
        return connection.QueryFirstOrDefault<CategoryGroup>(sql, categoryGroup);
      }
    }

    public Tuple<CategoryGroup, CategoryGroup> Reorder(ReorderRequest request)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = $@"UPDATE category_group
            SET sort_order = @Item1SortOrder
            WHERE id = @Item1Id
            RETURNING {RETURN_OBJECT};
            
            UPDATE category_group
            SET sort_order = @Item2SortOrder
            WHERE id = @Item2Id
            RETURNING {RETURN_OBJECT};";

        GridReader gridReader = connection.QueryMultiple(sql, new {
            Item1Id = request.Item1.Id,
            Item1SortOrder = request.Item1.SortOrder,
            Item2Id = request.Item2.Id,
            Item2SortOrder = request.Item2.SortOrder
        });

        CategoryGroup item1 = gridReader.Read<CategoryGroup>().First();
        CategoryGroup item2 = gridReader.Read<CategoryGroup>().First();

        return new Tuple<CategoryGroup, CategoryGroup>(item1, item2);
      }
    }

    public void Delete(int id)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = @"DELETE FROM category_group WHERE id = @Id";
        connection.Execute(sql, new { Id = id });
      }
    }
  }
}