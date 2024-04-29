using Moq;
using Moq.Protected;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using Xunit;
using Microsoft.Extensions.Logging;
using Vox.Server.Controllers;
using Vox.Server.Services;
using Vox.Server.DTOs.Organizer;
using Newtonsoft.Json;
using System.Net;
using System.Text;


namespace Vox.Server.Tests
{
    public class OrganizerControllerTests
    {
        private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
        private readonly HttpClient _httpClient;
        private readonly Mock<IOrganizerService> _mockOrganizerService;
        private readonly Mock<ILogger<OrganizerController>> _mockLogger;
        private readonly OrganizerController _controller;

        public OrganizerControllerTests()
        {
            _mockHttpMessageHandler = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            _httpClient = new HttpClient(_mockHttpMessageHandler.Object)
            {
                BaseAddress = new Uri("https://api-sport-events.php9-01.test.voxteneo.com/")
            };
            _mockOrganizerService = new Mock<IOrganizerService>();
            _mockLogger = new Mock<ILogger<OrganizerController>>();
            _controller = new OrganizerController(_mockOrganizerService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetOrganizerById_ReturnsOkResult_WhenOrganizerIsFound()
        {
            // Arrange
            int id = 466;
            string token = "Bearer token";
            var organizerDto = new OrganizerDto
            {
                Id = id,
                OrganizerName = "Prof. Dante Wolff Sr.",
                ImageLocation = "media/image/dryBvHebD4JxLiDhXIQBQrusTNZYHvHGbkAKlaxK.jpg"
            };

            _mockOrganizerService.Setup(service => service.GetOrganizerByIdAsync(id, token))
                .ReturnsAsync(organizerDto);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = token;
            _controller.ControllerContext.HttpContext = httpContext;

            // Act
            var result = await _controller.GetOrganizerById(id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedOrganizer = Assert.IsType<OrganizerDto>(okResult.Value);
            Assert.Equal(organizerDto.Id, returnedOrganizer.Id);
            Assert.Equal(organizerDto.OrganizerName, returnedOrganizer.OrganizerName);
            Assert.Equal(organizerDto.ImageLocation, returnedOrganizer.ImageLocation);
        }

        [Fact]
        public async Task GetOrganizerById_ReturnsNotFoundResult_WhenOrganizerIsNotFound()
        {
            // Arrange
            int id = 200;
            string token = "Bearer token";

            _mockOrganizerService.Setup(service => service.GetOrganizerByIdAsync(id, token))
                .ReturnsAsync((OrganizerDto)null);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = token;
            _controller.ControllerContext.HttpContext = httpContext;

            // Act
            var result = await _controller.GetOrganizerById(id);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var responseValue = notFoundResult.Value;
            Assert.Equal($"No query results for model [App\\Organizer] {id}", (responseValue.GetType().GetProperty("message").GetValue(responseValue, null)));
            Assert.Equal(404, (responseValue.GetType().GetProperty("status_code").GetValue(responseValue, null)));
        }

        [Fact]
        public async Task CreateOrganizer_ReturnsOkResult_WhenOrganizerIsCreated()
        {
            // Arrange
            string token = "Bearer token";
            var createOrganizerDto = new CreateOrganizerDto
            {
                OrganizerName = "New Organizer",
                ImageLocation = "media/image/newOrganizerImage.jpg"
            };

            var newOrganizerDto = new OrganizerDto
            {
                Id = 1610,
                OrganizerName = createOrganizerDto.OrganizerName,
                ImageLocation = createOrganizerDto.ImageLocation
            };

            var mockResponseContent = new StringContent(JsonConvert.SerializeObject(newOrganizerDto), Encoding.UTF8, "application/json");

            var mockResponse = new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = mockResponseContent
            };

            _mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(mockResponse);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = token;
            _controller.ControllerContext.HttpContext = httpContext;

            // Act
            var result = await _controller.CreateOrganizer(createOrganizerDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedOrganizer = Assert.IsType<OrganizerDto>(okResult.Value);
            Assert.Equal(newOrganizerDto.Id, returnedOrganizer.Id);
            Assert.Equal(newOrganizerDto.OrganizerName, returnedOrganizer.OrganizerName);
            Assert.Equal(newOrganizerDto.ImageLocation, returnedOrganizer.ImageLocation);
        }
    }
}
