// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Identity.Domain.Interfaces;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Identity.Domain;

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(byte[] salt, string password)
    {
        return Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 100000,
            numBytesRequested: 256 / 8));
    }
}
