using Xunit;
using Moq;
using System.Threading.Tasks;
using Vox.Server.Controllers;
using Vox.Server.Services;
using Microsoft.Extensions.Logging;
using Vox.Server.DTOs.User.RegisterUser;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Vox.Server.DTOs.User.LoginUser;
using System.Net;
using System.Text;
using Moq.Protected;

namespace Vox.Server.Tests
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _mockAuthService;
        private readonly Mock<ILogger<AuthController>> _mockLogger;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _mockAuthService = new Mock<IAuthService>();
            _mockLogger = new Mock<ILogger<AuthController>>();
            _controller = new AuthController(_mockAuthService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task RegisterUser_ReturnsOkResult_WhenUserIsRegisteredSuccessfully()
        {
            // Arrange
            var registerUserDto = new RegisterUserDto
            {
                FirstName = "Test",
                LastName = "User",
                Email = "testuser@example.com",
                Password = "Test@1234!@",
                RepeatPassword = "Test@1234!@"
            };

            var registeredUserDto = new RegisteredUserDto
            {
                Id = 1,
                FirstName = registerUserDto.FirstName,
                LastName = registerUserDto.LastName,
                Email = registerUserDto.Email
            };

            _mockAuthService.Setup(service => service.RegisterUserAsync(registerUserDto))
            .ReturnsAsync(registeredUserDto);

            // Act
            var result = await _controller.RegisterUser(registerUserDto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsType<RegisteredUserDto>(okResult.Value);
            var returnedUser = okResult.Value as RegisteredUserDto;
            Assert.Equal(registeredUserDto.Id, returnedUser.Id);
            Assert.Equal(registeredUserDto.FirstName, returnedUser.FirstName);
            Assert.Equal(registeredUserDto.LastName, returnedUser.LastName);
            Assert.Equal(registeredUserDto.Email, returnedUser.Email);
        }

        [Fact]
        public async Task LoginUser_ReturnsOkResult_WhenUserLogsInSuccessfully()
        {
            // Arrange
            var loginUserDto = new LoginUserDto
            {
                Email = "sevennine@automail.com",
                Password = "ABcd12!@"
            };

            var loginResponseDto = new LoginResponseDto
            {
                Id = 3087,
                Email = loginUserDto.Email,
                Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLXNwb3J0LWV2ZW50cy5waHA5LTAxLnRlc3Qudm94dGVuZW8uY29tXC9hcGlcL3YxXC91c2Vyc1wvbG9naW4iLCJpYXQiOjE3MTMyMzIxMDMsImV4cCI6MTcxMzMxODUwMywibmJmIjoxNzEzMjMyMTAzLCJqdGkiOiJSamU3bWFHZjg3eENjemZzIiwic3ViIjozMDg3LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.N4GzzG5Lyy9K9BK8LwbvPWsiigmDbwiA9ro2T2NnY2E"
            };

            _mockAuthService.Setup(service => service.LoginUserAsync(loginUserDto))
                .ReturnsAsync(loginResponseDto);

            // Act
            var result = await _controller.LoginUser(loginUserDto);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsType<LoginResponseDto>(okResult.Value);
            var returnedUser = okResult.Value as LoginResponseDto;
            Assert.Equal(loginResponseDto.Id, returnedUser.Id);
            Assert.Equal(loginResponseDto.Email, returnedUser.Email);
            Assert.Equal(loginResponseDto.Token, returnedUser.Token);
        }

        [Fact]
        public async Task GetUser_ReturnsOkResult_WhenUserIsFound()
        {
            // Arrange
            int id = 3085;
            string token = "Bearer token";
            var registeredUserDto = new RegisteredUserDto
            {
                Id = id,
                FirstName = "stringker",
                LastName = "string",
                Email = "satrio@kamal.com"
            };

            _mockAuthService.Setup(service => service.GetUserById(id, token))
                .ReturnsAsync(registeredUserDto);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = token;
            _controller.ControllerContext.HttpContext = httpContext;

            // Act
            var result = await _controller.GetUser(id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedUser = Assert.IsType<RegisteredUserDto>(okResult.Value);
            Assert.Equal(registeredUserDto.Id, returnedUser.Id);
            Assert.Equal(registeredUserDto.FirstName, returnedUser.FirstName);
            Assert.Equal(registeredUserDto.LastName, returnedUser.LastName);
            Assert.Equal(registeredUserDto.Email, returnedUser.Email);
        }

        [Fact]
        public async Task GetUser_ReturnsNotFound_WhenUserIsNotFound()
        {
            // Arrange
            int id = 3085;
            string token = "Bearer token";

            _mockAuthService.Setup(service => service.GetUserById(id, token))
                .ReturnsAsync((RegisteredUserDto)null);

            var httpContext = new DefaultHttpContext();
            httpContext.Request.Headers["Authorization"] = token;
            _controller.ControllerContext.HttpContext = httpContext;

            // Act
            var result = await _controller.GetUser(id);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result.Result);
            var notFoundResult = result.Result as NotFoundObjectResult;
            Assert.NotNull(notFoundResult.Value);

            var value = notFoundResult.Value as dynamic;
            Assert.Equal($"No query results for model [App\\User] {id}", value.message.ToString());
            Assert.Equal(404, (int)value.status_code);
        }
    }
}
