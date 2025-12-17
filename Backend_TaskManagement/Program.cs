using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Backend_TaskManagement.Models;
using Backend_TaskManagement.Service;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "TaskManagement API", Version = "v1" });
    // Cấu hình JWT Bearer cho Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// đảm bảo file appsettings được load 
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
// Cấu hình DBContext
builder.Services.AddDbContext<ProjectHubContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBDefault")));

// Cấu hình dịch vụ Authentication với JWT Bearer
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

//CORS cho React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Thay đổi theo địa chỉ frontend của bạn
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Đăng ký dịch vụ AuthService
builder.Services.AddScoped<IAuthService, AuthService>();
// Đăng ký dịch vụ google auth service
builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddHttpClient();
// đăng ký dịch vụ memory
builder.Services.AddMemoryCache();
// Đăng ký dịch vụ UserService
builder.Services.AddScoped<IUserService, UserService>();
// Đăng ký dịch vụ WorkspaceService
builder.Services.AddScoped<IWorkspaceService, WorkspaceService>();
// Đăng ký dịch vụ SpaceService
builder.Services.AddScoped<ISpaceService, SpaceService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

app.MapControllers();

app.Run();

