<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncMigrations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrations:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Register untracked migration files into the migrations table without recreating existing tables';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
       $migrator = app('migrator');
    $paths = array_merge($migrator->paths(), [database_path('migrations')]);
    $files =$migrator->getMigrationFiles($paths);$ran = DB::table('migrations')->pluck('migration')->toArray();
        $batch = (DB::table('migrations')->max('batch') ?? 0) + 1;

        $synced = 0;
        foreach ($files as $name => $path) {
            if (!in_array($name, $ran)) {
                DB::table('migrations')->insert([
                    'migration' => $name,
                    'batch' => $batch,
                ]);
                $this->info("Synced: {$name}");
                $synced++;
            }
        }

        if ($synced === 0) {
            $this->comment('All migrations are already tracked in the database.');
        } else {
            $this->info("Successfully registered {$synced} migration(s).");
        }

        return Command::SUCCESS;
    }
}