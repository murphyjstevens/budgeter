using System.Collections.Generic;
using System.Threading.Tasks;
using BudgeterApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BudgeterApi.Repositories;
using System;

namespace BudgeterApi.Controllers
{
  [ApiController]
  [Route("budgets")]
  public class BudgetController : ControllerBase
  {
    private readonly ILogger<BudgetController> _logger;
    private readonly IBudgetRepository _repository;

    public BudgetController(ILogger<BudgetController> logger, IBudgetRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    [HttpGet]
    public async Task<IEnumerable<Budget>> Get([FromQuery]DateTime date)
    {
      return await _repository.Get(date);
    }

    [HttpPost]
    public async Task<Budget> Create(Budget budget)
    {
      return await _repository.Create(budget);
    }

    [HttpPut]
    public async Task<Budget> Update(Budget budget)
    {
      return await _repository.Update(budget);
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task Delete(int id)
    {
      await _repository.Delete(id);
    }
  }
}
