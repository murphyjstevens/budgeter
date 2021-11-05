using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BudgeterApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BudgeterApi.Repositories;
using BudgeterApi.Requests;

namespace BudgeterApi.Controllers
{
  [ApiController]
  [Route("categories")]
  public class CategoryController : ControllerBase
  {
    private readonly ILogger<CategoryController> _logger;
    private readonly ICategoryRepository _repository;

    public CategoryController(ILogger<CategoryController> logger, ICategoryRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    [HttpGet]
    public async Task<IEnumerable<Category>> Get()
    {
      return await _repository.Get();
    }

    [HttpGet]
    [Route("Simple")]
    public async Task<IEnumerable<Category>> GetSimple()
    {
      return await _repository.GetSimple();
    }

    [HttpPost]
    public async Task<Category> Create(Category category)
    {
      return await _repository.Create(category);
    }

    [HttpPut]
    public async Task<Category> Update(Category category)
    {
      return await _repository.Update(category);
    }

    [HttpPatch]
    [Route("reorder")]
    public async Task<Tuple<Category, Category>> Reorder(ReorderRequest request)
    {
      return await _repository.Reorder(request);
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task Delete(int id)
    {
      await _repository.Delete(id);
    }
  }
}
