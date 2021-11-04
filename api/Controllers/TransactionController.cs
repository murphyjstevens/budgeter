using System.Collections.Generic;
using BudgeterApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BudgeterApi.Repositories;

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
    public IEnumerable<Transaction> Get()
    {
      return _repository.Get();
    }

    [HttpGet]
    [Route("accounts/{accountId}/transactions")]
    public IEnumerable<Transaction> GetByAccount(int accountId)
    {
      return _repository.GetByAccount(accountId);
    }

    [HttpGet]
    [Route("categories/{categoryId}/transactions")]
    public IEnumerable<Transaction> GetByCategory(int categoryId)
    {
      return _repository.GetByCategory(categoryId);
    }

    [HttpPost]
    [Route("transactions")]
    public Transaction Create(Transaction transaction)
    {
      return _repository.Create(transaction);
    }

    [HttpPut]
    [Route("transactions")]
    public Transaction Update(Transaction transaction)
    {
      return _repository.Update(transaction);
    }

    [HttpDelete]
    [Route("transactions/{id}")]
    public void Delete(int id)
    {
      _repository.Delete(id);
    }
  }
}
