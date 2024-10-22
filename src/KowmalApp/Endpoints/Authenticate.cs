using KowmalApp.Stores;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace KowmalApp.Endpoints;

using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;
using System.Text.Json;
using System.IO;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System;

public class Authenticate
{
    [Function("Authenticate")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "authenticate")] HttpRequestData req, ILogger log)
    {
        log.LogInformation("Processing the auth request.");
        try
        {
            var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var loginRequest = JsonConvert.DeserializeObject<LoginRequest>(requestBody);

            if (loginRequest == null)
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                await unauthorizedResponse.WriteStringAsync("Invalid username or password.");
                return unauthorizedResponse;
            }

            // Validate the credentials
            var user = UserStore.GetUser(loginRequest.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash))
            {
                var unauthorizedResponse = req.CreateResponse(HttpStatusCode.Unauthorized);
                await unauthorizedResponse.WriteStringAsync("Invalid username or password.");
                return unauthorizedResponse;
            }

            // Generate JWT token
            var token = GenerateJwtToken(user.Username);

            // Return the token
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new { token });
            return response;
        }
        catch (Exception ex)
        {
            log.LogWarning("Unhandled exception. {message}", ex.Message);
            var unauthorizedResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await unauthorizedResponse.WriteStringAsync("Invalid username or password.");
            return unauthorizedResponse;
        }
    }

    private string GenerateJwtToken(string username)
    {
        var secretKey = Environment.GetEnvironmentVariable("JwtSecretKey");
        var issuer = Environment.GetEnvironmentVariable("JwtIssuer");
        var audience = Environment.GetEnvironmentVariable("JwtAudience");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new System.Security.Claims.ClaimsIdentity(new[]
            {
                new System.Security.Claims.Claim("username", username),
                // Add other claims if needed
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}