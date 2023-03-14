using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics.Internal;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Microsoft.EntityFrameworkCore.Scaffolding;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;
using Microsoft.EntityFrameworkCore.SqlServer.Diagnostics.Internal;
using Microsoft.EntityFrameworkCore.SqlServer.Scaffolding.Internal;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Coop.Testing.Utilities;

 public class SqlServerDatabaseCleaner : RelationalDatabaseCleaner
 {
     protected override IDatabaseModelFactory CreateDatabaseModelFactory(ILoggerFactory loggerFactory)
         => new SqlServerDatabaseModelFactory(
             new DiagnosticsLogger<DbLoggerCategory.Scaffolding>(
                 loggerFactory,
                 new LoggingOptions(),
                 new DiagnosticListener("Fake"),
                 new SqlServerLoggingDefinitions(),
                 new NullDbContextLogger()));
     protected override bool AcceptTable(DatabaseTable table)
         => !(table is DatabaseView);
     protected override bool AcceptIndex(DatabaseIndex index)
         => false;
    private readonly string _dropViewsSql = @"
 SELECT @name =
 (SELECT TOP 1 QUOTENAME(s.[name]) + '.' + QUOTENAME(o.[name])
  FROM sysobjects o
  INNER JOIN sys.views v ON o.id = v.object_id
  INNER JOIN sys.schemas s ON s.schema_id = v.schema_id
  WHERE (s.name = 'dbo' OR s.principal_id <> s.schema_id) AND o.[type] = 'V' AND o.category = 0 AND o.[name] NOT IN
  (
     SELECT referenced_entity_name
     FROM sys.sql_expression_dependencies AS sed
     INNER JOIN sys.objects AS o ON sed.referencing_id = o.object_id
  )
  ORDER BY v.[name])
 SELECT @SQL = 'DROP VIEW ' + @name
 EXEC (@SQL)
     protected override string BuildCustomSql(DatabaseModel databaseModel)
         => _dropViewsSql;
     protected override string BuildCustomEndingSql(DatabaseModel databaseModel)
         => _dropViewsSql
             + @";
     protected override MigrationOperation Drop(DatabaseTable table)
         => AddSqlServerSpecificAnnotations(base.Drop(table), table);
     protected override MigrationOperation Drop(DatabaseForeignKey foreignKey)
         => AddSqlServerSpecificAnnotations(base.Drop(foreignKey), foreignKey.Table);
     protected override MigrationOperation Drop(DatabaseIndex index)
         => AddSqlServerSpecificAnnotations(base.Drop(index), index.Table);
     private static TOperation AddSqlServerSpecificAnnotations<TOperation>(TOperation operation, DatabaseTable table)
         where TOperation : MigrationOperation
     {
         return operation;
     }
 }
