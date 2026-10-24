using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using BusinessManagementApi.Data;
using BusinessManagementApi.Services;
using BusinessManagementApi.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Get the database connection string
var connectionString = builder.Configuration.GetConnectionString("BusinessManagementDB")
    ?? throw new InvalidOperationException("Connection string 'BusinessManagementDB' not found");

// Register the UnitOfWork
builder.Services.AddScoped<UnitOfWork>();

// Register the NpgsqlDataSource (a connection pool + factory, safe to share)
builder.Services.AddNpgsqlDataSource(connectionString);

// Register Repositories with the DI container
// Migrated to NpgsqlDataSource: no lambda needed
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<SaleRepository>();
builder.Services.AddScoped<DebitSaleRepository>();
builder.Services.AddScoped<InventoryRepository>();
builder.Services.AddScoped<InventoryTransactionRepository>();
builder.Services.AddScoped<DashboardRepository>();

// Not migrated yet: still use the connection string
// When you migrate one, change it to: builder.Services.AddScoped<XRepository>();
builder.Services.AddScoped<UserRepository>(sp => new UserRepository(connectionString));
builder.Services.AddScoped<BusinessRepository>(sp => new BusinessRepository(connectionString));

// Register Services with the DI container
builder.Services.AddScoped<BusinessService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<SaleService>();
builder.Services.AddScoped<InventoryService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<InventoryTransactionService>();

// Add services to the container
builder.Services.AddControllers();

builder.Services.AddMemoryCache();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.Authority = "https://kayecsjjsjxhhtlaqavh.supabase.co/auth/v1";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://kayecsjjsjxhhtlaqavh.supabase.co/auth/v1",
            ValidateAudience = false, // later: set to true and add ValidAudience = "authenticated"
            ValidateIssuerSigningKey = true,
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Custom middleware: ORDER MATTERS
// The user must be found first, because BusinessAccessMiddleware needs it
app.UseMiddleware<UserExistsMiddleware>();
app.UseMiddleware<BusinessAccessMiddleware>();

app.MapControllers();

app.Run();