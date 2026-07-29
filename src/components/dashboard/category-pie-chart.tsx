"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getCategoryColor, getCategoryLabel } from "@/lib/categories";

export interface CategorySlice {
  category: string;
  total: number;
}

export function CategoryPieChart({ data }: { data: CategorySlice[] }) {
  const hasData = data.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={getCategoryColor(entry.category)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, item) => [
                    formatCurrency(Number(value)),
                    getCategoryLabel(String(item.payload.category)),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {data.map((entry) => (
                <div
                  key={entry.category}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getCategoryColor(entry.category) }}
                  />
                  {getCategoryLabel(entry.category)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            Nenhuma despesa registrada neste período.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
