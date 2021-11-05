using System.Collections.Generic;
using BudgeterApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BudgeterApi.Repositories;
using System.Threading.Tasks;

namespace BudgeterApi.Controllers
{
  [ApiController]
  public class TransactionController : ControllerBase
  {
    private readonly ILogger<TransactionController> _logger;
    private readonly ITransactionRepository _repository;

    public TransactionController(ILogger<TransactionController> logger, ITransactionRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    [HttpGet]
    [Route("transactions")]
    public async Task<IEnumerable<Transaction>> Get()
    {
      return await _repository.Get();
    }

    [HttpGet]
    [Route("accounts/{accountId}/transactions")]
    public async Task<IEnumerable<Transaction>> GetByAccount(int accountId)
    {
      return await _repository.GetByAccount(accountId);
    }

    [HttpGet]
    [Route("categories/{categoryId}/transactions")]
    public async Task<IEnumerable<Transaction>> GetByCategory(int categoryId)
    {
      return await _repository.GetByCategory(categoryId);
    }

    [HttpPost]
    [Route("transactions")]
    public async Task<Transaction> Create(Transaction transaction)
    {
      return await _repository.Create(transaction);
    }

    [HttpPut]
    [Route("transactions")]
    public async Task<Transaction> Update(Transaction transaction)
    {
      return await _repository.Update(transaction);
    }

    [HttpDelete]
    [Route("transactions/{id}")]
    public async Task Delete(int id)
    {
      await _repository.Delete(id);
    }
  }
}
