# Erlandak Mail

Disposable temporary email service built with Laravel 12, React, Inertia.js, and Tailwind CSS.

## Features

- 🔀 Random email address generator
- 📥 Real-time inbox polling (every 2 seconds)
- 📧 IMAP integration via `webklex/php-imap`
- 📖 Inline HTML email viewer (sandboxed iframe)
- 🗑️ Auto-cleanup of emails older than 7 days
- 🖤 Premium dark theme UI

## Requirements

- PHP 8.2+
- MySQL / MariaDB
- Node.js 18+
- Composer
- IMAP-enabled mail server with catch-all

## Installation

```bash
git clone https://github.com/catherinerafael/Temporary-Email.git
cd Temporary-Email

composer install
npm install && npm run build

cp .env.example .env
php artisan key:generate
php artisan migrate
```

## Configuration (.env)

```env
APP_URL=https://your-domain.com

DB_DATABASE=erlandak_mail
DB_USERNAME=root
DB_PASSWORD=secret

IMAP_HOST=your-mail-server-ip
IMAP_PORT=993
IMAP_ENCRYPTION=ssl
IMAP_VALIDATE_CERT=false
IMAP_USERNAME=admin@erlandak.com
IMAP_PASSWORD=your-password
```

## Running

### Development
```bash
php artisan serve          # Web server
php artisan email:listen   # Email listener daemon
```

### Production (Supervisor)
```ini
[program:email-listener]
command=/usr/bin/php artisan email:listen
directory=/www/wwwroot/your-project
autostart=true
autorestart=true
user=www
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/storage/logs/supervisor.log
```

### Cron (for auto-cleanup)
```bash
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

## Artisan Commands

| Command | Description |
|---|---|
| `php artisan email:listen` | Start the email polling daemon |
| `php artisan email:cleanup` | Delete emails older than 7 days |
| `php artisan email:cleanup --days=3` | Delete emails older than 3 days |

## License

MIT
