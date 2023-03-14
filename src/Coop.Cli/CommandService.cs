// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Diagnostics;

namespace Coop.Cli;

public class CommandService : ICommandService
{
    public void Start(string arguments, string workingDirectory = null, bool waitForExit = true)
    {
        try
        {
            workingDirectory ??= Environment.CurrentDirectory;
            Console.WriteLine($"{arguments} in {workingDirectory}");
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    WindowStyle = ProcessWindowStyle.Normal,
                    FileName = "cmd.exe",
                    Arguments = $"/C {arguments}",
                    WorkingDirectory = workingDirectory
                }
            };
            process.Start();
            if (waitForExit)
            {
                process.WaitForExit();
            }
        }
        catch (Exception e)
        {
            throw;
        }
    }
}

