// File: src/app/p/cast/components/traits/components/BasicTraits.tsx
'use client';

import { useTraits } from "../hooks/useTraits";
import { Button } from "@mui/material";

interface Props {
    onTraitsChange?: (updatedTraits: number[]) => void; // ✅ 追加
}

export default function BasicTraits({ onTraitsChange }: Props) {
    const { traitsByCategory, selectedTraits, error, toggleTrait } = useTraits();

    // ✅ 選択状態を更新し、onTraitsChange を呼び出す
    const handleToggleTrait = (traitId: number) => {
        toggleTrait(traitId);
        if (onTraitsChange) {
            const updatedTraits = selectedTraits.includes(traitId)
                ? selectedTraits.filter(id => id !== traitId) // ✅ すでに選択されていれば削除
                : [...selectedTraits, traitId]; // ✅ まだ選択されていなければ追加
            onTraitsChange(updatedTraits);
        }
    };

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}

            {!error && Object.keys(traitsByCategory).length > 0 && (
                <div className="mt-4">
                    {Object.entries(traitsByCategory).map(([category, traits]) => (
                        <div key={category} className="mb-6">
                            <h2 className="text-lg font-semibold mb-2">{category}</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {traits.map((trait) => (
                                    <Button
                                        key={trait.id}
                                        variant={selectedTraits.includes(trait.id) ? "contained" : "outlined"}
                                        color="primary"
                                        className="w-full text-sm px-4 py-2 shadow-sm"
                                        onClick={() => handleToggleTrait(trait.id)}
                                    >
                                        {trait.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
