﻿using Vox.Server.DTOs;
using Vox.Server.DTOs.Organizer;

namespace Vox.Server.Services
{
    public interface IOrganizerService
    {
        Task<OrganizersResponseDto> GetOrganizersAsync(string token, int page, int perPage);
        Task<OrganizerDto> GetOrganizerByIdAsync(int id, string token);
        Task<OrganizerDto> CreateOrganizerAsync(CreateOrganizerDto createOrganizerDto, string token);
        Task<ErrorResponse> UpdateOrganizerAsync(int id, CreateOrganizerDto updateOrganizerDto, string token);
        Task<HttpResponseMessage> DeleteOrganizerAsync(int id, string token);
    }
}
