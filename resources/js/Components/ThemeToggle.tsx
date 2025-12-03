// resources/js/Components/ThemeToggle.tsx
import { Switch } from '@/Components/ui/switch'; // sesuaikan path shadcn kamu
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    // Inisialisasi dari localStorage / prefers-color-scheme
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        const enabled = stored ? stored === 'dark' : prefersDark;

        setIsDark(enabled);
        document.documentElement.classList.toggle('dark', enabled);
    }, []);

    const handleChange = (checked: boolean) => {
        setIsDark(checked);
        document.documentElement.classList.toggle('dark', checked);
        localStorage.setItem('theme', checked ? 'dark' : 'light');
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-card-foreground">Light</span>
            <Switch checked={isDark} onCheckedChange={handleChange} />
            <span className="text-xs text-card-foreground">Dark</span>
        </div>
    );
}
