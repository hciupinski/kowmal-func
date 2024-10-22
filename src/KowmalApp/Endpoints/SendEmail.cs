using KowmalApp.Models;
using Newtonsoft.Json;

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
        var data = JsonConvert.DeserializeObject<ContactFormData>(requestBody);

        var apiKey = Environment.GetEnvironmentVariable("SendGridApiKey");
        var client = new SendGridClient(apiKey);

        var senderEmail = Environment.GetEnvironmentVariable("SenderIdentityAddress");
        var senderName = Environment.GetEnvironmentVariable("SenderIdentityName");
        var contactAddress = Environment.GetEnvironmentVariable("ContactAddress");
        
        var from = new EmailAddress(senderEmail, senderName);
        var subject = $"Kowmal.com: New message from: {data.Name} {data.Message}";
        var to = new EmailAddress(contactAddress, senderName);

        var content = new EmailContent(data.Name, data.Email, data.Message);
        
        var msg = MailHelper.CreateSingleTemplateEmail(
            from,
            to,
            Environment.GetEnvironmentVariable("SendGridTemplateId"),
            content);

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

    private record EmailContent(string SenderName, string SenderEmail, string Message);
}