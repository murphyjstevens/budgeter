using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgeterApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BudgeterApi.Mocks;
using BudgeterApi.Repositories;

namespace BudgeterApi.Controllers
{
  [ApiController]
  [Route("Categories")]
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
    public IEnumerable<Category> Get()
    {
      return _repository.Get();
    }

    [HttpGet]
    [Route("Simple")]
    public IEnumerable<Category> GetSimple()
    {
      return _repository.GetSimple();
    }

    [HttpPost]
    public Category Create(Category category)
    {
      return _repository.Create(category);
    }

    [HttpPut]
    public Category Update(Category category)
    {
      return _repository.Update(category);
    }

    [HttpDelete]
    [Route("{id}")]
    public void Delete(int id)
    {
      _repository.Delete(id);
    }
  }
}
