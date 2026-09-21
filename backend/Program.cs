var builder = WebApplication.CreateBuilder(args);

// get database connection strings
var connectionString = builder.Configuration.GetConnectionString("BMSDB")
    ?? throw new InvalidOperationException("Connecting string 'BMSDB' not found");

// Register ProductRepository with the DI Container


// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
