
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
            <Link
                to="/"
                className="flex items-center hover:text-primary transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-primary transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-bold truncate">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};
