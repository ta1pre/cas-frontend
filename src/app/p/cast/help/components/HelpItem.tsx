import React from 'react';
import { HelpArticle } from '../hooks/useHelpData';

interface HelpItemProps {
    article: HelpArticle;
}

export function HelpItem({ article }: HelpItemProps) {
    return (
        <div className="border-b p-4">
            <h3 className="text-lg font-bold">{article.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
            {article.adult && <span className="text-red-500 text-sm">🔞 アダルト</span>}
        </div>
    );
}
