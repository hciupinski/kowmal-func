using KowmalApp.Models;

namespace KowmalApp.Endpoints;

using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Text.Json;
using System.IO;

public class SendEmail
{
    private readonly ILogger _logger;

    public SendEmail(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<SendEmail>();
    }

    [Function("SendEmail")]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "SendEmail")] HttpRequestData req)
    {
        _logger.LogInformation("Processing SendEmail request.");

        var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        var data = JsonSerializer.Deserialize<ContactFormData>(requestBody);

        var apiKey = Environment.GetEnvironmentVariable("SendGridApiKey");
        var client = new SendGridClient(apiKey);

        var from = new EmailAddress(data.Email, data.Name);
        var subject = "New Contact Form Submission";
        var to = new EmailAddress("blacksmith@example.com", "Blacksmith Master");
        var plainTextContent = data.Message;
        var htmlContent = $"<p>{data.Message}</p>";
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

        var sendGridResponse = await client.SendEmailAsync(msg);

        var response = req.CreateResponse();

        if (sendGridResponse.IsSuccessStatusCode)
        {
            response.StatusCode = System.Net.HttpStatusCode.OK;
            await response.WriteStringAsync("Email sent successfully.");
        }
        else
        {
            _logger.LogError($"SendGrid Error: {sendGridResponse.StatusCode}");
            response.StatusCode = System.Net.HttpStatusCode.InternalServerError;
            await response.WriteStringAsync("Failed to send email.");
        }

        return response;
    }
}