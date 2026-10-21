# 0013. The command-line tool parses arguments with System.CommandLine

- Status: Accepted
- Date: 2026-10-21

## Context

`Coop.Cli` has a dozen command groups and about forty commands, each with its
own required and optional options (L2-REQ-102). Every group and command needs
`--help`, parse errors need plain messages and a non-zero exit code, and
tests need to run a command with its output captured.

Writing a parser by hand would mean writing help text, required-option
checks, type conversion and error reporting for each command.

## Decision

- Use `System.CommandLine` 2.0, the Microsoft library the `dotnet` tool itself
  uses. It is the one package `Coop.Cli` adds; its version is set in
  `Coop.Cli.csproj` like every other package in the backend.
- Each group is built by one class in `Coop.Cli/Commands/` (for example
  `UserCommands`) that declares its options and sets each command's action to
  send a MediatR request.
- `CliApp.RunAsync(args, output, error, configureServices)` builds the
  services, parses the arguments and invokes the command with the given
  output and error writers. `Program.cs` passes the console; tests pass
  string writers and replace the database.

## Consequences

- `--help`, unknown commands, missing required options and wrong option
  types are handled and reported by the library with exit code 1.
- The tool depends on the library's API, which changed between its preview
  releases and 2.0; upgrades go through the same review as any package.
