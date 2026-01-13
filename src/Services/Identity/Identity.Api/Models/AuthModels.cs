// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Identity.Api.Models;

public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token, Guid UserId, string Username, List<string> Roles);
public record RefreshTokenRequest(string Token);
public record ChangePasswordRequest(string OldPassword, string NewPassword);
