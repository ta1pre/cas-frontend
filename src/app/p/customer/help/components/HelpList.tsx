import React from 'react';
import { HelpArticle } from '../hooks/useHelpData';
import { HelpItem } from './HelpItem';

interface HelpListProps {
    articles: HelpArticle[];
}

export function HelpList({ articles }: HelpListProps) {
    return (
        <div>
            {articles.length === 0 ? (
                <p>記事がありません</p>
            ) : (
                articles.map((article) => (
                    <HelpItem key={article.id} article={article} />
                ))
            )}
        </div>
    );
}
