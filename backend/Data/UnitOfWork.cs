using Npgsql;

namespace BusinessManagementApi.Data;

public class UnitOfWork : IAsyncDisposable
{
    private readonly NpgsqlDataSource _dataSource;
    private NpgsqlConnection? _connection;
    private NpgsqlTransaction? _transaction;

    public UnitOfWork(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task BeginAsync()
    {
        if (_transaction != null)
            throw new InvalidOperationException("A transaction is already active.");

        _connection = await _dataSource.OpenConnectionAsync();
        _transaction = await _connection.BeginTransactionAsync();
    }

    // Repositories call this to get a command. They never see the connection.
    public NpgsqlCommand CreateCommand(string sql)
    {
        if (_transaction == null)
            return _dataSource.CreateCommand(sql); // no transaction: own pooled connection

        return new NpgsqlCommand(sql, _connection, _transaction); // join the transaction
    }

    public async Task CommitAsync()
    {
        if (_transaction == null)
            throw new InvalidOperationException("No active transaction to commit.");

        await _transaction.CommitAsync();
        await CleanupAsync();
    }

    public async Task RollbackAsync()
    {
        if (_transaction == null) return;

        await _transaction.RollbackAsync();
        await CleanupAsync();
    }

    // If the request ends without a commit, disposing the transaction rolls it back
    public async ValueTask DisposeAsync()
    {
        await CleanupAsync();
    }

    private async Task CleanupAsync()
    {
        if (_transaction != null)
        {
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        if (_connection != null)
        {
            await _connection.DisposeAsync();
            _connection = null;
        }
    }
}