using BusinessManagementApi.Models;
using BusinessManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementApi.Controllers;

[ApiController]
[Route("api/business/{businessId}/products")]
[Authorize]
public class BusinessProductController : ControllerBase
{
  private readonly ProductService _productService;

  public BusinessProductController(ProductService productService)
  {
    _productService = productService;
  }

  [HttpPost]
  public IActionResult Create(CreateProductRecord newProduct)
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    var productId = _productService.Create(business.Id, newProduct);
    return Ok(productId);
  }

  [HttpGet]
  public IActionResult GetByBusinessId()
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    var products = _productService.GetByBusinessId(business.Id);
    return Ok(products); 
  }

  [HttpGet("{productId}")]
  public async Task<IActionResult> GetById(int productId)
  {
    var product = await _productService.GetById(productId);
    return Ok(product);
  }

  [HttpPatch("{productId}")]
  [Authorize]
  public IActionResult Update(int productId, UpdateProductRecord request)
  {
    var updated = _productService.Update(productId, request);

    if (!updated)
    {
        return NotFound(new
        {
          message = "Product not found or nothing to update."
        });
    }

    return NoContent();
  }

  [HttpDelete("{productId}")]
  public IActionResult DeleteById(int productId)
  {
    _productService.DeleteById(productId);

    return NoContent();
  }
}