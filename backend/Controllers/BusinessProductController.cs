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
  public async Task<IActionResult> CreateAsync(CreateProductRequest request)
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    var productId = await _productService.CreateAsync(business.Id, request);
    return Ok(productId);
  }

  [HttpGet]
  public async Task<IActionResult> GetByBusinessIdAsync()
  {
    var business = (BusinessRecord)HttpContext.Items["Business"]!;

    var products = await _productService.GetByBusinessIdAsync(business.Id);
    return Ok(products); 
  }

  [HttpGet("{productId}")]
  public async Task<IActionResult> GetByIdAsync(int productId)
  {
    var product = await _productService.GetByIdAsync(productId);
    return Ok(product);
  }

  [HttpPatch("{productId}")]
  [Authorize]
  public async Task<IActionResult> UpdateAsync(int productId, UpdateProductRecord request)
  {
    var updated = await _productService.UpdateAsync(productId, request);

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
  public async Task<IActionResult> DeleteByIdAsync(int productId)
  {
    await _productService.DeleteByIdAsync(productId);

    return NoContent();
  }
}